BEGIN;

ALTER TABLE item_posting_profile
  ADD COLUMN IF NOT EXISTS is_sold BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_consumed BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE item_posting_profile profile
SET is_sold = operations.is_sold,
    is_purchased = operations.is_purchased,
    is_consumed = operations.is_consumed
FROM (
  SELECT posting_profile_id,
         bool_or(is_sold) AS is_sold,
         bool_or(is_purchased) AS is_purchased,
         bool_or(is_consumed) AS is_consumed
  FROM inventory_item
  GROUP BY posting_profile_id
) operations
WHERE operations.posting_profile_id = profile.id;

ALTER TABLE inventory_item
  DROP COLUMN IF EXISTS is_sold,
  DROP COLUMN IF EXISTS is_purchased,
  DROP COLUMN IF EXISTS is_consumed;

COMMIT;
