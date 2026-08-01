WITH seed (company_code, code, name, status) AS (
  VALUES
    ('TEMPLATE', 'COST_CENTRE', 'Cost Centre', 'ACTIVE'),
    ('TEMPLATE', 'DEPARTMENT', 'Department', 'ACTIVE'),
    ('TEMPLATE', 'PRODUCT_RANGE', 'Product Range', 'ACTIVE'),
    ('TEMPLATE', 'PROJECT', 'Project', 'ACTIVE'),
    ('TEMPLATE', 'SALES_CHANNEL', 'Sales Channel', 'ACTIVE')
)
INSERT INTO dimension (company_id, code, name, status, creation_actor_type, updated_actor_type)
SELECT c.id, s.code, s.name, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s JOIN company c ON c.code = s.company_code
ON CONFLICT (company_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
