/* =========================
   RESET (DEV ONLY)
========================= */
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

/* =========================
   ENUM TYPES (PostgreSQL way)
========================= */
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'returned');
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'bank', 'credit');
CREATE TYPE ledger_tx_type AS ENUM ('IN', 'OUT', 'ADJUST');

/* =========================
   USERS (Auth / RBAC)
========================= */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    email VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);

/* =========================
   PRODUCTS (MASTER)
========================= */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    npk_ratio VARCHAR(20),
    unit VARCHAR(20) DEFAULT 'kg',
    gst_rate DECIMAL(5,2) DEFAULT 18.00 CHECK (gst_rate >= 0),
    reorder_level INTEGER DEFAULT 0 CHECK (reorder_level >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON products(name);

/* =========================
   SUPPLIERS
========================= */
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    gstin VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   CUSTOMERS
========================= */
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    gstin VARCHAR(15) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   PURCHASES
========================= */
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50),
    purchase_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    gst_amount DECIMAL(12,2) DEFAULT 0 CHECK (gst_amount >= 0),
    status purchase_status DEFAULT 'completed',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   BATCHES (STOCK SOURCE)
========================= */
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE RESTRICT,
    batch_number VARCHAR(50) NOT NULL,
    arrival_date DATE NOT NULL,
    expiry_date DATE CHECK (expiry_date > arrival_date),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    available_qty INTEGER NOT NULL CHECK (available_qty >= 0),
    purchase_price DECIMAL(10,2) NOT NULL CHECK (purchase_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, batch_number)
);

CREATE INDEX idx_batches_product ON batches(product_id);
CREATE INDEX idx_batches_expiry ON batches(expiry_date);
CREATE INDEX idx_batches_available_qty ON batches(available_qty) WHERE available_qty > 0;

/* =========================
   PURCHASE ITEMS
========================= */
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit DECIMAL(10,2) NOT NULL CHECK (price_per_unit >= 0)
);

/* =========================
   SALES (INVOICES)
========================= */
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50),
    sale_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    gst_amount DECIMAL(12,2) DEFAULT 0 CHECK (gst_amount >= 0),
    discount DECIMAL(12,2) DEFAULT 0 CHECK (discount >= 0),
    status sale_status DEFAULT 'completed',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   SALE ITEMS (FIFO RESULT)
========================= */
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit DECIMAL(10,2) NOT NULL CHECK (price_per_unit >= 0)
);

/* =========================
   PAYMENTS
========================= */
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    sale_id INTEGER REFERENCES sales(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL,
    method payment_method NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_customer ON payments(customer_id);

/* =========================
   INVENTORY LEDGER (AUDIT CORE)
========================= */
CREATE TABLE inventory_ledger (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    batch_id INTEGER NOT NULL REFERENCES batches(id),
    transaction_type ledger_tx_type NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reference_type VARCHAR(20),   -- PURCHASE / SALE / ADJUST
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_product ON inventory_ledger(product_id);
CREATE INDEX idx_ledger_batch ON inventory_ledger(batch_id);
CREATE INDEX idx_ledger_date ON inventory_ledger(created_at);

/* =========================
   AUDIT LOG
========================= */
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50),
    entity_id INTEGER,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   VIEWS (DERIVED DATA ONLY)
========================= */

-- Stock summary
CREATE VIEW stock_summary AS
SELECT
    p.id AS product_id,
    p.name,
    COALESCE(SUM(b.available_qty), 0) AS total_stock,
    MIN(b.expiry_date) AS nearest_expiry
FROM products p
LEFT JOIN batches b ON p.id = b.product_id
GROUP BY p.id, p.name;

-- Customer outstanding balance
CREATE VIEW customer_outstanding AS
SELECT
    c.id AS customer_id,
    c.name,
    COALESCE(SUM(s.total_amount),0) -
    COALESCE(SUM(p.amount),0) AS outstanding_amount
FROM customers c
LEFT JOIN sales s ON s.customer_id = c.id AND s.status = 'completed'
LEFT JOIN payments p ON p.customer_id = c.id
GROUP BY c.id, c.name;
