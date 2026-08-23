DROP TRIGGER IF EXISTS organization_audit_trigger ON organization;
CREATE TRIGGER organization_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON organization
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/erp-core');

DROP TRIGGER IF EXISTS organization_user_access_audit_trigger ON organization_user_access;
CREATE TRIGGER organization_user_access_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON organization_user_access
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/erp-core');
