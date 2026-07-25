-- ============================================================
-- Tax Control Account
-- Business domain: Company Financial Settings > Tax Accounts
-- ============================================================

DROP TABLE IF EXISTS tax_control_account CASCADE;

CREATE TABLE tax_control_account (
    company_id              BIGINT NOT NULL,
    code                    business_code NOT NULL,
    ledger                  TEXT NOT NULL CHECK (ledger = 'TAX'),
    name                    display_name NOT NULL,
    description             TEXT NOT NULL CHECK (
        length(description) BETWEEN 1 AND 300
        AND description = btrim(description)
    ),
    tax_family_code          TEXT NOT NULL CHECK (
        tax_family_code IN (
            'INDIRECT_TAX',
            'PAYROLL_TAX',
            'INCOME_TAX',
            'WITHHOLDING_TAX',
            'FRINGE_BENEFITS_TAX',
            'CUSTOMS_DUTY',
            'EXCISE_TAX',
            'PROPERTY_TAX',
            'STAMP_DUTY',
            'OTHER_TAX'
        )
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

    CONSTRAINT pk_tax_control_account PRIMARY KEY (company_id, code),
    CONSTRAINT fk_tax_control_account_company FOREIGN KEY (company_id) REFERENCES company(id),
    CONSTRAINT fk_tax_control_account_gl_account FOREIGN KEY (company_id, gl_account_id) REFERENCES gl_account(company_id, id)
);