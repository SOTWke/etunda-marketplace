import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100kb' }));

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 15000,
});

// Redis setup
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis error:', err));
redis.connect().catch(console.error);

// Health checks
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    const redisReady = redis.isOpen ? 'connected' : 'disconnected';
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'ok',
      redis: redisReady,
    });
  } catch (err) {
    console.error(err);
    res.status(503).json({ status: 'error', db: 'unavailable' });
  }
});

app.get('/ready', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    console.error(err);
    res.status(503).json({ status: 'not-ready' });
  }
});

// API Routes

// Get all farms
app.get('/api/farms', async (req: Request, res: Response) => {
  const pageSize = Math.min(Number(req.query.limit) || 25, 100);
  const cursor = req.query.cursor as string | undefined;

  try {
    const result = await pool.query(
      `SELECT id, name, owner_name, ST_AsGeoJSON(location) AS location, size_hectares, created_at
       FROM farms
       WHERE ($1::timestamp IS NULL OR created_at < $1)
       ORDER BY created_at DESC, id DESC
       LIMIT $2`,
      [cursor ? new Date(cursor).toISOString() : null, pageSize]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// Create a farm
app.post('/api/farms', async (req: Request, res: Response) => {
  const { name, owner_name, latitude, longitude, size_hectares } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO farms (name, owner_name, location, size_hectares)
       VALUES ($1, $2, ST_GeomFromText('POINT($3 $4)', 4326), $5)
       RETURNING id, name, owner_name, ST_AsGeoJSON(location) AS location, size_hectares, created_at`,
      [name, owner_name, longitude, latitude, size_hectares]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// Get produce lots
app.get('/api/produce-lots', async (req: Request, res: Response) => {
  const pageSize = Math.min(Number(req.query.limit) || 25, 100);
  const cursor = req.query.cursor as string | undefined;

  try {
    const result = await pool.query(
      `SELECT id, farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent, created_at
       FROM produce_lots
       WHERE ($1::date IS NULL OR harvest_date < $1)
       ORDER BY harvest_date DESC, id DESC
       LIMIT $2`,
      [cursor || null, pageSize]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch produce lots' });
  }
});

// Create a produce lot
app.post('/api/produce-lots', async (req: Request, res: Response) => {
  const { farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO produce_lots (farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent, created_at`,
      [farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create produce lot' });
  }
});

// Get RFQs (Requests for Quotation)
app.get('/api/rfqs', async (req: Request, res: Response) => {
  const pageSize = Math.min(Number(req.query.limit) || 25, 100);
  const cursor = req.query.cursor as string | undefined;

  try {
    const result = await pool.query(
      `SELECT id, lot_id, buyer_email, produce_type, requested_quantity_kg, status, created_at
       FROM rfqs
       WHERE ($1::timestamp IS NULL OR created_at < $1)
       ORDER BY created_at DESC, id DESC
       LIMIT $2`,
      [cursor ? new Date(cursor).toISOString() : null, pageSize]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch RFQs' });
  }
});

// Create an RFQ
app.post('/api/rfqs', async (req: Request, res: Response) => {
  const { lot_id, buyer_email, produce_type, requested_quantity_kg } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO rfqs (lot_id, buyer_email, produce_type, requested_quantity_kg, status)
       VALUES ($1, $2, $3, $4, 'open')
       RETURNING id, lot_id, buyer_email, produce_type, requested_quantity_kg, status, created_at`,
      [lot_id, buyer_email, produce_type, requested_quantity_kg]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create RFQ' });
  }
});

// Get quotes
app.get('/api/quotes', async (req: Request, res: Response) => {
  const pageSize = Math.min(Number(req.query.limit) || 25, 100);
  const cursor = req.query.cursor as string | undefined;

  try {
    const result = await pool.query(
      `SELECT id, rfq_id, quoted_price_per_kg, total_price, currency, valid_until, status, created_at
       FROM quotes
       WHERE ($1::timestamp IS NULL OR created_at < $1)
       ORDER BY created_at DESC, id DESC
       LIMIT $2`,
      [cursor ? new Date(cursor).toISOString() : null, pageSize]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Create a quote
app.post('/api/quotes', async (req: Request, res: Response) => {
  const { rfq_id, quoted_price_per_kg, currency, valid_until } = req.body;
  try {
    const total_price = quoted_price_per_kg * 1000; // Assume 1000kg lot for demo
    const result = await pool.query(
      `INSERT INTO quotes (rfq_id, quoted_price_per_kg, total_price, currency, valid_until, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, rfq_id, quoted_price_per_kg, total_price, currency, valid_until, status, created_at`,
      [rfq_id, quoted_price_per_kg, total_price, currency, valid_until]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// Get orders
app.get('/api/orders', async (req: Request, res: Response) => {
  const pageSize = Math.min(Number(req.query.limit) || 25, 100);
  const cursor = req.query.cursor as string | undefined;

  try {
    const result = await pool.query(
      `SELECT id, quote_id, buyer_id, seller_id, status, total_amount, currency, created_at
       FROM orders
       WHERE ($1::timestamp IS NULL OR created_at < $1)
       ORDER BY created_at DESC, id DESC
       LIMIT $2`,
      [cursor ? new Date(cursor).toISOString() : null, pageSize]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create an order
app.post('/api/orders', async (req: Request, res: Response) => {
  const { quote_id, buyer_id, seller_id, total_amount, currency } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO orders (quote_id, buyer_id, seller_id, status, total_amount, currency)
       VALUES ($1, $2, $3, 'pending', $4, $5)
       RETURNING id, quote_id, buyer_id, seller_id, status, total_amount, currency, created_at`,
      [quote_id, buyer_id, seller_id, total_amount, currency]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  await redis.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`eTunda API Server running on port ${PORT}`);
  console.log(`Database: ${process.env.DATABASE_URL}`);
  console.log(`Redis: ${process.env.REDIS_URL}`);
});
