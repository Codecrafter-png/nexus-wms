CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  location VARCHAR(50), 
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, sku, quantity, location) VALUES
  ('Laptop', 'SKU-001', 50, 'A1'),
  ('Monitor', 'SKU-002', 30, 'A2'),
  ('Keyboard', 'SKU-003', 100, 'B1');
