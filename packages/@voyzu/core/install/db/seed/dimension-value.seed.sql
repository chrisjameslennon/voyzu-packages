WITH seed (company_code, dimension_code, name, status) AS (
  VALUES
    ('TEMPLATE', 'SALES_CHANNEL', 'Direct', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Marketplace', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Online', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Partner', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Retail', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Wholesale', 'ACTIVE')
)
INSERT INTO dimension_value (finance_company_id, dimension_id, name, status, creation_actor_type, updated_actor_type)
SELECT fc.id, d.id, s.name, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_company fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
JOIN dimension d ON d.finance_company_id = fc.id AND d.code = s.dimension_code
ON CONFLICT (finance_company_id, dimension_id, lower(name)) DO UPDATE SET
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
