-- Finance retains valued ledger history as immutable snapshots, while @voyzu/inventory
-- owns operational items and categories.
ALTER TABLE inventory_ledger_entry_line
  ADD COLUMN IF NOT EXISTS item_code business_code,
  ADD COLUMN IF NOT EXISTS item_name display_name;

DO $$
BEGIN
  IF to_regclass('inventory_item') IS NOT NULL THEN
    EXECUTE $sql$
      UPDATE inventory_ledger_entry_line line
      SET item_code = item.code,
          item_name = item.name
      FROM inventory_item item
      WHERE line.item_id = item.id
        AND (line.item_code IS NULL OR line.item_name IS NULL)
    $sql$;
  END IF;
END
$$;

ALTER TABLE inventory_ledger_entry_line
  ALTER COLUMN item_code SET NOT NULL,
  ALTER COLUMN item_name SET NOT NULL;

ALTER TABLE inventory_ledger_entry_line
  DROP CONSTRAINT IF EXISTS fk_inventory_ledger_line_item;

DROP TABLE IF EXISTS inventory_item;
DROP TABLE IF EXISTS inventory_category;
