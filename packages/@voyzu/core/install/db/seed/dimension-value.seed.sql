WITH seed (company_code, dimension_code, name, status) AS (
  VALUES
    ('TEMPLATE', 'SALES_CHANNEL', 'Direct', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Marketplace', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Online', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Partner', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Retail', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Wholesale', 'ACTIVE')
)
INSERT INTO dimension_value (company_id, dimension_id, name, status, creation_actor_type, updated_actor_type)
SELECT c.id, d.id, s.name, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN company c ON c.code = s.company_code
JOIN dimension d ON d.company_id = c.id AND d.code = s.dimension_code
ON CONFLICT (company_id, dimension_id, lower(name)) DO UPDATE SET
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
