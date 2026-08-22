-- ============================================================
-- Inventory Category
-- Business domain: Company Financial Settings > Inventory > Categories
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_category (
    id                      BIGSERIAL PRIMARY KEY,
    finance_company_id              BIGINT NOT NULL,
    code                    business_code NOT NULL,
    name                    display_name NOT NULL,
    description             description_text NOT NULL,
    posting_profile_id      BIGINT NOT NULL,
    status                  active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date           audit_timestamp,
    creation_actor_type     actor_type,
    creation_user_id        TEXT,
    creation_mutation_id UUID,
    updated_date            audit_timestamp,
    updated_actor_type      actor_type,
    updated_user_id         TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_inventory_category_company FOREIGN KEY (finance_company_id) REFERENCES finance_company(id),
    CONSTRAINT fk_inventory_category_posting_profile FOREIGN KEY (finance_company_id, posting_profile_id) REFERENCES item_posting_profile(finance_company_id, id),
    CONSTRAINT uq_inventory_category_company_code UNIQUE (finance_company_id, code),
    CONSTRAINT uq_inventory_category_finance_company_id UNIQUE (finance_company_id, id)
);
