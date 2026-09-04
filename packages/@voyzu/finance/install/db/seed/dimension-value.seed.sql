WITH seed (dimension_code, name, status) AS (
  VALUES
    ('SALES_CHANNEL', 'Direct', 'ACTIVE'),
    ('SALES_CHANNEL', 'Marketplace', 'ACTIVE'),
    ('SALES_CHANNEL', 'Online', 'ACTIVE'),
    ('SALES_CHANNEL', 'Partner', 'ACTIVE'),
    ('SALES_CHANNEL', 'Retail', 'ACTIVE'),
    ('SALES_CHANNEL', 'Wholesale', 'ACTIVE')
)
INSERT INTO dimension_value (finance_organization_id, dimension_id, name, status, creation_actor_type, updated_actor_type)
SELECT fc.id, d.id, s.name, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
CROSS JOIN finance_organization fc
JOIN dimension d ON d.finance_organization_id = fc.id AND d.code = s.dimension_code
ON CONFLICT (finance_organization_id, dimension_id, lower(name)) DO UPDATE SET
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
