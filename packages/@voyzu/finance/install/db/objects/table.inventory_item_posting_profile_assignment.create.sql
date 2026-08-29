CREATE TABLE IF NOT EXISTS inventory_item_posting_profile_assignment (
    id BIGSERIAL PRIMARY KEY,
    finance_organization_id BIGINT NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    item_posting_profile_id BIGINT NOT NULL,

    creation_date audit_timestamp,
    creation_actor_type actor_type,
    creation_user_id TEXT,
    creation_mutation_id UUID,
    updated_date audit_timestamp,
    updated_actor_type actor_type,
    updated_user_id TEXT,
    updated_mutation_id UUID,
    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_inventory_item_profile_assignment_company
      FOREIGN KEY (finance_organization_id) REFERENCES finance_organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_item_profile_assignment_profile
      FOREIGN KEY (finance_organization_id, item_posting_profile_id)
      REFERENCES item_posting_profile(finance_organization_id, id),
    CONSTRAINT uq_inventory_item_profile_assignment_item
      UNIQUE (finance_organization_id, inventory_item_id)
);

-- Move assignments from the legacy Inventory-owned column when upgrading an
-- installation where both packages are present. No foreign key is created to
-- Inventory: the item id is an external package reference resolved by operation.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'item'
      AND column_name = 'item_posting_code_id'
  ) THEN
    INSERT INTO inventory_item_posting_profile_assignment (
      finance_organization_id, inventory_item_id, item_posting_profile_id,
      creation_date, creation_actor_type, creation_user_id, creation_mutation_id,
      updated_date, updated_actor_type, updated_user_id, updated_mutation_id
    )
    SELECT finance.id, item.id, item.item_posting_code_id,
      item.creation_date, item.creation_actor_type, item.creation_user_id, item.creation_mutation_id,
      item.updated_date, item.updated_actor_type, item.updated_user_id, item.updated_mutation_id
    FROM item
    JOIN finance_organization finance ON finance.organization_id = item.organization_id
    JOIN item_posting_profile profile
      ON profile.finance_organization_id = finance.id
     AND profile.id = item.item_posting_code_id
    WHERE item.item_posting_code_id IS NOT NULL
    ON CONFLICT (finance_organization_id, inventory_item_id) DO UPDATE
      SET item_posting_profile_id = EXCLUDED.item_posting_profile_id,
          updated_date = EXCLUDED.updated_date,
          updated_actor_type = EXCLUDED.updated_actor_type,
          updated_user_id = EXCLUDED.updated_user_id,
          updated_mutation_id = EXCLUDED.updated_mutation_id;

    IF EXISTS (
      SELECT 1
      FROM item
      JOIN finance_organization finance ON finance.organization_id = item.organization_id
      LEFT JOIN inventory_item_posting_profile_assignment assignment
        ON assignment.finance_organization_id = finance.id
       AND assignment.inventory_item_id = item.id
      WHERE item.item_posting_code_id IS NOT NULL
        AND assignment.id IS NULL
    ) THEN
      RAISE EXCEPTION 'One or more legacy inventory item posting assignments could not be migrated';
    END IF;
  END IF;
END
$$;
