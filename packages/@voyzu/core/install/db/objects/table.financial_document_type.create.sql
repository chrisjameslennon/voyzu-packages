-- ============================================================
-- Financial Document Type
-- Business domain: Company Financial Settings > Financial Document Types
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_document_type (
    code                              business_code NOT NULL,
    name                              display_name NOT NULL,
    description                       TEXT NOT NULL CHECK (length(description) BETWEEN 1 AND 200 AND description = btrim(description)),
    document_purpose                  TEXT NOT NULL CHECK (length(document_purpose) BETWEEN 1 AND 70 AND document_purpose = btrim(document_purpose)),
    primary_supporting_ledger          TEXT NOT NULL CHECK (
        primary_supporting_ledger IN (
            'ACCOUNTS_PAYABLE',
            'ACCOUNTS_RECEIVABLE',
            'GENERAL',
            'TAX',
            'INVENTORY'
        )
    ),
    supports_dimensions               BOOLEAN NOT NULL DEFAULT FALSE,
    cash_movement                     BOOLEAN NOT NULL DEFAULT FALSE,
    supports_items                    BOOLEAN NOT NULL DEFAULT FALSE,
    status                            active_status NOT NULL DEFAULT 'ACTIVE',

    creation_date                     audit_timestamp,
    creation_actor_type               actor_type,
    creation_user_id                  TEXT,
    creation_mutation_id UUID,
    updated_date                      audit_timestamp,
    updated_actor_type                actor_type,
    updated_user_id                   TEXT,
    updated_mutation_id UUID,

    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT pk_financial_document_type PRIMARY KEY (code)
);
