CREATE TABLE IF NOT EXISTS finance_country (
    code iso_country_code PRIMARY KEY REFERENCES country(code),
    financial_period_start_month CHAR(3),
    tax_filing_anchor_month INTEGER NOT NULL DEFAULT 3 CHECK (tax_filing_anchor_month BETWEEN 1 AND 12),
    tax_filing_interval_months INTEGER NOT NULL DEFAULT 3 CHECK (tax_filing_interval_months IN (1, 2, 3, 6, 12)),

    creation_date audit_timestamp,
    creation_actor_type actor_type,
    creation_user_id TEXT,
    creation_mutation_id UUID,
    updated_date audit_timestamp,
    updated_actor_type actor_type,
    updated_user_id TEXT,
    updated_mutation_id UUID,
    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID
);
