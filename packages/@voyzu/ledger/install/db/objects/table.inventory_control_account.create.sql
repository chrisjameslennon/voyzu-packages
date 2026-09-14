-- ============================================================
-- Inventory Control Account
-- Business domain: Company Financial Settings > Inventory Control Accounts
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_control_account (
    finance_organization_id              BIGINT NOT NULL,
    code                    business_code NOT NULL,
    ledger                  TEXT NOT NULL CHECK (ledger = 'INVENTORY'),
    name                    display_name NOT NULL,
    description             TEXT NOT NULL CHECK (
        length(description) BETWEEN 1 AND 300
        AND description = btrim(description)
    ),
    gl_account_id            BIGINT NOT NULL,
    status                   active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id UUID,
    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT pk_inventory_control_account PRIMARY KEY (finance_organization_id, code),
    CONSTRAINT fk_inventory_control_account_company FOREIGN KEY (finance_organization_id) REFERENCES finance_organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_control_account_gl_account FOREIGN KEY (finance_organization_id, gl_account_id) REFERENCES gl_account(finance_organization_id, id)
);
