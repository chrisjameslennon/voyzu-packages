-- Shared entity defaults: installed once, invoked for one newly inserted entity.
-- No template organization, cross-entity writes or transaction control.
CREATE OR REPLACE FUNCTION finance_initialize_entity(
  p_finance_organization_id bigint,
  p_actor_type text DEFAULT 'SYSTEM',
  p_user_id text DEFAULT NULL,
  p_mutation_id uuid DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
AS $finance_initialization$
BEGIN
  IF p_finance_organization_id IS NULL OR p_finance_organization_id <= 0 THEN
    RAISE EXCEPTION 'A positive financial entity ID is required';
  END IF;

  -- Serialize explicit retries for this entity; the caller owns the transaction.
  PERFORM 1 FROM finance_organization
  WHERE id = p_finance_organization_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Financial entity % does not exist', p_finance_organization_id;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM finance_organization f
    JOIN organization o ON o.id = f.organization_id
    JOIN finance_country c ON c.code = o.country_code
    WHERE f.id = p_finance_organization_id
  ) THEN
    RAISE EXCEPTION 'Finance country settings are missing for entity %', p_finance_organization_id;
  END IF;

  -- gl-account-category
  WITH seed (code, name, account_type, sequence, status) AS (
    VALUES
      ('ASSET_ACCOUNTS_REC', 'Accounts Receivable', 'ASSET', 120, 'ACTIVE'),
      ('ASSET_ACCUM_DEP', 'Accumulated Depreciation', 'ASSET', 220, 'ACTIVE'),
      ('ASSET_BANK', 'Bank / Cash', 'ASSET', 110, 'ACTIVE'),
      ('ASSET_CURRENT', 'Current Assets', 'ASSET', 100, 'ACTIVE'),
      ('ASSET_INTANGIBLE', 'Intangible Assets', 'ASSET', 230, 'ACTIVE'),
      ('ASSET_INVENTORY', 'Inventory', 'ASSET', 130, 'ACTIVE'),
      ('ASSET_NONCURRENT', 'Non-current Assets', 'ASSET', 200, 'ACTIVE'),
      ('ASSET_PPE', 'Property, Plant & Equipment', 'ASSET', 210, 'ACTIVE'),
      ('ASSET_PREPAYMENTS', 'Prepayments', 'ASSET', 140, 'ACTIVE'),
      ('EQUITY', 'Equity', 'EQUITY', 500, 'ACTIVE'),
      ('EQUITY_CAPITAL', 'Capital', 'EQUITY', 510, 'ACTIVE'),
      ('EQUITY_DRAWINGS', 'Drawings / Distributions', 'EQUITY', 530, 'ACTIVE'),
      ('EQUITY_RETAINED', 'Retained Earnings', 'EQUITY', 520, 'ACTIVE'),
      ('EXPENSE_COGS', 'Cost of Goods Sold', 'EXPENSE', 700, 'ACTIVE'),
      ('EXPENSE_DEPRECIATION', 'Depreciation & Amortisation', 'EXPENSE', 850, 'ACTIVE'),
      ('EXPENSE_INTEREST', 'Finance Costs', 'EXPENSE', 860, 'ACTIVE'),
      ('EXPENSE_OPERATING', 'Operating Expenses', 'EXPENSE', 800, 'ACTIVE'),
      ('LIABILITY_AP', 'Accounts Payable', 'LIABILITY', 310, 'ACTIVE'),
      ('LIABILITY_CURRENT', 'Current Liabilities', 'LIABILITY', 300, 'ACTIVE'),
      ('LIABILITY_DEFERRED', 'Deferred Revenue', 'LIABILITY', 340, 'ACTIVE'),
      ('LIABILITY_GST', 'GST / VAT', 'LIABILITY', 320, 'ACTIVE'),
      ('LIABILITY_LOANS', 'Loans', 'LIABILITY', 410, 'ACTIVE'),
      ('LIABILITY_PAYROLL', 'Payroll Liabilities', 'LIABILITY', 330, 'ACTIVE'),
      ('REVENUE_OPERATING', 'Operating Revenue', 'REVENUE', 600, 'ACTIVE'),
      ('REVENUE_OTHER', 'Other Income', 'REVENUE', 650, 'ACTIVE')
  )
  INSERT INTO gl_account_category (finance_organization_id, code, name, account_type, sequence, status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.name, s.account_type, s.sequence, s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- gl-account
  WITH seed (code, name, account_type, category_code, status) AS (
    VALUES
      ('100000', 'Bank – Operating Account', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('100100', 'Bank – Payroll Account', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('100200', 'Bank – Savings Account', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('100300', 'Bank Clearing / Settlement Account', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('100400', 'Undeposited Funds', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('101000', 'Cash on Hand', 'ASSET', 'ASSET_BANK', 'ACTIVE'),
      ('110000', 'Accounts Receivable – Trade', 'ASSET', 'ASSET_ACCOUNTS_REC', 'ACTIVE'),
      ('111000', 'Accounts Receivable – Unapplied Cash / Credits', 'ASSET', 'ASSET_ACCOUNTS_REC', 'ACTIVE'),
      ('112000', 'Allowance for Doubtful Debts', 'ASSET', 'ASSET_ACCOUNTS_REC', 'ACTIVE'),
      ('120000', 'Tax on Purchases - Recoverable', 'ASSET', 'ASSET_ACCOUNTS_REC', 'ACTIVE'),
      ('121000', 'Inventory Control', 'ASSET', 'ASSET_INVENTORY', 'ACTIVE'),
      ('121500', 'Inventory Receipt Clearing', 'ASSET', 'ASSET_INVENTORY', 'ACTIVE'),
      ('130000', 'Prepayments', 'ASSET', 'ASSET_PREPAYMENTS', 'ACTIVE'),
      ('131000', 'Deposits Paid', 'ASSET', 'ASSET_PREPAYMENTS', 'ACTIVE'),
      ('132000', 'Accrued Income', 'ASSET', 'ASSET_PREPAYMENTS', 'ACTIVE'),
      ('150000', 'Plant & Equipment – Cost', 'ASSET', 'ASSET_PPE', 'ACTIVE'),
      ('151000', 'Accumulated Depreciation – PPE', 'ASSET', 'ASSET_ACCUM_DEP', 'ACTIVE'),
      ('152000', 'Motor Vehicles – Cost', 'ASSET', 'ASSET_PPE', 'ACTIVE'),
      ('153000', 'Accumulated Depreciation – Vehicles', 'ASSET', 'ASSET_ACCUM_DEP', 'ACTIVE'),
      ('158000', 'Capital Work in Progress', 'ASSET', 'ASSET_PPE', 'ACTIVE'),
      ('159000', 'Asset Disposal Clearing', 'ASSET', 'ASSET_PPE', 'ACTIVE'),
      ('160000', 'Software – Cost', 'ASSET', 'ASSET_INTANGIBLE', 'ACTIVE'),
      ('161000', 'Accumulated Amortisation – Software', 'ASSET', 'ASSET_INTANGIBLE', 'ACTIVE'),
      ('200000', 'Accounts Payable – Trade', 'LIABILITY', 'LIABILITY_AP', 'ACTIVE'),
      ('201000', 'Accounts Payable – Unapplied Payments / Credits', 'LIABILITY', 'LIABILITY_AP', 'ACTIVE'),
      ('210000', 'GST / VAT Payable', 'LIABILITY', 'LIABILITY_GST', 'ACTIVE'),
      ('211000', 'GST / VAT Receivable', 'LIABILITY', 'LIABILITY_GST', 'ACTIVE'),
      ('220000', 'Tax on Sales - Payable', 'LIABILITY', 'LIABILITY_GST', 'ACTIVE'),
      ('222000', 'Payroll Liabilities – Super', 'LIABILITY', 'LIABILITY_PAYROLL', 'ACTIVE'),
      ('223000', 'Employer Contributions Payable', 'LIABILITY', 'LIABILITY_PAYROLL', 'ACTIVE'),
      ('230000', 'Deferred Revenue', 'LIABILITY', 'LIABILITY_DEFERRED', 'ACTIVE'),
      ('240000', 'Accrued Expenses', 'LIABILITY', 'LIABILITY_AP', 'ACTIVE'),
      ('250000', 'Bank Loans – Long Term', 'LIABILITY', 'LIABILITY_LOANS', 'ACTIVE'),
      ('251000', 'Lease Liabilities', 'LIABILITY', 'LIABILITY_LOANS', 'ACTIVE'),
      ('260000', 'Interest Payable', 'LIABILITY', 'LIABILITY_LOANS', 'ACTIVE'),
      ('300000', 'Opening Balance Equity', 'EQUITY', 'EQUITY_CAPITAL', 'ACTIVE'),
      ('310000', 'Retained Earnings', 'EQUITY', 'EQUITY_RETAINED', 'ACTIVE'),
      ('320000', 'Current Year Earnings', 'EQUITY', 'EQUITY_RETAINED', 'ACTIVE'),
      ('330000', 'Owner Drawings', 'EQUITY', 'EQUITY_DRAWINGS', 'ACTIVE'),
      ('340000', 'Dividends Payable', 'EQUITY', 'EQUITY_DRAWINGS', 'ACTIVE'),
      ('390000', 'Legacy Opening Balance Equity', 'EQUITY', 'EQUITY_RETAINED', 'ACTIVE'),
      ('400000', 'Sales  Products', 'REVENUE', 'REVENUE_OPERATING', 'ACTIVE'),
      ('401000', 'Sales - Events', 'REVENUE', 'REVENUE_OPERATING', 'ACTIVE'),
      ('402000', 'Sales  Subscriptions', 'REVENUE', 'REVENUE_OPERATING', 'ACTIVE'),
      ('403000', 'Consulting', 'REVENUE', 'REVENUE_OPERATING', 'ACTIVE'),
      ('405000', 'Inventory Adjustment Gain / Stock Gain', 'REVENUE', 'REVENUE_OTHER', 'ACTIVE'),
      ('410000', 'Sales Discounts', 'REVENUE', 'REVENUE_OPERATING', 'ACTIVE'),
      ('450000', 'Other Income', 'REVENUE', 'REVENUE_OTHER', 'ACTIVE'),
      ('451000', 'Interest Income', 'REVENUE', 'REVENUE_OTHER', 'ACTIVE'),
      ('452000', 'Supplier Balances Written Off', 'REVENUE', 'REVENUE_OTHER', 'ACTIVE'),
      ('500000', 'Cost of Goods Sold', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('501000', 'Cost of Goods Sold  Labour', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('502000', 'Freight Inwards', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('503000', 'Packaging and Fulfilment Supplies', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('504000', 'Raw Materials Consumed', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('505000', 'Inventory Adjustment Loss', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('506000', 'Samples and Demo Stock Consumed', 'EXPENSE', 'EXPENSE_COGS', 'ACTIVE'),
      ('600000', 'Wages and Salaries', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('601000', 'Payroll Taxes', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('602000', 'Superannuation Expense', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('603000', 'Tax Adjustments', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('610000', 'Bad Debt Expense', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('611000', 'Repairs and Maintenance', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('612000', 'Office Supplies', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('613000', 'Consumables Expense', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('614000', 'Freight and Courier', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('620000', 'Utilities', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('630000', 'IT and Software', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('631000', 'Telecommunications', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('640000', 'Advertising', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('641000', 'Marketing & Promotions', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('650000', 'Professional Fees', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('651000', 'Accounting & Audit Fees', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('699000', 'General Expenses', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE'),
      ('700000', 'Depreciation – Plant & Equipment', 'EXPENSE', 'EXPENSE_DEPRECIATION', 'ACTIVE'),
      ('701000', 'Depreciation – Vehicles', 'EXPENSE', 'EXPENSE_DEPRECIATION', 'ACTIVE'),
      ('710000', 'Amortisation – Software', 'EXPENSE', 'EXPENSE_DEPRECIATION', 'ACTIVE'),
      ('800000', 'Interest Expense', 'EXPENSE', 'EXPENSE_INTEREST', 'ACTIVE'),
      ('810000', 'Bank Fees', 'EXPENSE', 'EXPENSE_INTEREST', 'ACTIVE'),
      ('820000', 'Doubtful Debt Expense', 'EXPENSE', 'EXPENSE_OPERATING', 'ACTIVE')
  )
  INSERT INTO gl_account (finance_organization_id, code, name, account_type, account_category_id, status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.name, s.account_type, cat.id, s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  LEFT JOIN gl_account_category cat ON cat.finance_organization_id = fc.id AND cat.code = s.category_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- finance-inventory-processing-rule
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
    creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id
  )
  SELECT
    finance_organization.id,
    seed.inventory_document_type,
    seed.reason_code,
    seed.direction,
    seed.action,
    gl_account.id,
    p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) finance_organization
  LEFT JOIN gl_account
    ON gl_account.finance_organization_id = finance_organization.id
   AND gl_account.code = seed.offset_account_code
  WHERE seed.offset_account_code IS NULL OR gl_account.id IS NOT NULL
  ON CONFLICT (finance_organization_id, inventory_document_type, reason_code, direction)
  DO NOTHING;

  -- bank-cash-control-account
  WITH seed (code, ledger, type, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status, gl_account_code) AS (
    VALUES
      ('BANK_OPERATING', 'BANK_CASH', 'BANK', NULL, NULL, NULL, NULL, 'ACTIVE', '100000')
  )
  INSERT INTO bank_cash_control_account (finance_organization_id, code, ledger, type, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status, gl_account_id, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.ledger, s.type, s.bank_name, s.bank_branch_name, s.bank_account_identifier, s.cash_account_identifier, s.status, ga.id, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- ap-control-account
  WITH seed (code, ledger, name, status, gl_account_code) AS (
    VALUES
      ('AP_TRADE_PAYABLES', 'ACCOUNTS_PAYABLE', 'Trade Payables', 'ACTIVE', '200000'),
      ('AP_UNAPPLIED_PAYMENTS', 'ACCOUNTS_PAYABLE', 'Supplier Payments Awaiting Allocation', 'ACTIVE', '201000')
  )
  INSERT INTO ap_control_account (finance_organization_id, code, ledger, name, status, gl_account_id, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.ledger, s.name, s.status, ga.id, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- ar-control-account
  WITH seed (code, ledger, name, status, gl_account_code) AS (
    VALUES
      ('AR_TRADE_RECEIVABLES', 'ACCOUNTS_RECEIVABLE', 'Trade Receivables', 'ACTIVE', '110000'),
      ('AR_UNAPPLIED_CASH', 'ACCOUNTS_RECEIVABLE', 'Customer Receipts Awaiting Allocation', 'ACTIVE', '111000')
  )
  INSERT INTO ar_control_account (finance_organization_id, code, ledger, name, status, gl_account_id, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.ledger, s.name, s.status, ga.id, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- inventory-control-account
  WITH seed (code, ledger, name, description, status, gl_account_code) AS (
    VALUES
      ('INVENTORY_CONTROL', 'INVENTORY', 'Inventory Control', 'Inventory control account used to hold the book value of inventory on hand.', 'ACTIVE', '121000')
  )
  INSERT INTO inventory_control_account (finance_organization_id, code, ledger, name, description, status, gl_account_id, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.ledger, s.name, s.description, s.status, ga.id, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- tax-control-account
  WITH seed (code, ledger, name, description, tax_family_code, status, gl_account_code) AS (
    VALUES
      ('TAX_ON_PURCHASES', 'TAX', 'Tax on Purchases', 'Tax arising from purchases the business makes, usually recoverable input tax or purchase-side tax credits.', 'INDIRECT_TAX', 'ACTIVE', '120000'),
      ('TAX_ON_SALES', 'TAX', 'Tax on Sales', 'Tax arising from sales the business makes, including GST/VAT output tax and US sales/use-tax sales-side obligations.', 'INDIRECT_TAX', 'ACTIVE', '220000')
  )
  INSERT INTO tax_control_account (finance_organization_id, code, ledger, name, description, tax_family_code, status, gl_account_id, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.ledger, s.name, s.description, s.tax_family_code, s.status, ga.id, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- item-posting-profile
  WITH seed (code, name, description, is_sold, is_purchased, is_consumed, revenue_code, cogs_code, purchase_expense_code, consumption_code, adjustment_gain_code, adjustment_loss_code, status) AS (
    VALUES
      ('CONSULTING_SERVICES', 'Consulting Services', 'Services recognised as revenue when sold or service expense when purchased', TRUE, FALSE, FALSE, '403000', '501000', NULL, NULL, NULL, NULL, 'ACTIVE'),
      ('CONSUMABLES', 'Consumables', 'Inventory held for internal consumption and charged to consumption expense when used', FALSE, TRUE, TRUE, NULL, NULL, '613000', '613000', '405000', '505000', 'ACTIVE'),
      ('FINISHED_GOODS', 'Finished Goods', 'Manufactured or assembled goods held in inventory and relieved to cost of goods sold when sold', TRUE, FALSE, FALSE, '400000', '500000', NULL, NULL, '405000', '505000', 'ACTIVE'),
      ('FREIGHT_COSTS', 'Freight Costs', 'Freight and courier charges purchased and expensed without inventory tracking', FALSE, TRUE, FALSE, NULL, NULL, '614000', NULL, NULL, NULL, 'ACTIVE'),
      ('NON_INVENTORY_PURCHASES', 'Non-inventory Purchases', 'Goods and charges expensed when purchased without inventory tracking', FALSE, TRUE, FALSE, NULL, NULL, '612000', NULL, NULL, NULL, 'ACTIVE'),
      ('PACKAGING', 'Packaging', 'Packaging materials held in inventory and consumed during fulfilment', FALSE, TRUE, TRUE, NULL, NULL, '503000', '503000', '405000', '505000', 'ACTIVE'),
      ('RAW_MATERIALS', 'Raw Materials', 'Materials and components held in inventory and consumed into production', FALSE, TRUE, TRUE, NULL, NULL, '504000', '504000', '405000', '505000', 'ACTIVE'),
      ('RESALE_GOODS', 'Resale Goods', 'Goods purchased into inventory for resale and relieved to cost of goods sold when sold', TRUE, TRUE, FALSE, '400000', '500000', '500000', NULL, '405000', '505000', 'ACTIVE'),
      ('SPARE_PARTS', 'Spare Parts', 'Parts held in inventory and either sold or consumed for maintenance or repair', TRUE, TRUE, TRUE, '400000', '500000', '500000', '611000', '405000', '505000', 'ACTIVE'),
      ('WIP_GOODS', 'Work in Progress', 'Part-complete goods held as work-in-progress inventory during production', FALSE, FALSE, TRUE, NULL, NULL, NULL, '504000', '405000', '505000', 'ACTIVE')
  )
  INSERT INTO item_posting_profile (
    finance_organization_id, code, name, description, is_sold, is_purchased, is_consumed,
    revenue_gl_account_id, cogs_gl_account_id, purchase_expense_gl_account_id,
    consumption_gl_account_id, adjustment_gain_gl_account_id, adjustment_loss_gl_account_id,
    status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id
  )
  SELECT fc.id, s.code, s.name, s.description, s.is_sold, s.is_purchased, s.is_consumed,
    revenue.id, cogs.id, purchase.id, consumption.id, gain.id, loss.id,
    s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  LEFT JOIN gl_account revenue ON revenue.finance_organization_id = fc.id AND revenue.code = s.revenue_code
  LEFT JOIN gl_account cogs ON cogs.finance_organization_id = fc.id AND cogs.code = s.cogs_code
  LEFT JOIN gl_account purchase ON purchase.finance_organization_id = fc.id AND purchase.code = s.purchase_expense_code
  LEFT JOIN gl_account consumption ON consumption.finance_organization_id = fc.id AND consumption.code = s.consumption_code
  LEFT JOIN gl_account gain ON gain.finance_organization_id = fc.id AND gain.code = s.adjustment_gain_code
  LEFT JOIN gl_account loss ON loss.finance_organization_id = fc.id AND loss.code = s.adjustment_loss_code
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- dimension
  WITH seed (code, name, status) AS (
    VALUES
      ('COST_CENTRE', 'Cost Centre', 'ACTIVE'),
      ('DEPARTMENT', 'Department', 'ACTIVE'),
      ('PRODUCT_RANGE', 'Product Range', 'ACTIVE'),
      ('PROJECT', 'Project', 'ACTIVE'),
      ('SALES_CHANNEL', 'Sales Channel', 'ACTIVE')
  )
  INSERT INTO dimension (finance_organization_id, code, name, status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, s.code, s.name, s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- dimension-value
  WITH seed (dimension_code, name, status) AS (
    VALUES
      ('SALES_CHANNEL', 'Direct', 'ACTIVE'),
      ('SALES_CHANNEL', 'Marketplace', 'ACTIVE'),
      ('SALES_CHANNEL', 'Online', 'ACTIVE'),
      ('SALES_CHANNEL', 'Partner', 'ACTIVE'),
      ('SALES_CHANNEL', 'Retail', 'ACTIVE'),
      ('SALES_CHANNEL', 'Wholesale', 'ACTIVE')
  )
  INSERT INTO dimension_value (finance_organization_id, dimension_id, name, status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id)
  SELECT fc.id, d.id, s.name, s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  JOIN dimension d ON d.finance_organization_id = fc.id AND d.code = s.dimension_code
  ON CONFLICT (finance_organization_id, dimension_id, lower(name)) DO NOTHING;

  -- financial-document-default
  WITH seed (document_code, code, name, target_type, allowed_account_types, override_property_name, override_scope, gl_account_code, bank_cash_control_account_code, status) AS (
    VALUES
      ('AP_BILL', 'PURCHASE_ACCOUNT', 'Purchase / expense account', 'GENERAL_LEDGER', ARRAY['EXPENSE', 'ASSET']::text[], 'purchase_posting_code', 'HEADER_AND_LINE', '699000', NULL, 'ACTIVE'),
      ('AP_CREDIT_NOTE', 'PURCHASE_REVERSAL_ACCOUNT', 'Purchase / expense reversal account', 'GENERAL_LEDGER', ARRAY['EXPENSE', 'ASSET']::text[], 'purchase_posting_code', 'HEADER_AND_LINE', '699000', NULL, 'ACTIVE'),
      ('AP_OPENING_BALANCE', 'OPENING_BALANCE_EQUITY_ACCOUNT', 'Opening balance equity account', 'GENERAL_LEDGER', ARRAY['EQUITY']::text[], 'opening_balance_equity_posting_code', 'HEADER', '300000', NULL, 'ACTIVE'),
      ('AP_PAYMENT', 'BANK_CASH_ACCOUNT', 'Payment bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
      ('AP_REFUND', 'BANK_CASH_ACCOUNT', 'Supplier refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
      ('AP_WRITE_OFF', 'SUPPLIER_WRITE_OFF_INCOME_ACCOUNT', 'Supplier balance write-off income account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'write_off_income_posting_code', 'HEADER', '452000', NULL, 'ACTIVE'),
      ('AR_CREDIT_NOTE', 'REVENUE_REVERSAL_ACCOUNT', 'Revenue reversal account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'revenue_posting_code', 'HEADER_AND_LINE', '400000', NULL, 'ACTIVE'),
      ('AR_INVOICE', 'REVENUE_ACCOUNT', 'Revenue account', 'GENERAL_LEDGER', ARRAY['REVENUE']::text[], 'revenue_posting_code', 'HEADER_AND_LINE', '400000', NULL, 'ACTIVE'),
      ('AR_OPENING_BALANCE', 'OPENING_BALANCE_EQUITY_ACCOUNT', 'Opening balance equity account', 'GENERAL_LEDGER', ARRAY['EQUITY']::text[], 'opening_balance_equity_posting_code', 'HEADER', '300000', NULL, 'ACTIVE'),
      ('AR_RECEIPT', 'BANK_CASH_ACCOUNT', 'Receipt bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
      ('AR_REFUND', 'BANK_CASH_ACCOUNT', 'Customer refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
      ('AR_WRITE_OFF', 'CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT', 'Customer balance write-off expense account', 'GENERAL_LEDGER', ARRAY['EXPENSE']::text[], 'write_off_expense_posting_code', 'HEADER', '610000', NULL, 'ACTIVE'),
      ('TAX_ADJUSTMENT', 'TAX_ADJUSTMENT_OFFSET_ACCOUNT', 'Tax adjustment offset account', 'GENERAL_LEDGER', ARRAY['EXPENSE']::text[], 'adjustment_gl_account_code', 'HEADER', '603000', NULL, 'ACTIVE'),
      ('TAX_PAYMENT', 'BANK_CASH_ACCOUNT', 'Tax payment bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE'),
      ('TAX_REFUND', 'BANK_CASH_ACCOUNT', 'Tax refund bank / cash account', 'BANK_CASH_ACCOUNT', ARRAY['ASSET']::text[], 'bank_cash_account_code', 'HEADER', NULL, 'BANK_OPERATING', 'ACTIVE')
  )
  INSERT INTO financial_document_default (
    finance_organization_id, document_code, code, name, target_type, allowed_account_types,
    override_property_name, override_scope, gl_account_id, bank_cash_control_account_id,
    status, creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id
  )
  SELECT fc.id, s.document_code, s.code, s.name, s.target_type, s.allowed_account_types,
    s.override_property_name, s.override_scope, ga.id, bca.id,
    s.status, p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM seed s
  CROSS JOIN (SELECT id FROM finance_organization WHERE id = p_finance_organization_id) fc
  LEFT JOIN gl_account ga ON ga.finance_organization_id = fc.id AND ga.code = s.gl_account_code
  LEFT JOIN bank_cash_control_account bca ON bca.finance_organization_id = fc.id AND bca.code = s.bank_cash_control_account_code
  ON CONFLICT (finance_organization_id, document_code, code) DO NOTHING;

  -- fiscal-year
  WITH companies AS (
    SELECT
      fco.id,
      CASE fc.financial_period_start_month
        WHEN 'JAN' THEN 1 WHEN 'FEB' THEN 2 WHEN 'MAR' THEN 3
        WHEN 'APR' THEN 4 WHEN 'MAY' THEN 5 WHEN 'JUN' THEN 6
        WHEN 'JUL' THEN 7 WHEN 'AUG' THEN 8 WHEN 'SEP' THEN 9
        WHEN 'OCT' THEN 10 WHEN 'NOV' THEN 11 WHEN 'DEC' THEN 12
        ELSE 1
      END AS start_month
    FROM (SELECT * FROM finance_organization WHERE id = p_finance_organization_id) fco
    JOIN organization c ON c.id = fco.organization_id
    JOIN finance_country fc ON fc.code = c.country_code
    WHERE NOT EXISTS (
      SELECT 1 FROM fiscal_year existing WHERE existing.finance_organization_id = fco.id
    )
  ), years AS (
    SELECT generate_series(
      EXTRACT(YEAR FROM CURRENT_DATE)::integer - 2,
      EXTRACT(YEAR FROM CURRENT_DATE)::integer + 5
    ) AS financial_year
  ), proposed AS (
    SELECT
      c.id AS finance_organization_id,
      y.financial_year,
      make_date(
        y.financial_year - CASE WHEN c.start_month = 1 THEN 0 ELSE 1 END,
        c.start_month,
        1
      ) AS start_date,
      (
        make_date(
          y.financial_year - CASE WHEN c.start_month = 1 THEN 0 ELSE 1 END,
          c.start_month,
          1
        ) + INTERVAL '1 year - 1 day'
      )::date AS end_date
    FROM companies c
    CROSS JOIN years y
  )
  INSERT INTO fiscal_year (
    finance_organization_id, code, name, start_date, end_date, status,
    creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id
  )
  SELECT
    p.finance_organization_id,
    'FY-' || p.financial_year,
    'Financial Year ' || p.financial_year,
    p.start_date,
    p.end_date,
    CASE
      WHEN p.end_date < CURRENT_DATE THEN 'INACTIVE'
      WHEN p.start_date <= CURRENT_DATE THEN 'OPEN'
      ELSE 'PLANNED'
    END,
    p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM proposed p
  ON CONFLICT (finance_organization_id, code) DO NOTHING;

  -- fiscal-period
  WITH proposed AS (
    SELECT
      fy.finance_organization_id,
      fy.id AS fiscal_year_id,
      month_start::date AS start_date,
      (month_start + INTERVAL '1 month - 1 day')::date AS end_date,
      fy.status
    FROM fiscal_year fy
    CROSS JOIN LATERAL generate_series(
      date_trunc('month', fy.start_date::timestamp),
      date_trunc('month', fy.end_date::timestamp),
      INTERVAL '1 month'
    ) AS month_start
    WHERE fy.finance_organization_id = p_finance_organization_id
      AND fy.status IN ('OPEN', 'CLOSED')
      AND NOT EXISTS (
        SELECT 1 FROM fiscal_period existing WHERE existing.fiscal_year_id = fy.id
      )
  )
  INSERT INTO fiscal_period (
    finance_organization_id, fiscal_year_id, code, name, start_date, end_date, status,
    creation_actor_type, creation_user_id, creation_mutation_id,
    updated_actor_type, updated_user_id, updated_mutation_id
  )
  SELECT
    p.finance_organization_id,
    p.fiscal_year_id,
    upper(to_char(p.start_date, 'MON')),
    trim(to_char(p.start_date, 'Month')),
    p.start_date,
    p.end_date,
    p.status,
    p_actor_type, p_user_id, p_mutation_id, p_actor_type, p_user_id, p_mutation_id
  FROM proposed p
  ON CONFLICT (fiscal_year_id, code) DO NOTHING;

END;
$finance_initialization$;
