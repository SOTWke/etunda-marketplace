-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Farms and field agents
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  size_hectares NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS field_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Harvest and produce lots
CREATE TABLE IF NOT EXISTS produce_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  produce_type VARCHAR(100) NOT NULL,
  harvest_date DATE NOT NULL,
  quantity_kg NUMERIC(12, 2) NOT NULL,
  grade VARCHAR(10),
  moisture_percent NUMERIC(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests for Quotation (RFQ)
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_id UUID REFERENCES produce_lots(id),
  buyer_email VARCHAR(255),
  produce_type VARCHAR(100),
  requested_quantity_kg NUMERIC(12, 2),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID REFERENCES rfqs(id),
  quoted_price_per_kg NUMERIC(10, 4),
  total_price NUMERIC(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  valid_until TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id),
  buyer_id UUID,
  seller_id UUID,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount NUMERIC(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_farms_created_at ON farms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_produce_lots_farm_id ON produce_lots(farm_id);
CREATE INDEX IF NOT EXISTS idx_produce_lots_harvest_date ON produce_lots(harvest_date DESC);
CREATE INDEX IF NOT EXISTS idx_rfqs_lot_id ON rfqs(lot_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_created_at ON rfqs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_rfq_id ON quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
