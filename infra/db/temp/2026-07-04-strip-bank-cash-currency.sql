BEGIN;

ALTER TABLE IF EXISTS journal_header
  DROP CONSTRAINT IF EXISTS fk_bank_cash_currency,
  DROP COLUMN IF EXISTS bank_cash_currency_code;

ALTER TABLE IF EXISTS bank_cash_control_account
  DROP CONSTRAINT IF EXISTS fk_bank_cash_control_account_currency,
  DROP COLUMN IF EXISTS currency_code;

COMMIT;
