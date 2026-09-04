INSERT INTO finance_organization (
  organization_id, tax_filing_anchor_month, tax_filing_interval_months,
  creation_actor_type, updated_actor_type
)
SELECT organization.id,
       COALESCE(finance_country.tax_filing_anchor_month, 3),
       COALESCE(finance_country.tax_filing_interval_months, 3),
       'SYSTEM', 'SYSTEM'
FROM organization
LEFT JOIN finance_country ON finance_country.code = organization.country_code
WHERE organization.status != 'DELETED'
ON CONFLICT (organization_id) DO UPDATE SET
  tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
  tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
