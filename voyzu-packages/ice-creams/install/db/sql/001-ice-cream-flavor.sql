CREATE TABLE IF NOT EXISTS ice_cream_flavor (
    id                       BIGSERIAL PRIMARY KEY,
    code                     TEXT NOT NULL UNIQUE,
    name                     TEXT NOT NULL,
    status                   entity_status NOT NULL DEFAULT 'ACTIVE',

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

    CONSTRAINT ck_ice_cream_flavor_code
      CHECK (code = upper(code) AND btrim(code) <> ''),
    CONSTRAINT ck_ice_cream_flavor_name
      CHECK (btrim(name) <> '')
);

DROP TRIGGER IF EXISTS ice_cream_flavor_audit_trigger ON ice_cream_flavor;
CREATE TRIGGER ice_cream_flavor_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ice_cream_flavor
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn();
