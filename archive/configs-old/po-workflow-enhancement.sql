-- ===============================================
-- Purchase Order Workflow Enhancement
-- Database Schema Updates
-- ===============================================

-- 1. Add tracking fields to project_rab_items for PO management
ALTER TABLE project_rab_items 
ADD COLUMN IF NOT EXISTS po_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS remaining_quantity INTEGER GENERATED ALWAYS AS (quantity - po_quantity) STORED,
ADD COLUMN IF NOT EXISTS po_status VARCHAR(50) DEFAULT 'not_ordered',
ADD COLUMN IF NOT EXISTS last_po_date TIMESTAMP;

-- Update existing records to set po_quantity = 0 where NULL
UPDATE project_rab_items SET po_quantity = 0 WHERE po_quantity IS NULL;

-- 2. Create purchase_order_items table for detailed PO tracking
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id VARCHAR(255) PRIMARY KEY,
    po_id VARCHAR(255) NOT NULL,
    rab_item_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    ordered_quantity INTEGER NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL,
    supplier_item_code VARCHAR(255),
    delivery_date DATE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'ordered',
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (rab_item_id) REFERENCES project_rab_items(id) ON DELETE CASCADE
);

-- 3. Create suppliers table for PO management
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    tax_id VARCHAR(100),
    bank_info JSONB DEFAULT '{}',
    payment_terms VARCHAR(255) DEFAULT '30 days',
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    specialization VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Update purchase_orders table structure
ALTER TABLE purchase_orders 
ADD COLUMN IF NOT EXISTS supplier_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_terms TEXT,
ADD COLUMN IF NOT EXISTS payment_terms TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_workflow_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'draft';

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_rab_items_po_status ON project_rab_items(po_status);
CREATE INDEX IF NOT EXISTS idx_project_rab_items_project_approved ON project_rab_items(project_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_po_id ON purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_rab_item_id ON purchase_order_items(rab_item_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- 6. Insert sample suppliers
INSERT INTO suppliers (id, name, code, contact_person, phone, email, specialization) VALUES
('SUP-001', 'PT Semen Indonesia', 'SEMEN-001', 'Budi Santoso', '021-12345678', 'budi@semenindonesia.com', 'Semen & Material Bangunan'),
('SUP-002', 'CV Baja Prima', 'BAJA-001', 'Siti Rahman', '021-87654321', 'siti@bajaprima.com', 'Besi & Baja Konstruksi'),
('SUP-003', 'Toko Material Sejahtera', 'MAT-001', 'Ahmad Wijaya', '021-11223344', 'ahmad@materialsejahtera.com', 'Material Bangunan Umum'),
('SUP-004', 'PT Kayu Jati Indah', 'KAYU-001', 'Dewi Lestari', '021-99887766', 'dewi@kayujati.com', 'Kayu & Material Finishing'),
('SUP-005', 'CV Listrik Nusantara', 'LISTRIK-001', 'Eko Prasetyo', '021-55443322', 'eko@listriknus.com', 'Material Elektrikal & MEP')
ON CONFLICT (id) DO NOTHING;

-- 7. Create view for PO dashboard
CREATE OR REPLACE VIEW po_dashboard_view AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.status as project_status,
    s.name as subsidiary_name,
    COUNT(r.id) as total_rab_items,
    COUNT(CASE WHEN r.is_approved = true THEN 1 END) as approved_rab_items,
    COUNT(CASE WHEN r.is_approved = true AND r.po_quantity < r.quantity THEN 1 END) as available_for_po,
    SUM(CASE WHEN r.is_approved = true THEN r.subtotal ELSE 0 END) as approved_budget,
    SUM(CASE WHEN r.is_approved = true THEN (r.quantity - r.po_quantity) * r.unit_price ELSE 0 END) as remaining_budget
FROM projects p
LEFT JOIN subsidiaries s ON p.subsidiary_id = s.id
LEFT JOIN project_rab_items r ON p.id = r.project_id
GROUP BY p.id, p.name, p.status, s.name;

COMMENT ON VIEW po_dashboard_view IS 'Dashboard view for Purchase Order management showing project readiness for PO creation';
