DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'item'
      AND column_name = 'item_posting_code_id'
  ) AND EXISTS (SELECT 1 FROM item WHERE item_posting_code_id IS NOT NULL) THEN
    IF to_regclass('inventory_item_posting_profile_assignment') IS NULL THEN
      RAISE EXCEPTION 'Install or update Finance before removing legacy Inventory posting-profile assignments';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM item
      JOIN finance_organization finance ON finance.organization_id = item.organization_id
      LEFT JOIN inventory_item_posting_profile_assignment assignment
        ON assignment.finance_organization_id = finance.id
       AND assignment.inventory_item_id = item.id
       AND assignment.item_posting_profile_id = item.item_posting_code_id
      WHERE item.item_posting_code_id IS NOT NULL
        AND assignment.id IS NULL
    ) THEN
      RAISE EXCEPTION 'Legacy Inventory posting-profile assignments have not all been migrated to Finance';
    END IF;
  END IF;
END
$$;

ALTER TABLE item DROP COLUMN IF EXISTS item_posting_code_id;
