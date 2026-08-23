DROP TRIGGER IF EXISTS company_audit_trigger ON company;
CREATE TRIGGER company_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON company
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/erp-core');

DROP TRIGGER IF EXISTS company_user_access_audit_trigger ON company_user_access;
CREATE TRIGGER company_user_access_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON company_user_access
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/erp-core');
