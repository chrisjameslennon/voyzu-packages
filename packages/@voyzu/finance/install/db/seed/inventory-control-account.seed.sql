WITH seed (company_code, code, ledger, name, description, status, gl_account_code) AS (
  VALUES
    ('TEMPLATE', 'INVENTORY_CONTROL', 'INVENTORY', 'Inventory Control', 'Inventory control account used to hold the book value of inventory on hand.', 'ACTIVE', '121000')
)
INSERT INTO inventory_control_account (finance_organization_id, code, ledger, name, description, status, gl_account_id, creation_actor_type, updated_actor_type)
SELECT fc.id, s.code, s.ledger, s.name, s.description, s.status, ga.id, 'SYSTEM', 'SYSTEM'
FROM seed s
JOIN finance_organization fc ON fc.is_template = TRUE AND s.company_code = 'TEMPLATE'
JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
ON CONFLICT (finance_organization_id, code) DO UPDATE SET
    ledger = EXCLUDED.ledger,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    gl_account_id = EXCLUDED.gl_account_id,
    updated_date = NOW(),
    updated_actor_type = 'SYSTEM';
