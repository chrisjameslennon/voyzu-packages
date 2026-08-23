-- ============================================================
-- Inventory Item
-- Business domain: Finance > Inventory > Items
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_item (
    id                              BIGSERIAL PRIMARY KEY,
    finance_organization_id                      BIGINT NOT NULL,
    code                            business_code NOT NULL,
    name                            display_name NOT NULL,
    description                     description_text NOT NULL,
    item_type                       TEXT NOT NULL CHECK (item_type IN ('INVENTORY', 'NON_INVENTORY', 'SERVICE')),
    category_id                     BIGINT NOT NULL,
    unit_code                       TEXT NOT NULL CHECK (
        unit_code ~ '^[A-Za-z0-9_-]+$'
        AND length(unit_code) BETWEEN 1 AND 20
        AND unit_code = btrim(unit_code)
    ),
    quantity_on_hand_derived        NUMERIC(18,2),
    book_value_derived              NUMERIC(18,2),
    avg_unit_book_value_derived     NUMERIC(18,2),
    status                          active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date                   audit_timestamp,
    creation_actor_type             actor_type,
    creation_user_id                TEXT,
    creation_mutation_id UUID,
    updated_date                    audit_timestamp,
    updated_actor_type              actor_type,
    updated_user_id                 TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_inventory_item_company FOREIGN KEY (finance_organization_id) REFERENCES finance_organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_item_category FOREIGN KEY (finance_organization_id, category_id) REFERENCES inventory_category(finance_organization_id, id),
    CONSTRAINT uq_inventory_item_company_code UNIQUE (finance_organization_id, code),
    CONSTRAINT uq_inventory_item_finance_organization_id UNIQUE (finance_organization_id, id),
    CONSTRAINT inventory_item_stock_values_for_inventory_only CHECK (
        item_type = 'INVENTORY'
        OR (
            quantity_on_hand_derived IS NULL
            AND book_value_derived IS NULL
            AND avg_unit_book_value_derived IS NULL
        )
    )
);
