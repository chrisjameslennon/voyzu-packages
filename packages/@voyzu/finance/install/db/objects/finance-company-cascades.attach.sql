DO $$
DECLARE
  constraint_row RECORD;
  constraint_definition TEXT;
BEGIN
  FOR constraint_row IN
    SELECT
      constraint_record.conrelid::regclass AS table_name,
      constraint_record.conname,
      pg_get_constraintdef(constraint_record.oid) AS definition
    FROM pg_constraint constraint_record
    WHERE constraint_record.contype = 'f'
      AND constraint_record.confrelid = 'finance_company'::regclass
      AND constraint_record.confdeltype != 'c'
  LOOP
    constraint_definition := regexp_replace(
      constraint_row.definition,
      ' ON DELETE (NO ACTION|RESTRICT|SET NULL|SET DEFAULT|CASCADE)$',
      ''
    );
    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I',
      constraint_row.table_name,
      constraint_row.conname
    );
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I %s ON DELETE CASCADE',
      constraint_row.table_name,
      constraint_row.conname,
      constraint_definition
    );
  END LOOP;
END $$;
