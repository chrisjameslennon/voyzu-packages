-- ============================================================
-- Fiscal Period – validation trigger
-- Enforces: dates within parent FY, no overlapping periods,
--           finance_company_id matches parent FY
-- ============================================================

DROP FUNCTION IF EXISTS fiscal_period_validate_fn CASCADE;

CREATE OR REPLACE FUNCTION fiscal_period_validate_fn() RETURNS TRIGGER AS $$
DECLARE
  v_fy_finance_company_id BIGINT;
  v_fy_start      DATE;
  v_fy_end        DATE;
  v_overlap_count INTEGER;
BEGIN

  -- ── DELETE: no special guard (app layer handles has_postings) ──
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  -- ── Company must match parent FY ──────────────────────────
  SELECT finance_company_id, start_date, end_date
    INTO v_fy_finance_company_id, v_fy_start, v_fy_end
  FROM fiscal_year
  WHERE id = NEW.fiscal_year_id;

  IF v_fy_finance_company_id IS NULL THEN
    RAISE EXCEPTION 'fiscal_year with id % not found', NEW.fiscal_year_id;
  END IF;

  IF NEW.finance_company_id != v_fy_finance_company_id THEN
    RAISE EXCEPTION 'fiscal_period.finance_company_id (%) must match fiscal_year.finance_company_id (%)',
      NEW.finance_company_id, v_fy_finance_company_id;
  END IF;

  -- ── Period must fall within parent FY date range ──────────
  IF NEW.start_date < v_fy_start OR NEW.end_date > v_fy_end THEN
    RAISE EXCEPTION 'fiscal_period dates (% to %) must fall within fiscal year (% to %)',
      NEW.start_date, NEW.end_date, v_fy_start, v_fy_end;
  END IF;

  -- ── No overlapping periods per company ────────────────────
  IF TG_OP = 'INSERT' THEN
    SELECT COUNT(*) INTO v_overlap_count
    FROM fiscal_period
    WHERE finance_company_id = NEW.finance_company_id
      AND start_date <= NEW.end_date
      AND end_date   >= NEW.start_date;
  ELSE
    SELECT COUNT(*) INTO v_overlap_count
    FROM fiscal_period
    WHERE finance_company_id = NEW.finance_company_id
      AND id != OLD.id
      AND start_date <= NEW.end_date
      AND end_date   >= NEW.start_date;
  END IF;

  IF v_overlap_count > 0 THEN
    RAISE EXCEPTION 'fiscal_period date range overlaps with an existing period for this company';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
