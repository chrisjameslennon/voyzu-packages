CREATE TABLE IF NOT EXISTS ice_cream (
    id                       BIGSERIAL PRIMARY KEY,
    code                     TEXT NOT NULL UNIQUE,
    name                     TEXT NOT NULL,
    flavor_id                BIGINT NOT NULL,
    supplier                 TEXT NOT NULL,
    status                   TEXT NOT NULL DEFAULT 'ACTIVE',

    creation_date            audit_timestamp,
    creation_actor_type      actor_type,
    creation_user_id         TEXT,
    creation_mutation_id     UUID,

    updated_date             audit_timestamp,
    updated_actor_type       actor_type,
    updated_user_id          TEXT,
    updated_mutation_id      UUID,

    deletion_date            audit_timestamp,
    deletion_actor_type      actor_type,
    deletion_user_id         TEXT,
    deletion_mutation_id     UUID,

    CONSTRAINT fk_ice_cream_flavor
      FOREIGN KEY (flavor_id) REFERENCES ice_cream_flavor(id),
    CONSTRAINT ck_ice_cream_code
      CHECK (code = upper(code) AND btrim(code) <> ''),
    CONSTRAINT ck_ice_cream_name
      CHECK (btrim(name) <> ''),
    CONSTRAINT ck_ice_cream_supplier
      CHECK (btrim(supplier) <> ''),
    CONSTRAINT ck_ice_cream_status
      CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS ix_ice_cream_flavor_id
  ON ice_cream(flavor_id);

CREATE INDEX IF NOT EXISTS ix_ice_cream_status
  ON ice_cream(status);

DROP TRIGGER IF EXISTS ice_cream_audit_trigger ON ice_cream;
CREATE TRIGGER ice_cream_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ice_cream
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn();
