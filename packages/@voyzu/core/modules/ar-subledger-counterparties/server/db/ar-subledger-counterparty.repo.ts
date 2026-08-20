import type { DbExecutor } from "@voyzu/capability/db";

import type { ArCounterpartyRow } from "./ar-subledger-counterparty.row.types";

export class ArSubledgerCounterpartyRepo {
  constructor(private readonly db: DbExecutor) { }

  async listCounterparties(companyId: number): Promise<ArCounterpartyRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         c.id::int AS id,
         c.company_id::int AS company_id,
         c.code,
         c.name,
         c.status,
         c.country_code,
         country.name AS country_name,
         c.tax_region_or_province,
         c.creation_date::text AS creation_date,
         c.creation_actor_type,
         c.creation_user_id,
         c.creation_mutation_id::text AS creation_mutation_id,
         c.updated_date::text AS updated_date,
         c.updated_actor_type,
         c.updated_user_id,
         c.updated_mutation_id::text AS updated_mutation_id
       FROM ar_counterparty c
       LEFT JOIN country ON country.code = c.country_code
       WHERE c.company_id = $1
       ORDER BY c.code ASC`,
      [companyId],
    );
    return rows as unknown as ArCounterpartyRow[];
  }

  async getCounterparty(companyId: number, code: string): Promise<ArCounterpartyRow | null> {
    const { rows } = await this.db.query(
      `SELECT
         c.id::int AS id,
         c.company_id::int AS company_id,
         c.code,
         c.name,
         c.status,
         c.country_code,
         country.name AS country_name,
         c.tax_region_or_province,
         c.creation_date::text AS creation_date,
         c.creation_actor_type,
         c.creation_user_id,
         c.creation_mutation_id::text AS creation_mutation_id,
         c.updated_date::text AS updated_date,
         c.updated_actor_type,
         c.updated_user_id,
         c.updated_mutation_id::text AS updated_mutation_id
       FROM ar_counterparty c
       LEFT JOIN country ON country.code = c.country_code
       WHERE c.company_id = $1
         AND c.code = $2
       LIMIT 1`,
      [companyId, code],
    );
    return (rows[0] as unknown as ArCounterpartyRow | undefined) ?? null;
  }
}
