WITH seed (inventory_document_type, reason_code, direction, action, offset_account_code) AS (
  VALUES
    ('ADJUSTMENT', 'STOCK_VARIANCE',      'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'STOCK_VARIANCE',      'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('ADJUSTMENT', 'DAMAGED',             'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'DAMAGED',             'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('ADJUSTMENT', 'MISSING',             'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'MISSING',             'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('ADJUSTMENT', 'FOUND',               'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'FOUND',               'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('ADJUSTMENT', 'DATA_CORRECTION',     'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'DATA_CORRECTION',     'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('ADJUSTMENT', 'OTHER',               'INCREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '405000'),
    ('ADJUSTMENT', 'OTHER',               'DECREASE', 'CREATE_INVENTORY_ADJUSTMENT_JOURNAL', '505000'),
    ('RECEIPT',    'PURCHASE',            'INCREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('RECEIPT',    'CUSTOMER_RETURN',     'INCREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('RECEIPT',    'OPENING_STOCK',       'INCREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('RECEIPT',    'PRODUCTION',          'INCREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('RECEIPT',    'OTHER',               'INCREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('ISSUE',      'SALE',                'DECREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('ISSUE',      'INTERNAL_CONSUMPTION','DECREASE', 'CREATE_INVENTORY_ISSUE_JOURNAL',      '613000'),
    ('ISSUE',      'WRITE_OFF_DAMAGED',   'DECREASE', 'CREATE_INVENTORY_ISSUE_JOURNAL',      '505000'),
    ('ISSUE',      'WRITE_OFF_OTHER',     'DECREASE', 'CREATE_INVENTORY_ISSUE_JOURNAL',      '505000'),
    ('ISSUE',      'SUPPLIER_RETURN',     'DECREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('ISSUE',      'SAMPLE',              'DECREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL),
    ('ISSUE',      'OTHER',               'DECREASE', 'WAIT_FOR_MATCHED_DOCUMENT',            NULL)
)
INSERT INTO finance_inventory_processing_rule (
  finance_organization_id,
  inventory_document_type,
  reason_code,
  direction,
  action,
  offset_gl_account_id,
  creation_actor_type,
  updated_actor_type
)
SELECT
  finance_organization.id,
  seed.inventory_document_type,
  seed.reason_code,
  seed.direction,
  seed.action,
  gl_account.id,
  'SYSTEM',
  'SYSTEM'
FROM seed
CROSS JOIN finance_organization
LEFT JOIN gl_account
  ON gl_account.finance_organization_id = finance_organization.id
 AND gl_account.code = seed.offset_account_code
WHERE seed.offset_account_code IS NULL OR gl_account.id IS NOT NULL
ON CONFLICT (finance_organization_id, inventory_document_type, reason_code, direction)
DO UPDATE SET
  action = EXCLUDED.action,
  offset_gl_account_id = EXCLUDED.offset_gl_account_id,
  updated_date = NOW(),
  updated_actor_type = 'SYSTEM';
