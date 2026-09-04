WITH seed (code, ledger, name, status, gl_account_code) AS (
  VALUES
    ('AP_TRADE_PAYABLES', 'ACCOUNTS_PAYABLE', 'Trade Payables', 'ACTIVE', '200000'),
    ('AP_UNAPPLIED_PAYMENTS', 'ACCOUNTS_PAYABLE', 'Supplier Payments Awaiting Allocation', 'ACTIVE', '201000')
)
INSERT INTO ap_control_account (finance_organization_id, code, ledger, name, status, gl_account_id, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.ledger, s.name, s.status, ga.id, 'SYSTEM', 'SYSTEM'
FROM seed s
CROSS JOIN finance_organization fc
JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    ledger = EXCLUDED.ledger,
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    gl_account_id = EXCLUDED.gl_account_id,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
