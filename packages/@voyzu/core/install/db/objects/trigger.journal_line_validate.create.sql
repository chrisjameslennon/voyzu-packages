-- ============================================================
-- Journal Line validation trigger
-- Enforces: lines cannot be modified once parent journal is POSTED
-- ============================================================

DROP FUNCTION IF EXISTS journal_line_validate_fn CASCADE;

CREATE OR REPLACE FUNCTION journal_line_validate_fn() RETURNS TRIGGER AS $$
DECLARE
  v_journal_status TEXT;
BEGIN

  -- DELETE: guard parent journal status.
  IF TG_OP = 'DELETE' THEN
    SELECT status INTO v_journal_status FROM journal_header WHERE id = OLD.journal_header_id;
    IF v_journal_status = 'POSTED' THEN
      RAISE EXCEPTION 'Cannot delete journal line: parent journal status is %', v_journal_status;
    END IF;
    RETURN OLD;
  END IF;

  -- INSERT / UPDATE: guard parent journal status.
  SELECT status INTO v_journal_status FROM journal_header WHERE id = NEW.journal_header_id;
  IF v_journal_status = 'POSTED' THEN
    RAISE EXCEPTION 'Cannot modify journal line: parent journal status is %', v_journal_status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
