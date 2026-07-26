import type { DbExecutor } from "@voyzu/capability/db";
import type { ProfitLossLineDto, ProfitLossSection } from "@voyzu-modules/core/types/modules/company-reports";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";

export interface ProfitLossDimensionSourceLine {
  glAccountId: number;
  glAccountCode: string;
  glAccountName: string;
  section: ProfitLossSection;
  amount: number;
  dimensions: Record<string, string>;
  categoryCode: string | null;
  categoryName: string | null;
  categorySequence: number | null;
}

export class ProfitLossRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(private readonly db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  async getLines(companyId: number, fromDate: string, toDate: string): Promise<ProfitLossLineDto[]> {
    const rows = await this.trialBalanceSnapshot.getPeriodLines(companyId, fromDate, toDate, ["REVENUE", "EXPENSE"]);

    return rows.map((r) => {
      const section: ProfitLossSection = r.accountType === "REVENUE" ? "INCOME" : "EXPENSE";
      return {
        glAccountId: r.glAccountId,
        glAccountCode: r.glAccountCode,
        glAccountName: r.glAccountName,
        section,
        amount: section === "INCOME" ? -r.balanceAmount : r.balanceAmount,
        categoryCode: r.categoryCode,
        categoryName: r.categoryName,
        categorySequence: r.categorySequence,
      };
    }).filter((line) => line.amount !== 0);
  }

  async getDimensionSourceLines(
    companyId: number,
    fromDate: string,
    toDate: string,
  ): Promise<ProfitLossDimensionSourceLine[]> {
    const { rows } = await this.db.query(
      `WITH line_dimensions AS (
         SELECT
           jl.id AS journal_line_id,
           jsonb_object_agg(jld.dimension_code, jld.dimension_value_name) FILTER (WHERE jld.dimension_code IS NOT NULL) AS dimension_values
         FROM journal_line jl
         LEFT JOIN journal_line_dimension jld
           ON jld.journal_line_id = jl.id
         GROUP BY jl.id
       )
       SELECT
         jl.id AS journal_line_id,
         jl.gl_account_id,
         jl.gl_account_code,
         jl.gl_account_name,
         ga.account_type,
         gac.code     AS category_code,
         gac.name     AS category_name,
         gac.sequence AS category_sequence,
         COALESCE(ld.dimension_values, '{}'::jsonb) AS dimension_values,
         CASE
           WHEN ga.account_type = 'REVENUE' THEN CASE WHEN jl.dr_cr = 'CR' THEN jl.base_currency_amount ELSE -jl.base_currency_amount END
           ELSE CASE WHEN jl.dr_cr = 'DR' THEN jl.base_currency_amount ELSE -jl.base_currency_amount END
         END AS amount
       FROM journal_line jl
       JOIN journal_header jh ON jh.id = jl.journal_header_id
       JOIN gl_account ga ON ga.company_id = jh.company_id AND ga.id = jl.gl_account_id
       LEFT JOIN gl_account_category gac ON gac.company_id = ga.company_id AND gac.id = ga.account_category_id
       JOIN line_dimensions ld ON ld.journal_line_id = jl.id
       WHERE jh.company_id = $1
         AND jh.status = 'POSTED'
         AND jh.posting_date >= $2
         AND jh.posting_date <= $3
         AND ga.account_type IN ('REVENUE', 'EXPENSE')
       ORDER BY
         CASE ga.account_type
           WHEN 'REVENUE' THEN 1
           WHEN 'EXPENSE' THEN 2
           ELSE 3
         END,
         COALESCE(gac.sequence, 9999),
         gac.code ASC NULLS LAST,
         jl.gl_account_code ASC,
         jl.id ASC`,
      [companyId, fromDate, toDate],
    );

    return rows.map((r: Record<string, unknown>) => {
      const section: ProfitLossSection = r.account_type === "REVENUE" ? "INCOME" : "EXPENSE";
      return {
        glAccountId: Number(r.gl_account_id),
        glAccountCode: String(r.gl_account_code),
        glAccountName: String(r.gl_account_name),
        section,
        amount: Number(r.amount),
        dimensions: (r.dimension_values ?? {}) as Record<string, string>,
        categoryCode: r.category_code != null ? String(r.category_code) : null,
        categoryName: r.category_name != null ? String(r.category_name) : null,
        categorySequence: r.category_sequence != null ? Number(r.category_sequence) : null,
      };
    });
  }
}
