BEGIN;

DROP TRIGGER IF EXISTS ar_control_account_audit_trigger ON ar_control_account;
CREATE TRIGGER ar_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ar_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn();

DROP TRIGGER IF EXISTS ap_control_account_audit_trigger ON ap_control_account;
CREATE TRIGGER ap_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ap_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn();

COMMIT;
