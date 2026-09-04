WITH seed (code, ledger, type, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status, gl_account_code) AS (
  VALUES
    ('BANK_OPERATING', 'BANK_CASH', 'BANK', NULL, NULL, NULL, NULL, 'ACTIVE', '100000')
)
INSERT INTO bank_cash_control_account (finance_organization_id, code, ledger, type, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status, gl_account_id, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.ledger, s.type, s.bank_name, s.bank_branch_name, s.bank_account_identifier, s.cash_account_identifier, s.status, ga.id, 'SYSTEM', 'SYSTEM'
FROM seed s
CROSS JOIN finance_organization fc
JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    ledger = EXCLUDED.ledger,
    type = EXCLUDED.type,
    bank_name = EXCLUDED.bank_name,
    bank_branch_name = EXCLUDED.bank_branch_name,
    bank_account_identifier = EXCLUDED.bank_account_identifier,
    cash_account_identifier = EXCLUDED.cash_account_identifier,
    status = EXCLUDED.status,
    gl_account_id = EXCLUDED.gl_account_id,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
