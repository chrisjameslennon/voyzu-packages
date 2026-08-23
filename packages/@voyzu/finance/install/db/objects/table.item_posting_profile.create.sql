-- ============================================================
-- Item Posting Profile
-- Business domain: Company Financial Settings > Inventory > Item Posting Profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS item_posting_profile (
    id                            BIGSERIAL PRIMARY KEY,
    finance_company_id                    BIGINT NOT NULL,
    code                          business_code NOT NULL,
    name                          display_name NOT NULL,
    description                   description_text NOT NULL,

    is_sold                       BOOLEAN NOT NULL DEFAULT FALSE,
    is_purchased                  BOOLEAN NOT NULL DEFAULT FALSE,
    is_consumed                   BOOLEAN NOT NULL DEFAULT FALSE,

    revenue_gl_account_id         BIGINT,
    cogs_gl_account_id            BIGINT,
    purchase_expense_gl_account_id BIGINT,
    consumption_gl_account_id     BIGINT,
    adjustment_gain_gl_account_id BIGINT,
    adjustment_loss_gl_account_id BIGINT,

    status                        active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date                 audit_timestamp,
    creation_actor_type           actor_type,
    creation_user_id              TEXT,
    creation_mutation_id UUID,
    updated_date                  audit_timestamp,
    updated_actor_type            actor_type,
    updated_user_id               TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_item_posting_profile_company FOREIGN KEY (finance_company_id) REFERENCES finance_company(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_posting_profile_revenue_gl_account FOREIGN KEY (finance_company_id, revenue_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT fk_item_posting_profile_cogs_gl_account FOREIGN KEY (finance_company_id, cogs_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT fk_item_posting_profile_purchase_expense_gl_account FOREIGN KEY (finance_company_id, purchase_expense_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT fk_item_posting_profile_consumption_gl_account FOREIGN KEY (finance_company_id, consumption_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT fk_item_posting_profile_adjustment_gain_gl_account FOREIGN KEY (finance_company_id, adjustment_gain_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT fk_item_posting_profile_adjustment_loss_gl_account FOREIGN KEY (finance_company_id, adjustment_loss_gl_account_id) REFERENCES gl_account(finance_company_id, id),
    CONSTRAINT uq_item_posting_profile_company_code UNIQUE (finance_company_id, code),
    CONSTRAINT uq_item_posting_profile_finance_company_id UNIQUE (finance_company_id, id)
);
