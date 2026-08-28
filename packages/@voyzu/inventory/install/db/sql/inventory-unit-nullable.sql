-- Quantity-untracked items do not have a stock unit.
ALTER TABLE item ALTER COLUMN unit DROP NOT NULL;
ALTER TABLE item DROP CONSTRAINT IF EXISTS ck_item_unit;
ALTER TABLE item ADD CONSTRAINT ck_item_unit
  CHECK ((quantity_tracked AND unit IS NOT NULL AND btrim(unit) <> '' AND length(unit) <= 40)
      OR (NOT quantity_tracked AND unit IS NULL));
