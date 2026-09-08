-- Initialize only financial entities inserted by this installation.
-- Existing entities are neither backfilled nor reset.
DO $finance_entity_seed$
DECLARE
  entity_id bigint;
BEGIN
  FOR entity_id IN
    INSERT INTO finance_organization (
      organization_id, tax_filing_anchor_month, tax_filing_interval_months,
      creation_actor_type, updated_actor_type
    )
    SELECT o.id, c.tax_filing_anchor_month, c.tax_filing_interval_months,
           'SYSTEM', 'SYSTEM'
    FROM organization o
    JOIN finance_country c ON c.code = o.country_code
    WHERE o.status != 'DELETED'
    ON CONFLICT (organization_id) DO NOTHING
    RETURNING id
  LOOP
    PERFORM finance_initialize_entity(entity_id);
  END LOOP;
END;
$finance_entity_seed$;
