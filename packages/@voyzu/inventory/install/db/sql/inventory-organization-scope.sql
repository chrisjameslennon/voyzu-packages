-- Upgrade the initial, unscoped inventory skeleton.
-- Ownership cannot be inferred for legacy rows, so the upgrade stops if any
-- inventory data exists rather than assigning it to an arbitrary organization.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'item'
       AND column_name = 'organization_id'
  ) THEN
    IF EXISTS (SELECT 1 FROM item_category LIMIT 1)
       OR EXISTS (SELECT 1 FROM item LIMIT 1)
       OR EXISTS (SELECT 1 FROM item_component LIMIT 1)
       OR EXISTS (SELECT 1 FROM warehouse LIMIT 1)
       OR EXISTS (SELECT 1 FROM inventory_transaction LIMIT 1)
       OR EXISTS (SELECT 1 FROM inventory_transaction_line LIMIT 1)
       OR EXISTS (SELECT 1 FROM inventory_reservation LIMIT 1)
       OR EXISTS (SELECT 1 FROM stock_count LIMIT 1)
       OR EXISTS (SELECT 1 FROM stock_count_line LIMIT 1)
       OR EXISTS (SELECT 1 FROM option_list LIMIT 1)
       OR EXISTS (SELECT 1 FROM option_list_value LIMIT 1)
       OR EXISTS (SELECT 1 FROM custom_field LIMIT 1)
       OR EXISTS (SELECT 1 FROM custom_field_value LIMIT 1)
    THEN
      RAISE EXCEPTION
        'Cannot add organization ownership: existing inventory rows have no organization assignment';
    END IF;

    ALTER TABLE item_category ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE item ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE item_component ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE warehouse ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE inventory_transaction ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE inventory_transaction_line ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE inventory_reservation ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE stock_count ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE stock_count_line ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE option_list ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE option_list_value ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE custom_field ADD COLUMN organization_id BIGINT NOT NULL;
    ALTER TABLE custom_field_value ADD COLUMN organization_id BIGINT NOT NULL;

    ALTER TABLE item_category DROP CONSTRAINT IF EXISTS item_category_code_key;
    ALTER TABLE item DROP CONSTRAINT IF EXISTS item_sku_key;
    ALTER TABLE warehouse DROP CONSTRAINT IF EXISTS warehouse_code_key;
    ALTER TABLE stock_count DROP CONSTRAINT IF EXISTS stock_count_count_no_key;

    ALTER TABLE item DROP CONSTRAINT IF EXISTS fk_item_category;
    ALTER TABLE item_component DROP CONSTRAINT IF EXISTS fk_item_component_item;
    ALTER TABLE item_component DROP CONSTRAINT IF EXISTS fk_item_component_component;
    ALTER TABLE item_component DROP CONSTRAINT IF EXISTS uq_item_component;
    ALTER TABLE inventory_transaction_line DROP CONSTRAINT IF EXISTS fk_inventory_transaction_line_header;
    ALTER TABLE inventory_transaction_line DROP CONSTRAINT IF EXISTS fk_inventory_transaction_line_item;
    ALTER TABLE inventory_transaction_line DROP CONSTRAINT IF EXISTS fk_inventory_transaction_line_warehouse;
    ALTER TABLE inventory_reservation DROP CONSTRAINT IF EXISTS fk_inventory_reservation_item;
    ALTER TABLE inventory_reservation DROP CONSTRAINT IF EXISTS fk_inventory_reservation_warehouse;
    ALTER TABLE stock_count DROP CONSTRAINT IF EXISTS fk_stock_count_warehouse;
    ALTER TABLE stock_count_line DROP CONSTRAINT IF EXISTS fk_stock_count_line_header;
    ALTER TABLE stock_count_line DROP CONSTRAINT IF EXISTS fk_stock_count_line_item;
    ALTER TABLE stock_count_line DROP CONSTRAINT IF EXISTS uq_stock_count_line;
    ALTER TABLE option_list_value DROP CONSTRAINT IF EXISTS fk_option_list_value_list;
    ALTER TABLE option_list_value DROP CONSTRAINT IF EXISTS uq_option_list_value;
    ALTER TABLE custom_field DROP CONSTRAINT IF EXISTS fk_custom_field_option_list;
    ALTER TABLE custom_field_value DROP CONSTRAINT IF EXISTS fk_custom_field_value_field;
    ALTER TABLE custom_field_value DROP CONSTRAINT IF EXISTS fk_custom_field_value_option;

    ALTER TABLE item_category
      ADD CONSTRAINT fk_item_category_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT uq_item_category_organization_code UNIQUE (organization_id, code),
      ADD CONSTRAINT uq_item_category_organization_id UNIQUE (organization_id, id);

    ALTER TABLE item
      ADD CONSTRAINT fk_item_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_item_category_scope
        FOREIGN KEY (organization_id, item_category_id)
        REFERENCES item_category(organization_id, id),
      ADD CONSTRAINT uq_item_organization_sku UNIQUE (organization_id, sku),
      ADD CONSTRAINT uq_item_organization_id UNIQUE (organization_id, id);

    ALTER TABLE item_component
      ADD CONSTRAINT fk_item_component_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_item_component_item_scope
        FOREIGN KEY (organization_id, item_id)
        REFERENCES item(organization_id, id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_item_component_component_scope
        FOREIGN KEY (organization_id, component_item_id)
        REFERENCES item(organization_id, id),
      ADD CONSTRAINT uq_item_component UNIQUE (organization_id, item_id, component_item_id);

    ALTER TABLE warehouse
      ADD CONSTRAINT fk_warehouse_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT uq_warehouse_organization_code UNIQUE (organization_id, code),
      ADD CONSTRAINT uq_warehouse_organization_id UNIQUE (organization_id, id);

    ALTER TABLE inventory_transaction
      ADD CONSTRAINT fk_inventory_transaction_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT uq_inventory_transaction_organization_id UNIQUE (organization_id, id);

    ALTER TABLE inventory_transaction_line
      ADD CONSTRAINT fk_inventory_transaction_line_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_inventory_transaction_line_header_scope
        FOREIGN KEY (organization_id, inventory_transaction_id)
        REFERENCES inventory_transaction(organization_id, id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_inventory_transaction_line_item_scope
        FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
      ADD CONSTRAINT fk_inventory_transaction_line_warehouse_scope
        FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id);

    ALTER TABLE inventory_reservation
      ADD CONSTRAINT fk_inventory_reservation_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_inventory_reservation_item_scope
        FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
      ADD CONSTRAINT fk_inventory_reservation_warehouse_scope
        FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id);

    ALTER TABLE stock_count
      ADD CONSTRAINT fk_stock_count_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_stock_count_warehouse_scope
        FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id),
      ADD CONSTRAINT uq_stock_count_organization_count_no UNIQUE (organization_id, count_no),
      ADD CONSTRAINT uq_stock_count_organization_id UNIQUE (organization_id, id);

    ALTER TABLE stock_count_line
      ADD CONSTRAINT fk_stock_count_line_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_stock_count_line_header_scope
        FOREIGN KEY (organization_id, stock_count_id)
        REFERENCES stock_count(organization_id, id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_stock_count_line_item_scope
        FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
      ADD CONSTRAINT uq_stock_count_line UNIQUE (organization_id, stock_count_id, item_id);

    ALTER TABLE option_list
      ADD CONSTRAINT fk_option_list_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT uq_option_list_organization_id UNIQUE (organization_id, id);

    ALTER TABLE option_list_value
      ADD CONSTRAINT fk_option_list_value_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_option_list_value_list_scope
        FOREIGN KEY (organization_id, option_list_id)
        REFERENCES option_list(organization_id, id) ON DELETE CASCADE,
      ADD CONSTRAINT uq_option_list_value UNIQUE (organization_id, option_list_id, value),
      ADD CONSTRAINT uq_option_list_value_organization_id UNIQUE (organization_id, id);

    ALTER TABLE custom_field
      ADD CONSTRAINT fk_custom_field_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_custom_field_option_list_scope
        FOREIGN KEY (organization_id, option_list_id)
        REFERENCES option_list(organization_id, id),
      ADD CONSTRAINT uq_custom_field_organization_id UNIQUE (organization_id, id);

    ALTER TABLE custom_field_value
      ADD CONSTRAINT fk_custom_field_value_organization
        FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_custom_field_value_field_scope
        FOREIGN KEY (organization_id, custom_field_id)
        REFERENCES custom_field(organization_id, id) ON DELETE CASCADE,
      ADD CONSTRAINT fk_custom_field_value_option_scope
        FOREIGN KEY (organization_id, option_list_value_id)
        REFERENCES option_list_value(organization_id, id);

    DROP INDEX IF EXISTS ix_item_category_id;
    DROP INDEX IF EXISTS ix_item_status;
    DROP INDEX IF EXISTS ix_item_component_component_item_id;
    DROP INDEX IF EXISTS ix_inventory_transaction_date;
    DROP INDEX IF EXISTS ix_inventory_transaction_source;
    DROP INDEX IF EXISTS ix_inventory_transaction_line_position;
    DROP INDEX IF EXISTS ix_inventory_reservation_position;
    DROP INDEX IF EXISTS ix_stock_count_warehouse_date;
    DROP INDEX IF EXISTS ix_option_list_value_sort;
    DROP INDEX IF EXISTS ix_custom_field_applies_to;
    DROP INDEX IF EXISTS ix_custom_field_value_record;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS ix_item_category_id
  ON item(organization_id, item_category_id);
CREATE INDEX IF NOT EXISTS ix_item_status
  ON item(organization_id, status);
CREATE INDEX IF NOT EXISTS ix_item_component_component_item_id
  ON item_component(organization_id, component_item_id);
CREATE INDEX IF NOT EXISTS ix_inventory_transaction_date
  ON inventory_transaction(organization_id, transaction_date);
CREATE INDEX IF NOT EXISTS ix_inventory_transaction_source
  ON inventory_transaction(organization_id, source_business_object, source_id);
CREATE INDEX IF NOT EXISTS ix_inventory_transaction_line_position
  ON inventory_transaction_line(organization_id, item_id, warehouse_id);
CREATE INDEX IF NOT EXISTS ix_inventory_reservation_position
  ON inventory_reservation(organization_id, item_id, warehouse_id, status);
CREATE INDEX IF NOT EXISTS ix_stock_count_warehouse_date
  ON stock_count(organization_id, warehouse_id, count_date);
CREATE INDEX IF NOT EXISTS ix_option_list_value_sort
  ON option_list_value(organization_id, option_list_id, sort_order);
CREATE INDEX IF NOT EXISTS ix_custom_field_applies_to
  ON custom_field(organization_id, applies_to, status);
CREATE INDEX IF NOT EXISTS ix_custom_field_value_record
  ON custom_field_value(organization_id, custom_field_id, record_id);
