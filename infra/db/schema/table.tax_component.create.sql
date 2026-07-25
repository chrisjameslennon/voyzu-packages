-- ============================================================
-- Tax Component
-- Business domain: Global Settings > Localization > Tax
-- Calculation components produced by tax rules.
-- ============================================================

DROP TABLE IF EXISTS tax_component CASCADE;

CREATE TABLE tax_component (
    id                    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 10000),
    code                  business_code NOT NULL UNIQUE,
    tax_rule_country_code iso_country_code NOT NULL,
    tax_rule_code         business_code NOT NULL,
    tax_authority_code    business_code NOT NULL REFERENCES tax_authority(code),
    scheme_code           TEXT NOT NULL,
    invoice_label         TEXT NOT NULL,
    report_label          TEXT NOT NULL,
    rate                  percentage_decimal NOT NULL,
    base_amount_type      TEXT NOT NULL CHECK (base_amount_type IN ('LINE_NET_AMOUNT')),
    calculation_order     INTEGER NOT NULL CHECK (calculation_order > 0),
    description           description_text,
    status                active_status NOT NULL DEFAULT 'ACTIVE',

    -- Audit fields
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

    CONSTRAINT fk_tax_component_rule
      FOREIGN KEY (tax_rule_country_code, tax_rule_code)
      REFERENCES tax_rule(country_code, code)
);
