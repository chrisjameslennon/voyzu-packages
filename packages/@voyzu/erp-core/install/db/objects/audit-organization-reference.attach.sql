DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'audit_event_organization_fk'
      AND conrelid = 'audit_event'::regclass
      AND confdeltype != 'n'
  ) THEN
    ALTER TABLE audit_event DROP CONSTRAINT audit_event_organization_fk;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'audit_event_organization_fk'
      AND conrelid = 'audit_event'::regclass
  ) THEN
    ALTER TABLE audit_event
      ADD CONSTRAINT audit_event_organization_fk
      FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE SET NULL;
  END IF;
END $$;
