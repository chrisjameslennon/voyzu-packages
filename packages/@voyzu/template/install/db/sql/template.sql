CREATE TABLE IF NOT EXISTS template (
    id                       BIGSERIAL PRIMARY KEY,
    code                     business_code UNIQUE,
    description              description_text,
    status                   active_status,

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
    deletion_mutation_id     UUID
);

CREATE INDEX IF NOT EXISTS ix_template_status ON template(status);

DROP TRIGGER IF EXISTS template_audit_trigger ON template;
CREATE TRIGGER template_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON template
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/template');
