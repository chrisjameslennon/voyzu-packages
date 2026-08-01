-- ============================================================
-- AR Control Account
-- Business domain: Company Financial Settings > Control Accounts
-- ============================================================

CREATE TABLE IF NOT EXISTS ar_control_account (
    company_id            BIGINT NOT NULL,
    code                  business_code NOT NULL,
    ledger                TEXT NOT NULL CHECK (ledger = 'ACCOUNTS_RECEIVABLE'),
    name                  display_name NOT NULL,
    gl_account_id         BIGINT NOT NULL,
    status                active_status,

    creation_date         audit_timestamp,
    creation_actor_type   actor_type,
    creation_user_id      TEXT,
    creation_mutation_id UUID,
    updated_date          audit_timestamp,
    updated_actor_type    actor_type,
    updated_user_id       TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT pk_ar_control_account PRIMARY KEY (company_id, code),
    CONSTRAINT fk_ar_control_account_company FOREIGN KEY (company_id) REFERENCES company(id),
    CONSTRAINT fk_ar_control_account_gl_account FOREIGN KEY (company_id, gl_account_id) REFERENCES gl_account(company_id, id)
);