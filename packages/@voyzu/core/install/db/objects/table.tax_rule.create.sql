-- ============================================================
-- Tax Rule
-- Business domain: Global Settings > Localization > Tax
-- Caller supplied tax rule codes expanded by Voyzu into components.
-- ============================================================

CREATE TABLE IF NOT EXISTS tax_rule (
    id                    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 10000),
    code                  business_code NOT NULL,
    country_code          iso_country_code NOT NULL REFERENCES country(code),
    region_code           TEXT,
    name                  display_name NOT NULL,
    invoice_label         TEXT NOT NULL,
    report_label          TEXT NOT NULL,
    calculation_method    TEXT NOT NULL CHECK (calculation_method IN ('NO_TAX', 'CONFIGURED_COMPONENTS', 'CALLER_SUPPLIED')),
    component_mode        TEXT NOT NULL CHECK (component_mode IN ('NONE', 'CONFIGURED', 'CALLER_SUPPLIED')),
    component_count       INTEGER NOT NULL DEFAULT 0 CHECK (component_count >= 0),
    description           description_text,
    status                active_status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT ck_tax_rule_components CHECK (
      (component_mode = 'NONE' AND component_count = 0)
      OR
      (component_mode = 'CONFIGURED' AND component_count > 0)
      OR
      (component_mode = 'CALLER_SUPPLIED' AND component_count = 0)
    ),
    CONSTRAINT uq_tax_rule_country_code UNIQUE (country_code, code),

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
    deletion_mutation_id UUID
);
