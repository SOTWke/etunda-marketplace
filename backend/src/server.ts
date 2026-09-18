import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Configure the Supabase PostgreSQL connection string.');
}

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL?.split(',').map((value) => value.trim()) || true }));
app.use(express.json({ limit: '1mb' }));

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction || databaseUrl.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
  max: Number(process.env.DB_POOL_MAX || 10),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

let redis: RedisClientType | null = null;
if (process.env.REDIS_URL) {
  redis = createClient({ url: process.env.REDIS_URL });
  redis.on('error', (error) => console.error('Redis error:', error));
  redis.connect().catch((error) => console.warn('Redis unavailable; continuing without cache:', error.message));
}

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'degraded', database: 'unavailable' });
  }
});

app.get('/api/farms', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM farms ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch farms' }); }
});

app.post('/api/farms', async (req, res) => {
  const { name, owner_name, latitude, longitude, size_hectares } = req.body;
  if (!name || !owner_name) return res.status(400).json({ error: 'name and owner_name are required' });
  try {
    const result = await pool.query(
      `INSERT INTO farms (name, owner_name, location, size_hectares)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5) RETURNING *`,
      [name, owner_name, longitude ?? null, latitude ?? null, size_hectares ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create farm' }); }
});

app.get('/api/produce-lots', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM produce_lots ORDER BY harvest_date DESC LIMIT 50')).rows); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch produce lots' }); }
});

app.post('/api/produce-lots', async (req, res) => {
  const { farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent } = req.body;
  if (!farm_id || !produce_type || !harvest_date || quantity_kg == null) return res.status(400).json({ error: 'farm_id, produce_type, harvest_date, and quantity_kg are required' });
  try {
    const result = await pool.query(
      `INSERT INTO produce_lots (farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [farm_id, produce_type, harvest_date, quantity_kg, grade ?? null, moisture_percent ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create produce lot' }); }
});

app.get('/api/rfqs', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM rfqs ORDER BY created_at DESC LIMIT 50')).rows); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch RFQs' }); }
});

app.post('/api/rfqs', async (req, res) => {
  const { lot_id, buyer_email, produce_type, requested_quantity_kg } = req.body;
  if (!buyer_email || !produce_type || requested_quantity_kg == null) return res.status(400).json({ error: 'buyer_email, produce_type, and requested_quantity_kg are required' });
  try {
    const result = await pool.query(
      `INSERT INTO rfqs (lot_id, buyer_email, produce_type, requested_quantity_kg, status)
       VALUES ($1, $2, $3, $4, 'open') RETURNING *`,
      [lot_id ?? null, buyer_email, produce_type, requested_quantity_kg]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create RFQ' }); }
});

app.get('/api/quotes', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 50')).rows); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch quotes' }); }
});

app.post('/api/quotes', async (req, res) => {
  const { rfq_id, quoted_price_per_kg, currency = 'USD', valid_until } = req.body;
  if (!rfq_id || quoted_price_per_kg == null) return res.status(400).json({ error: 'rfq_id and quoted_price_per_kg are required' });
  try {
    const result = await pool.query(
      `INSERT INTO quotes (rfq_id, quoted_price_per_kg, total_price, currency, valid_until, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [rfq_id, quoted_price_per_kg, Number(quoted_price_per_kg) * 1000, currency, valid_until ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create quote' }); }
});

app.get('/api/orders', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50')).rows); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch orders' }); }
});

app.post('/api/orders', async (req, res) => {
  const { quote_id, buyer_id, seller_id, total_amount, currency = 'USD' } = req.body;
  if (!quote_id || total_amount == null) return res.status(400).json({ error: 'quote_id and total_amount are required' });
  try {
    const result = await pool.query(
      `INSERT INTO orders (quote_id, buyer_id, seller_id, status, total_amount, currency)
       VALUES ($1, $2, $3, 'pending', $4, $5) RETURNING *`,
      [quote_id, buyer_id ?? null, seller_id ?? null, total_amount, currency]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create order' }); }
});

const shutdown = async () => {
  await pool.end();
  if (redis?.isOpen) await redis.quit();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

app.listen(PORT, () => console.log(`eTunda API listening on port ${PORT}`));
