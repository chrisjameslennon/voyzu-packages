WITH proposed AS (
  SELECT
    fy.finance_company_id,
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
  WHERE fy.status IN ('OPEN', 'CLOSED')
    AND NOT EXISTS (
      SELECT 1 FROM fiscal_period existing WHERE existing.fiscal_year_id = fy.id
    )
)
INSERT INTO fiscal_period (
  finance_company_id, fiscal_year_id, code, name, start_date, end_date, status,
  creation_actor_type, updated_actor_type
)
SELECT
  p.finance_company_id,
  p.fiscal_year_id,
  upper(to_char(p.start_date, 'MON')),
  trim(to_char(p.start_date, 'Month')),
  p.start_date,
  p.end_date,
  p.status,
  'SYSTEM',
  'SYSTEM'
FROM proposed p
ON CONFLICT (fiscal_year_id, code) DO NOTHING;
