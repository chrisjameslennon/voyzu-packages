-- ============================================================
-- Fiscal Year – validation trigger
-- Enforces: status transitions, no overlapping date ranges,
--           close requires all periods closed
-- ============================================================

DROP FUNCTION IF EXISTS fiscal_year_validate_fn CASCADE;

CREATE OR REPLACE FUNCTION fiscal_year_validate_fn() RETURNS TRIGGER AS $$
DECLARE
  v_overlap_count  INTEGER;
  v_open_periods   INTEGER;
BEGIN

  -- ── DELETE: always allowed ──────────────────────────────────
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  -- ── UPDATE: guard status transitions ──────────────────────
  IF TG_OP = 'UPDATE' THEN

    -- Cannot assign INACTIVE or PLANNED via update after initial insert
    IF NEW.status IN ('INACTIVE', 'PLANNED') AND OLD.status NOT IN ('INACTIVE', 'PLANNED') THEN
      RAISE EXCEPTION 'fiscal_year status cannot be set to INACTIVE or PLANNED after creation';
    END IF;

    -- INACTIVE → OPEN only
    IF OLD.status = 'INACTIVE' AND NEW.status NOT IN ('INACTIVE', 'OPEN') THEN
      RAISE EXCEPTION 'fiscal_year can only transition from INACTIVE to OPEN, got %', NEW.status;
    END IF;

    -- PLANNED → OPEN only
    IF OLD.status = 'PLANNED' AND NEW.status NOT IN ('PLANNED', 'OPEN') THEN
      RAISE EXCEPTION 'fiscal_year can only transition from PLANNED to OPEN, got %', NEW.status;
    END IF;

    -- OPEN → CLOSED only
    IF OLD.status = 'OPEN' AND NEW.status NOT IN ('OPEN', 'CLOSED') THEN
      RAISE EXCEPTION 'fiscal_year can only transition from OPEN to CLOSED, got %', NEW.status;
    END IF;

    -- CLOSED → OPEN only (reopen)
    IF OLD.status = 'CLOSED' AND NEW.status NOT IN ('CLOSED', 'OPEN') THEN
      RAISE EXCEPTION 'fiscal_year can only transition from CLOSED to OPEN (reopen), got %', NEW.status;
    END IF;

    -- Cannot close while open periods exist
    IF OLD.status = 'OPEN' AND NEW.status = 'CLOSED' THEN
      SELECT COUNT(*) INTO v_open_periods
      FROM fiscal_period
      WHERE fiscal_year_id = NEW.id AND status = 'OPEN';

      IF v_open_periods > 0 THEN
        RAISE EXCEPTION 'Cannot close fiscal year: % open period(s) remain', v_open_periods;
      END IF;
    END IF;

  END IF;

  -- ── Overlap check (INSERT and UPDATE) ─────────────────────
  IF TG_OP = 'INSERT' THEN
    SELECT COUNT(*) INTO v_overlap_count
    FROM fiscal_year
    WHERE finance_company_id = NEW.finance_company_id
      AND start_date <= NEW.end_date
      AND end_date   >= NEW.start_date;
  ELSE
    SELECT COUNT(*) INTO v_overlap_count
    FROM fiscal_year
    WHERE finance_company_id = NEW.finance_company_id
      AND id != OLD.id
      AND start_date <= NEW.end_date
      AND end_date   >= NEW.start_date;
  END IF;

  IF v_overlap_count > 0 THEN
    RAISE EXCEPTION 'fiscal_year date range overlaps with an existing fiscal year for this company';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
