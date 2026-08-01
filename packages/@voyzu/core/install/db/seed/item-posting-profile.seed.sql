WITH seed (company_code, code, name, description, is_sold, is_purchased, is_consumed, revenue_code, cogs_code, purchase_expense_code, consumption_code, adjustment_gain_code, adjustment_loss_code, status) AS (
  VALUES
    ('TEMPLATE', 'CONSULTING_SERVICES', 'Consulting Services', 'Services recognised as revenue when sold or service expense when purchased', TRUE, FALSE, FALSE, '403000', '501000', NULL, NULL, NULL, NULL, 'ACTIVE'),
    ('TEMPLATE', 'CONSUMABLES', 'Consumables', 'Inventory held for internal consumption and charged to consumption expense when used', FALSE, TRUE, TRUE, NULL, NULL, '613000', '613000', '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'FINISHED_GOODS', 'Finished Goods', 'Manufactured or assembled goods held in inventory and relieved to cost of goods sold when sold', TRUE, FALSE, FALSE, '400000', '500000', NULL, NULL, '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'FREIGHT_COSTS', 'Freight Costs', 'Freight and courier charges purchased and expensed without inventory tracking', FALSE, TRUE, FALSE, NULL, NULL, '614000', NULL, NULL, NULL, 'ACTIVE'),
    ('TEMPLATE', 'NON_INVENTORY_PURCHASES', 'Non-inventory Purchases', 'Goods and charges expensed when purchased without inventory tracking', FALSE, TRUE, FALSE, NULL, NULL, '612000', NULL, NULL, NULL, 'ACTIVE'),
    ('TEMPLATE', 'PACKAGING', 'Packaging', 'Packaging materials held in inventory and consumed during fulfilment', FALSE, TRUE, TRUE, NULL, NULL, '503000', '503000', '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'RAW_MATERIALS', 'Raw Materials', 'Materials and components held in inventory and consumed into production', FALSE, TRUE, TRUE, NULL, NULL, '504000', '504000', '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'RESALE_GOODS', 'Resale Goods', 'Goods purchased into inventory for resale and relieved to cost of goods sold when sold', TRUE, TRUE, FALSE, '400000', '500000', '500000', NULL, '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'SPARE_PARTS', 'Spare Parts', 'Parts held in inventory and either sold or consumed for maintenance or repair', TRUE, TRUE, TRUE, '400000', '500000', '500000', '611000', '405000', '505000', 'ACTIVE'),
    ('TEMPLATE', 'WIP_GOODS', 'Work in Progress', 'Part-complete goods held as work-in-progress inventory during production', FALSE, FALSE, TRUE, NULL, NULL, NULL, '504000', '405000', '505000', 'ACTIVE')
)
INSERT INTO item_posting_profile (
  company_id, code, name, description, is_sold, is_purchased, is_consumed,
  revenue_gl_account_id, cogs_gl_account_id, purchase_expense_gl_account_id,
  consumption_gl_account_id, adjustment_gain_gl_account_id, adjustment_loss_gl_account_id,
  status, creation_actor_type, updated_actor_type
)
SELECT c.id, s.code, s.name, s.description, s.is_sold, s.is_purchased, s.is_consumed,
  revenue.id, cogs.id, purchase.id, consumption.id, gain.id, loss.id,
  s.status, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN company c ON c.code = s.company_code
LEFT JOIN gl_account revenue ON revenue.company_id = c.id AND revenue.code = s.revenue_code
LEFT JOIN gl_account cogs ON cogs.company_id = c.id AND cogs.code = s.cogs_code
LEFT JOIN gl_account purchase ON purchase.company_id = c.id AND purchase.code = s.purchase_expense_code
LEFT JOIN gl_account consumption ON consumption.company_id = c.id AND consumption.code = s.consumption_code
LEFT JOIN gl_account gain ON gain.company_id = c.id AND gain.code = s.adjustment_gain_code
LEFT JOIN gl_account loss ON loss.company_id = c.id AND loss.code = s.adjustment_loss_code
ON CONFLICT (company_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_sold = EXCLUDED.is_sold,
  is_purchased = EXCLUDED.is_purchased,
  is_consumed = EXCLUDED.is_consumed,
  revenue_gl_account_id = EXCLUDED.revenue_gl_account_id,
  cogs_gl_account_id = EXCLUDED.cogs_gl_account_id,
  purchase_expense_gl_account_id = EXCLUDED.purchase_expense_gl_account_id,
  consumption_gl_account_id = EXCLUDED.consumption_gl_account_id,
  adjustment_gain_gl_account_id = EXCLUDED.adjustment_gain_gl_account_id,
  adjustment_loss_gl_account_id = EXCLUDED.adjustment_loss_gl_account_id,
  status = EXCLUDED.status,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
