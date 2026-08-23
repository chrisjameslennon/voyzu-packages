WITH seed (company_code, code, name, description, posting_profile_code, status) AS (
  VALUES
    ('TEMPLATE', 'COMPONENTS', 'Components', 'Purchased parts used in assemblies or production', 'RAW_MATERIALS', 'ACTIVE'),
    ('TEMPLATE', 'CONSULTING_SERVICES', 'Consulting Services', 'Time-based fixed-fee or other non-stock services', 'CONSULTING_SERVICES', 'ACTIVE'),
    ('TEMPLATE', 'CONSUMABLES', 'Consumables', 'Low-value stock consumed during normal operations', 'CONSUMABLES', 'ACTIVE'),
    ('TEMPLATE', 'FINISHED_GOODS', 'Finished Goods', 'Manufactured or assembled products held for sale', 'FINISHED_GOODS', 'ACTIVE'),
    ('TEMPLATE', 'FREIGHT_AND_COURIER', 'Freight and Courier', 'Carrier freight courier and shipping costs', 'FREIGHT_COSTS', 'ACTIVE'),
    ('TEMPLATE', 'NON_INVENTORY', 'Non-inventory Purchases', 'Goods and charges that are expensed without stock tracking', 'NON_INVENTORY_PURCHASES', 'ACTIVE'),
    ('TEMPLATE', 'PACKAGING', 'Packaging', 'Packaging and fulfilment materials', 'PACKAGING', 'ACTIVE'),
    ('TEMPLATE', 'RAW_MATERIALS', 'Raw Materials', 'Materials consumed during manufacturing or production', 'RAW_MATERIALS', 'ACTIVE'),
    ('TEMPLATE', 'RESALE_GOODS', 'Resale Goods', 'Finished goods purchased from suppliers for resale', 'RESALE_GOODS', 'ACTIVE'),
    ('TEMPLATE', 'SPARE_PARTS', 'Spare Parts', 'Parts held for maintenance repair or replacement', 'SPARE_PARTS', 'ACTIVE'),
    ('TEMPLATE', 'WORK_IN_PROGRESS', 'Work in Progress', 'Part-complete products awaiting further processing', 'WIP_GOODS', 'ACTIVE')
)
INSERT INTO inventory_category (finance_company_id, code, name, description, posting_profile_id, status, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.name, s.description, p.id, s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_company fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
JOIN item_posting_profile p ON p.finance_company_id = fc.id AND p.code = s.posting_profile_code
ON CONFLICT (finance_company_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  posting_profile_id = EXCLUDED.posting_profile_id,
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
