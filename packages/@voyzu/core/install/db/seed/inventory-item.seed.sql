WITH seed (company_code, code, name, description, item_type, category_code, unit_code, status) AS (
  VALUES
    ('TEMPLATE', 'CONSULTING_SERVICES', 'Consulting Services', 'Expert consultancy services offered', 'SERVICE', 'CONSULTING_SERVICES', 'service', 'ACTIVE'),
    ('TEMPLATE', 'NON-FREIGHT', 'Freight and Courier Charges', 'Freight and courier charges purchased without inventory tracking', 'NON_INVENTORY', 'FREIGHT_AND_COURIER', 'service', 'ACTIVE'),
    ('TEMPLATE', 'NON-GENERAL', 'General Non-inventory Purchase', 'General goods and charges purchased and expensed without inventory tracking', 'NON_INVENTORY', 'NON_INVENTORY', 'ea', 'ACTIVE'),
    ('TEMPLATE', 'NON-OFFICE', 'Office Supplies', 'Office supplies purchased and expensed without inventory tracking', 'NON_INVENTORY', 'NON_INVENTORY', 'ea', 'ACTIVE'),
    ('TEMPLATE', 'SVC-LABOUR', 'Labour Services', 'Labour services sold or purchased', 'SERVICE', 'CONSULTING_SERVICES', 'hour', 'ACTIVE')
)
INSERT INTO inventory_item (finance_company_id, code, name, description, item_type, category_id, unit_code, status, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.name, s.description, s.item_type, cat.id, s.unit_code, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_company fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
JOIN inventory_category cat ON cat.finance_company_id = fc.id AND cat.code = s.category_code
ON CONFLICT (finance_company_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  item_type = EXCLUDED.item_type,
  category_id = EXCLUDED.category_id,
  unit_code = EXCLUDED.unit_code,
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
