-- ============================================================
-- Tax Authority
-- Business domain: Global Settings > Localization > Tax
-- Country/region-scoped tax-collecting bodies.
-- ============================================================

CREATE TABLE IF NOT EXISTS tax_authority (
    id                    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 10000),
    code                  business_code NOT NULL UNIQUE,
    name                  display_name NOT NULL,
    country_code          iso_country_code NOT NULL REFERENCES country(code),
    region_code           TEXT,
    jurisdiction_level    TEXT NOT NULL,
    tax_family_code       tax_family_code NOT NULL,
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
    deletion_mutation_id UUID
);
