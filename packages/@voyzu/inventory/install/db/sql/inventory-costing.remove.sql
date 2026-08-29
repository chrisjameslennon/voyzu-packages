ALTER TABLE inventory_transaction_line
  DROP CONSTRAINT IF EXISTS ck_inventory_transaction_line_cost,
  DROP COLUMN IF EXISTS unit_cost;
