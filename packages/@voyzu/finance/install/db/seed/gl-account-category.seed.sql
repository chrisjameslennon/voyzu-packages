WITH seed (company_code, code, name, account_type, sequence, status) AS (
  VALUES
    ('TEMPLATE', 'ASSET_ACCOUNTS_REC', 'Accounts Receivable', 'ASSET', 120, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_ACCUM_DEP', 'Accumulated Depreciation', 'ASSET', 220, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_BANK', 'Bank / Cash', 'ASSET', 110, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_CURRENT', 'Current Assets', 'ASSET', 100, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_INTANGIBLE', 'Intangible Assets', 'ASSET', 230, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_INVENTORY', 'Inventory', 'ASSET', 130, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_NONCURRENT', 'Non-current Assets', 'ASSET', 200, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_PPE', 'Property, Plant & Equipment', 'ASSET', 210, 'ACTIVE'),
    ('TEMPLATE', 'ASSET_PREPAYMENTS', 'Prepayments', 'ASSET', 140, 'ACTIVE'),
    ('TEMPLATE', 'EQUITY', 'Equity', 'EQUITY', 500, 'ACTIVE'),
    ('TEMPLATE', 'EQUITY_CAPITAL', 'Capital', 'EQUITY', 510, 'ACTIVE'),
    ('TEMPLATE', 'EQUITY_DRAWINGS', 'Drawings / Distributions', 'EQUITY', 530, 'ACTIVE'),
    ('TEMPLATE', 'EQUITY_RETAINED', 'Retained Earnings', 'EQUITY', 520, 'ACTIVE'),
    ('TEMPLATE', 'EXPENSE_COGS', 'Cost of Goods Sold', 'EXPENSE', 700, 'ACTIVE'),
    ('TEMPLATE', 'EXPENSE_DEPRECIATION', 'Depreciation & Amortisation', 'EXPENSE', 850, 'ACTIVE'),
    ('TEMPLATE', 'EXPENSE_INTEREST', 'Finance Costs', 'EXPENSE', 860, 'ACTIVE'),
    ('TEMPLATE', 'EXPENSE_OPERATING', 'Operating Expenses', 'EXPENSE', 800, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_AP', 'Accounts Payable', 'LIABILITY', 310, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_CURRENT', 'Current Liabilities', 'LIABILITY', 300, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_DEFERRED', 'Deferred Revenue', 'LIABILITY', 340, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_GST', 'GST / VAT', 'LIABILITY', 320, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_LOANS', 'Loans', 'LIABILITY', 410, 'ACTIVE'),
    ('TEMPLATE', 'LIABILITY_PAYROLL', 'Payroll Liabilities', 'LIABILITY', 330, 'ACTIVE'),
    ('TEMPLATE', 'REVENUE_OPERATING', 'Operating Revenue', 'REVENUE', 600, 'ACTIVE'),
    ('TEMPLATE', 'REVENUE_OTHER', 'Other Income', 'REVENUE', 650, 'ACTIVE')
)
INSERT INTO gl_account_category (finance_organization_id, code, name, account_type, sequence, status, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.name, s.account_type, s.sequence, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s JOIN finance_organization fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    account_type = EXCLUDED.account_type,
    sequence = EXCLUDED.sequence,
    status = EXCLUDED.status,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
