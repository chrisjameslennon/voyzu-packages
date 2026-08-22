INSERT INTO finance_company (
  tax_filing_anchor_month, tax_filing_interval_months,
  use_organization_standard_settings, is_template,
  creation_actor_type, updated_actor_type
)
VALUES (3, 2, TRUE, TRUE, 'SYSTEM', 'SYSTEM')
ON CONFLICT (is_template) WHERE is_template = TRUE DO UPDATE SET
  tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
  tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
  use_organization_standard_settings = EXCLUDED.use_organization_standard_settings,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
