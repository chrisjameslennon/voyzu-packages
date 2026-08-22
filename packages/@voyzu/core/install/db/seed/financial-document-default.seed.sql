WITH seed (company_code, document_code, code, name, target_type, allowed_account_types, override_property_name, override_scope, gl_account_code, bank_cash_control_account_code, status) AS (
  VALUES
    ('TEMPLATE', 'AP_BILL', 'PURCHASE_ACCOUNT', 'Purchase / expense account', 'GENERAL_LEDGER', ARRAY['EXPENSE', 'ASSET']::text[], 'purchase_posting_code', 'HEADER_AND_LINE', '699000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AP_CREDIT_NOTE', 'PURCHASE_REVERSAL_ACCOUNT', 'Purchase / expense reversal account', 'GENERAL_LEDGER', ARRAY['EXPENSE', 'ASSET']::text[], 'purchase_posting_code', 'HEADER_AND_LINE', '699000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AP_OPENING_BALANCE', 'OPENING_BALANCE_EQUITY_ACCOUNT', 'Opening balance equity account', 'GENERAL_LEDGER', ARRAY['EQUITY']::text[], 'opening_balance_equity_posting_code', 'HEADER', '300000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AP_PAYMENT', 'BANK_CASH_ACCOUNT', 'Payment bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
    ('TEMPLATE', 'AP_REFUND', 'BANK_CASH_ACCOUNT', 'Supplier refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
    ('TEMPLATE', 'AP_WRITE_OFF', 'SUPPLIER_WRITE_OFF_INCOME_ACCOUNT', 'Supplier balance write-off income account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'write_off_income_posting_code', 'HEADER', '452000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AR_CREDIT_NOTE', 'REVENUE_REVERSAL_ACCOUNT', 'Revenue reversal account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'revenue_posting_code', 'HEADER_AND_LINE', '400000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AR_INVOICE', 'REVENUE_ACCOUNT', 'Revenue account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'revenue_posting_code', 'HEADER_AND_LINE', '400000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AR_OPENING_BALANCE', 'OPENING_BALANCE_EQUITY_ACCOUNT', 'Opening balance equity account', 'GENERAL_LEDGER', ARRAY['EQUITY']::text[], 'opening_balance_equity_posting_code', 'HEADER', '300000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'AR_RECEIPT', 'BANK_CASH_ACCOUNT', 'Receipt bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
    ('TEMPLATE', 'AR_REFUND', 'BANK_CASH_ACCOUNT', 'Customer refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
    ('TEMPLATE', 'AR_WRITE_OFF', 'CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT', 'Customer balance write-off expense account', 'GENERAL_LEDGER', ARRAY['EXPENSE']::text[], 'write_off_expense_posting_code', 'HEADER', '610000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'TAX_ADJUSTMENT', 'TAX_ADJUSTMENT_OFFSET_ACCOUNT', 'Tax adjustment offset account', 'GENERAL_LEDGER', ARRAY['EXPENSE']::text[], 'adjustment_gl_account_code', 'HEADER', '603000', NULL, 'ACTIVE'),
    ('TEMPLATE', 'TAX_PAYMENT', 'BANK_CASH_ACCOUNT', 'Tax payment bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
    ('TEMPLATE', 'TAX_REFUND', 'BANK_CASH_ACCOUNT', 'Tax refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE')
)
INSERT INTO financial_document_default (
  finance_company_id, document_code, code, name, target_type, allowed_account_types,
  override_property_name, override_scope, gl_account_id, bank_cash_control_account_id,
  status, creation_actor_type, updated_actor_type
)
SELECT fc.id, s.document_code, s.code, s.name, s.target_type, s.allowed_account_types,
  s.override_property_name, s.override_scope, ga.id, bca.id,
  s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_company fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
LEFT JOIN gl_account ga ON ga.finance_company_id = fc.id AND ga.code = s.gl_account_code
LEFT JOIN bank_cash_control_account bca ON bca.finance_company_id = fc.id AND bca.code = s.bank_cash_control_account_code
ON CONFLICT (finance_company_id, document_code, code) DO UPDATE SET
  name = EXCLUDED.name,
  target_type = EXCLUDED.target_type,
  allowed_account_types = EXCLUDED.allowed_account_types,
  override_property_name = EXCLUDED.override_property_name,
  override_scope = EXCLUDED.override_scope,
  gl_account_id = EXCLUDED.gl_account_id,
  bank_cash_control_account_id = EXCLUDED.bank_cash_control_account_id,
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
