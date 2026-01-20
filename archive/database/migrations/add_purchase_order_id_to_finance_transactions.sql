-- Migration: Add purchase_order_id column to finance_transactions table
-- This enables linking finance transactions with purchase orders for automated sync

-- Add the new column
ALTER TABLE finance_transactions 
ADD COLUMN purchase_order_id VARCHAR(255) NULL;

-- Add comment for documentation
COMMENT ON COLUMN finance_transactions.purchase_order_id IS 'References PurchaseOrder.id for PO-related transactions';

-- Add index for better performance
CREATE INDEX idx_finance_transactions_purchase_order_id 
ON finance_transactions(purchase_order_id);

-- Add foreign key constraint (optional, but recommended for data integrity)
-- ALTER TABLE finance_transactions 
-- ADD CONSTRAINT fk_finance_transactions_purchase_order 
-- FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'finance_transactions' 
AND column_name = 'purchase_order_id';

-- Sample query to show the new relationship
-- SELECT ft.id, ft.description, ft.amount, po.po_number, po.supplier_name
-- FROM finance_transactions ft
-- LEFT JOIN purchase_orders po ON ft.purchase_order_id = po.id
-- WHERE ft.purchase_order_id IS NOT NULL
-- LIMIT 5;