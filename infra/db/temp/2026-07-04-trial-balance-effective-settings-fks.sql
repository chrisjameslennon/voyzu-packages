BEGIN;

ALTER TABLE IF EXISTS trial_balance_snapshot
  DROP CONSTRAINT IF EXISTS fk_trial_balance_snapshot_gl_account,
  DROP CONSTRAINT IF EXISTS fk_trial_balance_snapshot_account_category;

ALTER TABLE IF EXISTS trial_balance_snapshot
  ADD CONSTRAINT fk_trial_balance_snapshot_gl_account
    FOREIGN KEY (gl_account_id) REFERENCES gl_account(id),
  ADD CONSTRAINT fk_trial_balance_snapshot_account_category
    FOREIGN KEY (account_category_id) REFERENCES gl_account_category(id);

DELETE FROM trial_balance_snapshot;

COMMIT;
