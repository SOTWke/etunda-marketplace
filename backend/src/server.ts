import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Redis setup
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.connect().catch(console.error);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes

// Get all farms
app.get('/api/farms', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM farms ORDER BY created_at DESC LIMIT 50');
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
       RETURNING *`,
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
  try {
    const result = await pool.query(
      'SELECT * FROM produce_lots ORDER BY harvest_date DESC LIMIT 50'
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
       RETURNING *`,
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
  try {
    const result = await pool.query(
      'SELECT * FROM rfqs ORDER BY created_at DESC LIMIT 50'
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
       RETURNING *`,
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
  try {
    const result = await pool.query(
      'SELECT * FROM quotes ORDER BY created_at DESC LIMIT 50'
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
       RETURNING *`,
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
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
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
       RETURNING *`,
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
