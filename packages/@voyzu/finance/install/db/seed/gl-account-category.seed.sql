WITH seed (code, name, account_type, sequence, status) AS (
  VALUES
    ('ASSET_ACCOUNTS_REC', 'Accounts Receivable', 'ASSET', 120, 'ACTIVE'),
    ('ASSET_ACCUM_DEP', 'Accumulated Depreciation', 'ASSET', 220, 'ACTIVE'),
    ('ASSET_BANK', 'Bank / Cash', 'ASSET', 110, 'ACTIVE'),
    ('ASSET_CURRENT', 'Current Assets', 'ASSET', 100, 'ACTIVE'),
    ('ASSET_INTANGIBLE', 'Intangible Assets', 'ASSET', 230, 'ACTIVE'),
    ('ASSET_INVENTORY', 'Inventory', 'ASSET', 130, 'ACTIVE'),
    ('ASSET_NONCURRENT', 'Non-current Assets', 'ASSET', 200, 'ACTIVE'),
    ('ASSET_PPE', 'Property, Plant & Equipment', 'ASSET', 210, 'ACTIVE'),
    ('ASSET_PREPAYMENTS', 'Prepayments', 'ASSET', 140, 'ACTIVE'),
    ('EQUITY', 'Equity', 'EQUITY', 500, 'ACTIVE'),
    ('EQUITY_CAPITAL', 'Capital', 'EQUITY', 510, 'ACTIVE'),
    ('EQUITY_DRAWINGS', 'Drawings / Distributions', 'EQUITY', 530, 'ACTIVE'),
    ('EQUITY_RETAINED', 'Retained Earnings', 'EQUITY', 520, 'ACTIVE'),
    ('EXPENSE_COGS', 'Cost of Goods Sold', 'EXPENSE', 700, 'ACTIVE'),
    ('EXPENSE_DEPRECIATION', 'Depreciation & Amortisation', 'EXPENSE', 850, 'ACTIVE'),
    ('EXPENSE_INTEREST', 'Finance Costs', 'EXPENSE', 860, 'ACTIVE'),
    ('EXPENSE_OPERATING', 'Operating Expenses', 'EXPENSE', 800, 'ACTIVE'),
    ('LIABILITY_AP', 'Accounts Payable', 'LIABILITY', 310, 'ACTIVE'),
    ('LIABILITY_CURRENT', 'Current Liabilities', 'LIABILITY', 300, 'ACTIVE'),
    ('LIABILITY_DEFERRED', 'Deferred Revenue', 'LIABILITY', 340, 'ACTIVE'),
    ('LIABILITY_GST', 'GST / VAT', 'LIABILITY', 320, 'ACTIVE'),
    ('LIABILITY_LOANS', 'Loans', 'LIABILITY', 410, 'ACTIVE'),
    ('LIABILITY_PAYROLL', 'Payroll Liabilities', 'LIABILITY', 330, 'ACTIVE'),
    ('REVENUE_OPERATING', 'Operating Revenue', 'REVENUE', 600, 'ACTIVE'),
    ('REVENUE_OTHER', 'Other Income', 'REVENUE', 650, 'ACTIVE')
)
INSERT INTO gl_account_category (finance_organization_id, code, name, account_type, sequence, status, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.name, s.account_type, s.sequence, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s CROSS JOIN finance_organization fc
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    account_type = EXCLUDED.account_type,
    sequence = EXCLUDED.sequence,
    status = EXCLUDED.status,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
