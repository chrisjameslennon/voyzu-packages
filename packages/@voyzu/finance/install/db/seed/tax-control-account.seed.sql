WITH seed (company_code, code, ledger, name, description, tax_family_code, status, gl_account_code) AS (
  VALUES
    ('TEMPLATE', 'TAX_ON_PURCHASES', 'TAX', 'Tax on Purchases', 'Tax arising from purchases the business makes, usually recoverable input tax or purchase-side tax credits.', 'INDIRECT_TAX', 'ACTIVE', '120000'),
    ('TEMPLATE', 'TAX_ON_SALES', 'TAX', 'Tax on Sales', 'Tax arising from sales the business makes, including GST/VAT output tax and US sales/use-tax sales-side obligations.', 'INDIRECT_TAX', 'ACTIVE', '220000')
)
INSERT INTO tax_control_account (finance_organization_id, code, ledger, name, description, tax_family_code, status, gl_account_id, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.ledger, s.name, s.description, s.tax_family_code, s.status, ga.id, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_organization fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    ledger = EXCLUDED.ledger,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    tax_family_code = EXCLUDED.tax_family_code,
    status = EXCLUDED.status,
    gl_account_id = EXCLUDED.gl_account_id,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
