DROP TRIGGER IF EXISTS ar_counterparty_audit_trigger ON ar_counterparty;
CREATE TRIGGER ar_counterparty_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ar_counterparty
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ap_counterparty_audit_trigger ON ap_counterparty;
CREATE TRIGGER ap_counterparty_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ap_counterparty
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_authority_audit_trigger ON tax_authority;
CREATE TRIGGER tax_authority_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_authority
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_rule_audit_trigger ON tax_rule;
CREATE TRIGGER tax_rule_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_rule
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_component_audit_trigger ON tax_component;
CREATE TRIGGER tax_component_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_component
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS gl_account_category_audit_trigger ON gl_account_category;
CREATE TRIGGER gl_account_category_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON gl_account_category
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS gl_account_audit_trigger ON gl_account;
CREATE TRIGGER gl_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON gl_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ar_control_account_audit_trigger ON ar_control_account;
CREATE TRIGGER ar_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ar_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ap_control_account_audit_trigger ON ap_control_account;
CREATE TRIGGER ap_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ap_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_control_account_audit_trigger ON tax_control_account;
CREATE TRIGGER tax_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS inventory_control_account_audit_trigger ON inventory_control_account;
CREATE TRIGGER inventory_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON inventory_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS inventory_category_audit_trigger ON inventory_category;
CREATE TRIGGER inventory_category_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON inventory_category
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS item_posting_profile_audit_trigger ON item_posting_profile;
CREATE TRIGGER item_posting_profile_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON item_posting_profile
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS inventory_item_audit_trigger ON inventory_item;
CREATE TRIGGER inventory_item_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON inventory_item
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS bank_cash_control_account_audit_trigger ON bank_cash_control_account;
CREATE TRIGGER bank_cash_control_account_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON bank_cash_control_account
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS dimension_audit_trigger ON dimension;
CREATE TRIGGER dimension_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON dimension
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS dimension_value_audit_trigger ON dimension_value;
CREATE TRIGGER dimension_value_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON dimension_value
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS financial_document_default_audit_trigger ON financial_document_default;
CREATE TRIGGER financial_document_default_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON financial_document_default
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS financial_document_type_audit_trigger ON financial_document_type;
CREATE TRIGGER financial_document_type_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON financial_document_type
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

-- Company Accounting tables

DROP TRIGGER IF EXISTS fiscal_year_audit_trigger ON fiscal_year;
CREATE TRIGGER fiscal_year_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON fiscal_year
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS fiscal_period_audit_trigger ON fiscal_period;
CREATE TRIGGER fiscal_period_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON fiscal_period
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS journal_audit_trigger ON journal_header;
CREATE TRIGGER journal_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON journal_header
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS journal_line_audit_trigger ON journal_line;
CREATE TRIGGER journal_line_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON journal_line
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS journal_line_dimension_audit_trigger ON journal_line_dimension;
CREATE TRIGGER journal_line_dimension_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON journal_line_dimension
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ar_subledger_entry_header_audit_trigger ON ar_subledger_entry_header;
CREATE TRIGGER ar_subledger_entry_header_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ar_subledger_entry_header
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ar_subledger_entry_line_audit_trigger ON ar_subledger_entry_line;
CREATE TRIGGER ar_subledger_entry_line_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ar_subledger_entry_line
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ap_subledger_entry_header_audit_trigger ON ap_subledger_entry_header;
CREATE TRIGGER ap_subledger_entry_header_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ap_subledger_entry_header
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS ap_subledger_entry_line_audit_trigger ON ap_subledger_entry_line;
CREATE TRIGGER ap_subledger_entry_line_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON ap_subledger_entry_line
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS inventory_ledger_entry_header_audit_trigger ON inventory_ledger_entry_header;
CREATE TRIGGER inventory_ledger_entry_header_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON inventory_ledger_entry_header
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS inventory_ledger_entry_line_audit_trigger ON inventory_ledger_entry_line;
CREATE TRIGGER inventory_ledger_entry_line_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON inventory_ledger_entry_line
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_ledger_entry_header_audit_trigger ON tax_ledger_entry_header;
CREATE TRIGGER tax_ledger_entry_header_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_ledger_entry_header
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS tax_ledger_entry_line_audit_trigger ON tax_ledger_entry_line;
CREATE TRIGGER tax_ledger_entry_line_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON tax_ledger_entry_line
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS finance_country_audit_trigger ON finance_country;
CREATE TRIGGER finance_country_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON finance_country
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');

DROP TRIGGER IF EXISTS finance_organization_audit_trigger ON finance_organization;
CREATE TRIGGER finance_organization_audit_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON finance_organization
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_fn('@voyzu/finance');
