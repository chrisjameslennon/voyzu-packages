-- ============================================================
-- Financial Document Default
-- Business domain: Company Financial Settings > Financial Document Defaults
-- ============================================================

DROP TABLE IF EXISTS posting_code_slot CASCADE;
DROP TABLE IF EXISTS posting_code CASCADE;
DROP TABLE IF EXISTS financial_document_default CASCADE;

CREATE TABLE financial_document_default (
    company_id                       BIGINT NOT NULL,
    document_code                    TEXT NOT NULL,
    code                             business_code NOT NULL,
    name                             display_name NOT NULL,
    target_type                      TEXT NOT NULL CHECK (
        target_type IN ('GENERAL_LEDGER', 'BANK_CASH_ACCOUNT')
    ),
    allowed_account_types            TEXT[] NOT NULL CHECK (
        array_length(allowed_account_types, 1) > 0
        AND allowed_account_types <@ ARRAY['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE']::TEXT[]
    ),
    override_property_name           TEXT NOT NULL CHECK (
        override_property_name ~ '^[a-z][a-z0-9_]*$'
        AND override_property_name = btrim(override_property_name)
    ),
    override_scope                   TEXT NOT NULL CHECK (
        override_scope IN ('HEADER', 'LINE', 'HEADER_AND_LINE')
    ),

    gl_account_id                    BIGINT,
    bank_cash_control_account_id     BIGINT,

    status                           active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date                    audit_timestamp,
    creation_actor_type              actor_type,
    creation_user_id                 TEXT,
    creation_mutation_id UUID,
    updated_date                     audit_timestamp,
    updated_actor_type               actor_type,
    updated_user_id                  TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_financial_document_default_company FOREIGN KEY (company_id) REFERENCES company(id),
    CONSTRAINT fk_financial_document_default_gl_account FOREIGN KEY (company_id, gl_account_id) REFERENCES gl_account(company_id, id),
    CONSTRAINT fk_financial_document_default_bank_cash_control_account FOREIGN KEY (company_id, bank_cash_control_account_id) REFERENCES bank_cash_control_account(company_id, id),
    CONSTRAINT fk_financial_document_default_document FOREIGN KEY (document_code) REFERENCES financial_document_type(code),

    CONSTRAINT chk_financial_document_default_target
        CHECK (
            (
                target_type = 'GENERAL_LEDGER'
                AND bank_cash_control_account_id IS NULL
                AND gl_account_id IS NOT NULL
            )
            OR
            (
                target_type = 'BANK_CASH_ACCOUNT'
                AND bank_cash_control_account_id IS NOT NULL
                AND gl_account_id IS NULL
            )
        ),

    CONSTRAINT pk_financial_document_default PRIMARY KEY (company_id, document_code, code)
);

CREATE UNIQUE INDEX ux_financial_document_default_document_bank_cash_control_account
    ON financial_document_default(company_id, document_code, bank_cash_control_account_id)
    WHERE bank_cash_control_account_id IS NOT NULL;
