WITH companies AS (
  SELECT
    c.id,
    CASE co.financial_period_start_month
      WHEN 'JAN' THEN 1 WHEN 'FEB' THEN 2 WHEN 'MAR' THEN 3
      WHEN 'APR' THEN 4 WHEN 'MAY' THEN 5 WHEN 'JUN' THEN 6
      WHEN 'JUL' THEN 7 WHEN 'AUG' THEN 8 WHEN 'SEP' THEN 9
      WHEN 'OCT' THEN 10 WHEN 'NOV' THEN 11 WHEN 'DEC' THEN 12
      ELSE 1
    END AS start_month
  FROM company c
  JOIN country co ON co.code = c.country_code
  WHERE NOT EXISTS (
    SELECT 1 FROM fiscal_year existing WHERE existing.company_id = c.id
  )
), years AS (
  SELECT generate_series(
    EXTRACT(YEAR FROM CURRENT_DATE)::integer - 2,
    EXTRACT(YEAR FROM CURRENT_DATE)::integer + 5
  ) AS financial_year
), proposed AS (
  SELECT
    c.id AS company_id,
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
  company_id, code, name, start_date, end_date, status,
  creation_actor_type, updated_actor_type
)
SELECT
  p.company_id,
  'FY-' || p.financial_year,
  'Financial Year ' || p.financial_year,
  p.start_date,
  p.end_date,
  CASE
    WHEN p.end_date < CURRENT_DATE THEN 'INACTIVE'
    WHEN p.start_date <= CURRENT_DATE THEN 'OPEN'
    ELSE 'PLANNED'
  END,
  'SYSTEM',
  'SYSTEM'
FROM proposed p
ON CONFLICT (company_id, code) DO NOTHING;
