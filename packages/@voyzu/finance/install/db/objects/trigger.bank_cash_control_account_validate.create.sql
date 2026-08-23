DROP FUNCTION IF EXISTS bank_cash_control_account_validate_fn CASCADE;

CREATE OR REPLACE FUNCTION bank_cash_control_account_validate_fn() RETURNS TRIGGER AS $$
DECLARE
  linked_account_type TEXT;
BEGIN
  SELECT account_type
    INTO linked_account_type
    FROM gl_account
   WHERE id = NEW.gl_account_id;

  IF linked_account_type IS NULL THEN
    RAISE EXCEPTION 'gl_account with id % not found', NEW.gl_account_id;
  END IF;

  IF linked_account_type <> 'ASSET' THEN
    RAISE EXCEPTION 'bank_cash_control_account.gl_account_id must reference an ASSET GL account, got %', linked_account_type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
