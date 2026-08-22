import type { DbExecutor } from "@voyzu/capability/db";

export class CompanyAccessRepo {
  constructor(private readonly db: DbExecutor) {}

  async listCompanyIdsByUser(): Promise<Map<number, number[]>> {
    const { rows } = await this.db.query(
      `SELECT user_id, company_id
       FROM company_user_access
       ORDER BY user_id, company_id`,
    );
    const result = new Map<number, number[]>();
    for (const row of rows) {
      const userId = Number(row.user_id);
      const companyIds = result.get(userId) ?? [];
      companyIds.push(Number(row.company_id));
      result.set(userId, companyIds);
    }
    return result;
  }

  async listCompanyIdsForUser(userId: number): Promise<number[]> {
    const { rows } = await this.db.query(
      `SELECT company_id
       FROM company_user_access
       WHERE user_id = $1
       ORDER BY company_id`,
      [userId],
    );
    return rows.map((row) => Number(row.company_id));
  }

  async replace(userId: number, companyIds: number[]): Promise<void> {
    await this.db.query("DELETE FROM company_user_access WHERE user_id = $1", [userId]);
    for (const companyId of companyIds) {
      await this.db.query(
        `INSERT INTO company_user_access (user_id, company_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, company_id) DO NOTHING`,
        [userId, companyId],
      );
    }
  }

  async existingCompanyIds(companyIds: number[]): Promise<Set<number>> {
    if (companyIds.length === 0) return new Set();
    const { rows } = await this.db.query(
      `SELECT id FROM company
       WHERE id = ANY($1::bigint[])
         AND status != 'DELETED'`,
      [companyIds],
    );
    return new Set(rows.map((row) => Number(row.id)));
  }
}
