import { withTransaction, type DbExecutor } from "@voyzu/capability/db";
import type { AccountType } from "@voyzu/core/types/modules/core";

import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";

const BASIS = "POSTED";

export interface TrialBalanceSnapshotLine {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  accountType: AccountType;
  categoryCode: string | null;
  categoryName: string | null;
  categorySequence: number | null;
  debitAmount: number;
  creditAmount: number;
  balanceAmount: number;
}

interface SnapshotRow {
  gl_account_id: unknown;
  gl_account_code: unknown;
  gl_account_name: unknown;
  account_type: unknown;
  account_category_code: unknown;
  account_category_name: unknown;
  account_category_sequence: unknown;
  debit_amount: unknown;
  credit_amount: unknown;
  balance_amount: unknown;
}

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function previousDateString(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normalizeDate(asAtDate?: string | null): string {
  return asAtDate ?? todayIso();
}

function mapSnapshotRow(row: SnapshotRow): TrialBalanceSnapshotLine {
  return {
    glAccountId: Number(row.gl_account_id),
    glAccountCode: String(row.gl_account_code),
    glAccountName: String(row.gl_account_name),
    accountType: String(row.account_type) as AccountType,
    categoryCode: row.account_category_code != null ? String(row.account_category_code) : null,
    categoryName: row.account_category_name != null ? String(row.account_category_name) : null,
    categorySequence: row.account_category_sequence != null ? Number(row.account_category_sequence) : null,
    debitAmount: Number(row.debit_amount),
    creditAmount: Number(row.credit_amount),
    balanceAmount: Number(row.balance_amount),
  };
}

export class TrialBalanceSnapshotRepo {
  constructor(private readonly db: DbExecutor) {}

  reportDate(asAtDate?: string | null): string {
    return normalizeDate(asAtDate);
  }

  private async sourceStats(companyId: number, asAtDate: string): Promise<{ maxJournalHeaderId: number; journalCount: number; journalLineCount: number }> {
    const { rows } = await this.db.query(
      `SELECT COALESCE(MAX(jh.id), 0)::text AS max_journal_header_id,
              COUNT(DISTINCT jh.id)::text AS journal_count,
              COUNT(jl.id)::text AS journal_line_count
       FROM journal_header jh
       LEFT JOIN journal_line jl ON jl.journal_header_id = jh.id
       WHERE jh.company_id = $1
         AND jh.status = 'POSTED'
         AND jh.posting_date <= $2`,
      [companyId, asAtDate],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    return {
      maxJournalHeaderId: Number(row?.max_journal_header_id ?? 0),
      journalCount: Number(row?.journal_count ?? 0),
      journalLineCount: Number(row?.journal_line_count ?? 0),
    };
  }

  private async snapshotStats(companyId: number, asAtDate: string): Promise<{ maxJournalHeaderId: number; lineCount: number } | null> {
    const { rows } = await this.db.query(
      `SELECT MAX(max_journal_header_id)::text AS max_journal_header_id,
              COUNT(*)::text AS line_count
       FROM trial_balance_snapshot
       WHERE company_id = $1
         AND as_at_date = $2
         AND basis = $3`,
      [companyId, asAtDate, BASIS],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    const value = row?.max_journal_header_id;
    if (value == null) return null;
    return { maxJournalHeaderId: Number(value), lineCount: Number(row?.line_count ?? 0) };
  }

  async refreshIfStale(companyId: number, asAtDate?: string | null): Promise<void> {
    const reportDate = this.reportDate(asAtDate);
    await withTransaction(async (client) => {
      const repo = new TrialBalanceSnapshotRepo(client);
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`trial_balance_snapshot:${companyId}:${reportDate}:${BASIS}`]);

      const source = await repo.sourceStats(companyId, reportDate);
      const snapshot = await repo.snapshotStats(companyId, reportDate);
      const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, client);

      if (
        snapshot !== null
        && snapshot.maxJournalHeaderId >= source.maxJournalHeaderId
        && (source.journalLineCount === 0 || snapshot.lineCount > 0)
      ) return;

      await client.query(
        `DELETE FROM trial_balance_snapshot
         WHERE company_id = $1
           AND as_at_date = $2
           AND basis = $3`,
        [companyId, reportDate, BASIS],
      );

      if (source.journalCount === 0) return;

      await client.query(
        `INSERT INTO trial_balance_snapshot (
           company_id,
           as_at_date,
           basis,
           max_journal_header_id,
           journal_count,
           built_at,
           gl_account_id,
           gl_account_code,
           gl_account_name,
           account_type,
           account_category_id,
           account_category_code,
           account_category_name,
           account_category_sequence,
           debit_amount,
           credit_amount,
           balance_amount
         )
         SELECT
           jh.company_id,
           $2::date AS as_at_date,
           $3 AS basis,
           $4::bigint AS max_journal_header_id,
           $5::integer AS journal_count,
           now() AS built_at,
           jl.gl_account_id,
           ga.code AS gl_account_code,
           ga.name AS gl_account_name,
           ga.account_type,
           gac.id AS account_category_id,
           gac.code AS account_category_code,
           gac.name AS account_category_name,
           gac.sequence AS account_category_sequence,
           SUM(CASE WHEN jl.dr_cr = 'DR' THEN jl.base_currency_amount ELSE 0 END) AS debit_amount,
           SUM(CASE WHEN jl.dr_cr = 'CR' THEN jl.base_currency_amount ELSE 0 END) AS credit_amount,
           SUM(CASE WHEN jl.dr_cr = 'DR' THEN jl.base_currency_amount ELSE -jl.base_currency_amount END) AS balance_amount
         FROM journal_line jl
         JOIN journal_header jh ON jh.id = jl.journal_header_id
         JOIN gl_account ga ON ga.company_id = $6 AND ga.id = jl.gl_account_id
         LEFT JOIN gl_account_category gac ON gac.company_id = ga.company_id AND gac.id = ga.account_category_id
         WHERE jh.company_id = $1
           AND jh.status = 'POSTED'
           AND jh.posting_date <= $2
         GROUP BY
           jh.company_id,
           jl.gl_account_id,
           ga.code,
           ga.name,
           ga.account_type,
           gac.id,
           gac.code,
           gac.name,
           gac.sequence`,
        [companyId, reportDate, BASIS, source.maxJournalHeaderId, source.journalCount, settingsCompanyId],
      );
    });
  }

  async getLines(companyId: number, asAtDate?: string | null, accountTypes?: AccountType[]): Promise<TrialBalanceSnapshotLine[]> {
    const reportDate = this.reportDate(asAtDate);
    await this.refreshIfStale(companyId, reportDate);
    const params: unknown[] = [companyId, reportDate, BASIS];
    const accountTypeClause = accountTypes?.length
      ? `AND account_type = ANY($${params.push(accountTypes)}::account_type[])`
      : "";

    const { rows } = await this.db.query(
      `SELECT
         gl_account_id,
         gl_account_code,
         gl_account_name,
         account_type,
         account_category_code,
         account_category_name,
         account_category_sequence,
         debit_amount,
         credit_amount,
         balance_amount
       FROM trial_balance_snapshot
       WHERE company_id = $1
         AND as_at_date = $2
         AND basis = $3
         ${accountTypeClause}
       ORDER BY
         CASE account_type
           WHEN 'ASSET'     THEN 1
           WHEN 'LIABILITY' THEN 2
           WHEN 'EQUITY'    THEN 3
           WHEN 'REVENUE'   THEN 4
           WHEN 'EXPENSE'   THEN 5
           ELSE 6
         END,
         COALESCE(account_category_sequence, 9999),
         account_category_code ASC NULLS LAST,
         gl_account_code ASC`,
      params,
    );

    return (rows as unknown as SnapshotRow[]).map(mapSnapshotRow);
  }

  async getPeriodLines(companyId: number, fromDate: string, toDate: string, accountTypes: AccountType[]): Promise<TrialBalanceSnapshotLine[]> {
    const openingDate = previousDateString(fromDate);
    await Promise.all([
      this.refreshIfStale(companyId, openingDate),
      this.refreshIfStale(companyId, toDate),
    ]);

    const { rows } = await this.db.query(
      `WITH opening AS (
         SELECT *
         FROM trial_balance_snapshot
         WHERE company_id = $1
           AND as_at_date = $2
           AND basis = $4
           AND account_type = ANY($5::account_type[])
       ),
       closing AS (
         SELECT *
         FROM trial_balance_snapshot
         WHERE company_id = $1
           AND as_at_date = $3
           AND basis = $4
           AND account_type = ANY($5::account_type[])
       )
       SELECT
         COALESCE(c.gl_account_id, o.gl_account_id) AS gl_account_id,
         COALESCE(c.gl_account_code, o.gl_account_code) AS gl_account_code,
         COALESCE(c.gl_account_name, o.gl_account_name) AS gl_account_name,
         COALESCE(c.account_type, o.account_type) AS account_type,
         COALESCE(c.account_category_code, o.account_category_code) AS account_category_code,
         COALESCE(c.account_category_name, o.account_category_name) AS account_category_name,
         COALESCE(c.account_category_sequence, o.account_category_sequence) AS account_category_sequence,
         COALESCE(c.debit_amount, 0) - COALESCE(o.debit_amount, 0) AS debit_amount,
         COALESCE(c.credit_amount, 0) - COALESCE(o.credit_amount, 0) AS credit_amount,
         COALESCE(c.balance_amount, 0) - COALESCE(o.balance_amount, 0) AS balance_amount
       FROM closing c
       FULL OUTER JOIN opening o ON o.gl_account_id = c.gl_account_id
       ORDER BY
         CASE COALESCE(c.account_type, o.account_type)
           WHEN 'ASSET'     THEN 1
           WHEN 'LIABILITY' THEN 2
           WHEN 'EQUITY'    THEN 3
           WHEN 'REVENUE'   THEN 4
           WHEN 'EXPENSE'   THEN 5
           ELSE 6
         END,
         COALESCE(c.account_category_sequence, o.account_category_sequence, 9999),
         COALESCE(c.account_category_code, o.account_category_code) ASC NULLS LAST,
         COALESCE(c.gl_account_code, o.gl_account_code) ASC`,
      [companyId, openingDate, toDate, BASIS, accountTypes],
    );

    return (rows as unknown as SnapshotRow[]).map(mapSnapshotRow);
  }

  async getProfit(companyId: number, options: { fromDate?: string | null; toDate?: string | null }): Promise<number> {
    const toDate = this.reportDate(options.toDate);
    const toProfit = await this.getProfitAsAt(companyId, toDate);

    if (!options.fromDate) return toProfit;

    const openingDate = previousDateString(options.fromDate);
    const openingProfit = await this.getProfitAsAt(companyId, openingDate);
    return toProfit - openingProfit;
  }

  async getPeriodBalanceForGlAccounts(companyId: number, fromDate: string, toDate: string, glAccountIds: number[]): Promise<number> {
    if (glAccountIds.length === 0) return 0;
    const lines = await this.getPeriodLines(companyId, fromDate, toDate, ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]);
    return lines
      .filter((line) => glAccountIds.includes(line.glAccountId))
      .reduce((sum, line) => sum + line.balanceAmount, 0);
  }

  async getAsAtBalanceForGlAccounts(companyId: number, asAtDate: string, glAccountIds: number[]): Promise<number> {
    if (glAccountIds.length === 0) return 0;
    const lines = await this.getLines(companyId, asAtDate);
    return lines
      .filter((line) => glAccountIds.includes(line.glAccountId))
      .reduce((sum, line) => sum + line.balanceAmount, 0);
  }

  private async getProfitAsAt(companyId: number, asAtDate: string): Promise<number> {
    await this.refreshIfStale(companyId, asAtDate);
    const { rows } = await this.db.query(
      `SELECT
         COALESCE(SUM(-balance_amount), 0) AS profit
       FROM trial_balance_snapshot
       WHERE company_id = $1
         AND as_at_date = $2
         AND basis = $3
         AND account_type IN ('REVENUE', 'EXPENSE')`,
      [companyId, asAtDate, BASIS],
    );

    return Number((rows[0] as Record<string, unknown> | undefined)?.profit ?? 0);
  }
}
