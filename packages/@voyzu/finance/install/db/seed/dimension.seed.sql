WITH seed (code, name, status) AS (
  VALUES
    ('COST_CENTRE', 'Cost Centre', 'ACTIVE'),
    ('DEPARTMENT', 'Department', 'ACTIVE'),
    ('PRODUCT_RANGE', 'Product Range', 'ACTIVE'),
    ('PROJECT', 'Project', 'ACTIVE'),
    ('SALES_CHANNEL', 'Sales Channel', 'ACTIVE')
)
INSERT INTO dimension (finance_organization_id, code, name, status, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.name, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s CROSS JOIN finance_organization fc
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
