-- Business rule triggers

DROP TRIGGER IF EXISTS gl_account_type_match_trigger ON gl_account;
CREATE TRIGGER gl_account_type_match_trigger
  BEFORE INSERT OR UPDATE ON gl_account
  FOR EACH ROW
  EXECUTE FUNCTION gl_account_type_match_fn();

DROP TRIGGER IF EXISTS bank_cash_control_account_validate_trigger ON bank_cash_control_account;
CREATE TRIGGER bank_cash_control_account_validate_trigger
  BEFORE INSERT OR UPDATE ON bank_cash_control_account
  FOR EACH ROW
  EXECUTE FUNCTION bank_cash_control_account_validate_fn();

-- Company Accounting triggers

DROP TRIGGER IF EXISTS fiscal_year_validate_trigger ON fiscal_year;
CREATE TRIGGER fiscal_year_validate_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON fiscal_year
  FOR EACH ROW
  EXECUTE FUNCTION fiscal_year_validate_fn();

DROP TRIGGER IF EXISTS fiscal_period_validate_trigger ON fiscal_period;
CREATE TRIGGER fiscal_period_validate_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON fiscal_period
  FOR EACH ROW
  EXECUTE FUNCTION fiscal_period_validate_fn();

DROP TRIGGER IF EXISTS journal_validate_trigger ON journal_header;
CREATE TRIGGER journal_validate_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON journal_header
  FOR EACH ROW
  EXECUTE FUNCTION journal_validate_fn();

DROP TRIGGER IF EXISTS journal_line_validate_trigger ON journal_line;
CREATE TRIGGER journal_line_validate_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON journal_line
  FOR EACH ROW
  EXECUTE FUNCTION journal_line_validate_fn();
