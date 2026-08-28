-- @voyzu/inventory database objects.
-- Audit fields follow the standard Voyzu audited-table contract.

CREATE TABLE IF NOT EXISTS item_category (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    code                     business_code,
    name                     display_name NOT NULL,
    description              description_text NOT NULL DEFAULT '',
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_item_category_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT uq_item_category_organization_code UNIQUE (organization_id, code),
    CONSTRAINT uq_item_category_organization_id UNIQUE (organization_id, id)
);

CREATE TABLE IF NOT EXISTS item (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    sku                      business_code,
    name                     display_name NOT NULL,
    description              description_text NOT NULL DEFAULT '',
    item_category_id         BIGINT,
    unit                     TEXT,
    item_type                TEXT NOT NULL DEFAULT 'SINGLE_ITEM',
    quantity_tracked         BOOLEAN NOT NULL DEFAULT TRUE,
    item_posting_code_id     BIGINT,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_item_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_category_scope
      FOREIGN KEY (organization_id, item_category_id)
      REFERENCES item_category(organization_id, id),
    CONSTRAINT uq_item_organization_sku UNIQUE (organization_id, sku),
    CONSTRAINT uq_item_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_item_name
      CHECK (btrim(name) <> ''),
    CONSTRAINT ck_item_unit
      CHECK ((quantity_tracked AND unit IS NOT NULL AND btrim(unit) <> '' AND length(unit) <= 40)
          OR (NOT quantity_tracked AND unit IS NULL)),
    CONSTRAINT ck_item_type
      CHECK (item_type IN ('SINGLE_ITEM', 'ASSEMBLY'))
);

CREATE TABLE IF NOT EXISTS item_component (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    item_id                  BIGINT NOT NULL,
    component_item_id        BIGINT NOT NULL,
    quantity                 NUMERIC(18, 4) NOT NULL,

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_item_component_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_component_item_scope
      FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id) ON DELETE CASCADE,
    CONSTRAINT fk_item_component_component_scope
      FOREIGN KEY (organization_id, component_item_id) REFERENCES item(organization_id, id),
    CONSTRAINT uq_item_component UNIQUE (organization_id, item_id, component_item_id),
    CONSTRAINT ck_item_component_distinct CHECK (item_id <> component_item_id),
    CONSTRAINT ck_item_component_quantity CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS warehouse (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    code                     business_code,
    name                     display_name NOT NULL,
    address_line_1           TEXT NOT NULL DEFAULT '',
    address_line_2           TEXT NOT NULL DEFAULT '',
    city                     TEXT NOT NULL DEFAULT '',
    region                   TEXT NOT NULL DEFAULT '',
    postcode                 TEXT NOT NULL DEFAULT '',
    country_code             TEXT,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_warehouse_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT uq_warehouse_organization_code UNIQUE (organization_id, code),
    CONSTRAINT uq_warehouse_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_warehouse_name CHECK (btrim(name) <> ''),
    CONSTRAINT ck_warehouse_country_code
      CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$')
);

CREATE TABLE IF NOT EXISTS inventory_transaction (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    transaction_type         TEXT NOT NULL,
    transaction_date         TIMESTAMPTZ NOT NULL,
    source_business_object   TEXT,
    source_id                TEXT,
    reference                TEXT,
    notes                    TEXT NOT NULL DEFAULT '',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_inventory_transaction_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT uq_inventory_transaction_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_inventory_transaction_type
      CHECK (transaction_type IN ('RECEIPT', 'ISSUE', 'TRANSFER', 'ADJUSTMENT'))
);

CREATE TABLE IF NOT EXISTS inventory_transaction_line (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    inventory_transaction_id BIGINT NOT NULL,
    item_id                  BIGINT NOT NULL,
    warehouse_id             BIGINT NOT NULL,
    quantity_change          NUMERIC(18, 4) NOT NULL,
    unit_cost                NUMERIC(18, 4),

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_inventory_transaction_line_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_transaction_line_header_scope
      FOREIGN KEY (organization_id, inventory_transaction_id)
      REFERENCES inventory_transaction(organization_id, id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_transaction_line_item_scope
      FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
    CONSTRAINT fk_inventory_transaction_line_warehouse_scope
      FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id),
    CONSTRAINT ck_inventory_transaction_line_quantity CHECK (quantity_change <> 0),
    CONSTRAINT ck_inventory_transaction_line_cost CHECK (unit_cost IS NULL OR unit_cost >= 0)
);

CREATE TABLE IF NOT EXISTS inventory_reservation (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    item_id                  BIGINT NOT NULL,
    warehouse_id             BIGINT NOT NULL,
    quantity                 NUMERIC(18, 4) NOT NULL,
    source_business_object   TEXT,
    source_id                TEXT,
    source_line_id           TEXT,
    reference                TEXT,
    status                   TEXT NOT NULL DEFAULT 'ACTIVE',
    reserved_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at              TIMESTAMPTZ,

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_inventory_reservation_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_reservation_item_scope
      FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
    CONSTRAINT fk_inventory_reservation_warehouse_scope
      FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id),
    CONSTRAINT ck_inventory_reservation_quantity CHECK (quantity > 0),
    CONSTRAINT ck_inventory_reservation_status
      CHECK (status IN ('ACTIVE', 'RELEASED')),
    CONSTRAINT ck_inventory_reservation_release
      CHECK ((status = 'ACTIVE' AND released_at IS NULL) OR (status = 'RELEASED' AND released_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS stock_count (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    count_no                 business_code,
    warehouse_id             BIGINT NOT NULL,
    count_date               DATE NOT NULL,
    status                   TEXT NOT NULL DEFAULT 'DRAFT',
    notes                    TEXT NOT NULL DEFAULT '',
    completed_at             TIMESTAMPTZ,

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_stock_count_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_count_warehouse_scope
      FOREIGN KEY (organization_id, warehouse_id) REFERENCES warehouse(organization_id, id),
    CONSTRAINT uq_stock_count_organization_count_no UNIQUE (organization_id, count_no),
    CONSTRAINT uq_stock_count_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_stock_count_status
      CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'COMPLETED')),
    CONSTRAINT ck_stock_count_completion
      CHECK ((status = 'COMPLETED' AND completed_at IS NOT NULL) OR status <> 'COMPLETED')
);

CREATE TABLE IF NOT EXISTS stock_count_line (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    stock_count_id           BIGINT NOT NULL,
    item_id                  BIGINT NOT NULL,
    expected_quantity        NUMERIC(18, 4) NOT NULL,
    counted_quantity         NUMERIC(18, 4),

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_stock_count_line_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_count_line_header_scope
      FOREIGN KEY (organization_id, stock_count_id)
      REFERENCES stock_count(organization_id, id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_count_line_item_scope
      FOREIGN KEY (organization_id, item_id) REFERENCES item(organization_id, id),
    CONSTRAINT uq_stock_count_line UNIQUE (organization_id, stock_count_id, item_id),
    CONSTRAINT ck_stock_count_line_expected CHECK (expected_quantity >= 0),
    CONSTRAINT ck_stock_count_line_counted CHECK (counted_quantity IS NULL OR counted_quantity >= 0)
);

CREATE TABLE IF NOT EXISTS option_list (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    name                     display_name NOT NULL,
    is_shared                BOOLEAN NOT NULL DEFAULT TRUE,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_option_list_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT uq_option_list_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_option_list_name CHECK (btrim(name) <> '')
);

CREATE TABLE IF NOT EXISTS option_list_value (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    option_list_id           BIGINT NOT NULL,
    value                    TEXT NOT NULL,
    sort_order               INTEGER NOT NULL DEFAULT 0,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_option_list_value_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_option_list_value_list_scope
      FOREIGN KEY (organization_id, option_list_id)
      REFERENCES option_list(organization_id, id) ON DELETE CASCADE,
    CONSTRAINT uq_option_list_value UNIQUE (organization_id, option_list_id, value),
    CONSTRAINT uq_option_list_value_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_option_list_value_value CHECK (btrim(value) <> '')
);

CREATE TABLE IF NOT EXISTS custom_field (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    name                     display_name NOT NULL,
    data_type                TEXT NOT NULL,
    applies_to               TEXT NOT NULL,
    required                 BOOLEAN NOT NULL DEFAULT FALSE,
    option_list_id           BIGINT,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_custom_field_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_custom_field_option_list_scope
      FOREIGN KEY (organization_id, option_list_id) REFERENCES option_list(organization_id, id),
    CONSTRAINT uq_custom_field_organization_id UNIQUE (organization_id, id),
    CONSTRAINT ck_custom_field_data_type
      CHECK (data_type IN ('TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'OPTION', 'MULTIPLE_OPTIONS')),
    CONSTRAINT ck_custom_field_applies_to
      CHECK (applies_to IN ('ITEM', 'RECEIPT', 'ISSUE')),
    CONSTRAINT ck_custom_field_options
      CHECK ((data_type IN ('OPTION', 'MULTIPLE_OPTIONS') AND option_list_id IS NOT NULL)
          OR (data_type NOT IN ('OPTION', 'MULTIPLE_OPTIONS') AND option_list_id IS NULL))
);

CREATE TABLE IF NOT EXISTS custom_field_value (
    id                       BIGSERIAL PRIMARY KEY,
    organization_id          BIGINT NOT NULL,
    custom_field_id          BIGINT NOT NULL,
    record_id                BIGINT NOT NULL,
    text_value               TEXT,
    number_value             NUMERIC,
    date_value               DATE,
    boolean_value            BOOLEAN,
    option_list_value_id     BIGINT,

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,
    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_custom_field_value_organization
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_custom_field_value_field_scope
      FOREIGN KEY (organization_id, custom_field_id)
      REFERENCES custom_field(organization_id, id) ON DELETE CASCADE,
    CONSTRAINT fk_custom_field_value_option_scope
      FOREIGN KEY (organization_id, option_list_value_id)
      REFERENCES option_list_value(organization_id, id),
    CONSTRAINT ck_custom_field_value_one_value
      CHECK (num_nonnulls(text_value, number_value, date_value, boolean_value, option_list_value_id) = 1)
);

DROP TRIGGER IF EXISTS item_category_audit_trigger ON item_category;
CREATE TRIGGER item_category_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON item_category
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS item_audit_trigger ON item;
CREATE TRIGGER item_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON item
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS item_component_audit_trigger ON item_component;
CREATE TRIGGER item_component_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON item_component
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS warehouse_audit_trigger ON warehouse;
CREATE TRIGGER warehouse_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON warehouse
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS inventory_transaction_audit_trigger ON inventory_transaction;
CREATE TRIGGER inventory_transaction_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON inventory_transaction
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS inventory_transaction_line_audit_trigger ON inventory_transaction_line;
CREATE TRIGGER inventory_transaction_line_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON inventory_transaction_line
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS inventory_reservation_audit_trigger ON inventory_reservation;
CREATE TRIGGER inventory_reservation_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON inventory_reservation
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS stock_count_audit_trigger ON stock_count;
CREATE TRIGGER stock_count_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON stock_count
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS stock_count_line_audit_trigger ON stock_count_line;
CREATE TRIGGER stock_count_line_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON stock_count_line
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS option_list_audit_trigger ON option_list;
CREATE TRIGGER option_list_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON option_list
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS option_list_value_audit_trigger ON option_list_value;
CREATE TRIGGER option_list_value_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON option_list_value
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS custom_field_audit_trigger ON custom_field;
CREATE TRIGGER custom_field_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON custom_field
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');

DROP TRIGGER IF EXISTS custom_field_value_audit_trigger ON custom_field_value;
CREATE TRIGGER custom_field_value_audit_trigger BEFORE INSERT OR UPDATE OR DELETE ON custom_field_value
FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn('@voyzu/inventory');
