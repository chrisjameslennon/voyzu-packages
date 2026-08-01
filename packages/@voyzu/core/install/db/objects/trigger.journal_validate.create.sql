-- ============================================================
-- Journal – validation trigger
-- Enforces: status transitions, delete only from DRAFT
-- ============================================================

DROP FUNCTION IF EXISTS journal_validate_fn CASCADE;

CREATE OR REPLACE FUNCTION journal_validate_fn() RETURNS TRIGGER AS $$
BEGIN

  -- ── DELETE: only DRAFT journals may be deleted ──────────────
  IF TG_OP = 'DELETE' THEN
    IF OLD.status != 'DRAFT' THEN
      RAISE EXCEPTION 'journal can only be deleted in DRAFT status, current status: %', OLD.status;
    END IF;
    RETURN OLD;
  END IF;

  -- ── INSERT: status must be DRAFT ────────────────────────────
  IF TG_OP = 'INSERT' THEN
    IF NEW.status != 'DRAFT' THEN
      RAISE EXCEPTION 'journal must be created with DRAFT status';
    END IF;
    RETURN NEW;
  END IF;

  -- ── UPDATE: guard status transitions ────────────────────────
  IF TG_OP = 'UPDATE' THEN

    -- DRAFT → POSTED only
    IF OLD.status = 'DRAFT' AND NEW.status NOT IN ('DRAFT', 'POSTED') THEN
      RAISE EXCEPTION 'journal can only transition from DRAFT to POSTED, got %', NEW.status;
    END IF;

    -- POSTED is terminal (reversed_by_journal_id tracks reversal relationship)
    IF OLD.status = 'POSTED' AND NEW.status != 'POSTED' THEN
      RAISE EXCEPTION 'journal in POSTED status cannot change status';
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
