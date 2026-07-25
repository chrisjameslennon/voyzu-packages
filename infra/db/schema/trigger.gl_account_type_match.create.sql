DROP FUNCTION IF EXISTS gl_account_type_match_fn CASCADE;

CREATE OR REPLACE FUNCTION gl_account_type_match_fn() RETURNS TRIGGER AS $$
DECLARE
  v_category_account_type TEXT;
BEGIN
  -- Only check if account_category_id is set
  IF NEW.account_category_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT account_type INTO v_category_account_type
  FROM gl_account_category
  WHERE id = NEW.account_category_id;

  IF v_category_account_type IS NULL THEN
    RAISE EXCEPTION 'gl_account_category with id % not found', NEW.account_category_id;
  END IF;

  IF NEW.account_type != v_category_account_type THEN
    RAISE EXCEPTION 'gl_account.account_type (%) must match gl_account_category.account_type (%)',
      NEW.account_type, v_category_account_type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
