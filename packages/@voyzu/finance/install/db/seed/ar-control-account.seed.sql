WITH seed (code, ledger, name, status, gl_account_code) AS (
  VALUES
    ('AR_TRADE_RECEIVABLES', 'ACCOUNTS_RECEIVABLE', 'Trade Receivables', 'ACTIVE', '110000'),
    ('AR_UNAPPLIED_CASH', 'ACCOUNTS_RECEIVABLE', 'Customer Receipts Awaiting Allocation', 'ACTIVE', '111000')
)
INSERT INTO ar_control_account (finance_organization_id, code, ledger, name, status, gl_account_id, creation_actor_type, updated_actor_type)
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
