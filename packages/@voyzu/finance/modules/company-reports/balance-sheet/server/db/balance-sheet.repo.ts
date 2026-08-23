import type { DbExecutor } from "@voyzu/capability/db";
import type { BalanceSheetLineDto, BalanceSheetSection } from "@voyzu/finance/types/modules/company-reports/balance-sheet";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export class BalanceSheetRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(private readonly db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  private reportDate(asAtDate?: string | null): string {
    return asAtDate ?? todayIso();
  }

  async refreshSnapshotIfStale(companyId: number, asAtDate?: string | null): Promise<void> {
    await this.trialBalanceSnapshot.refreshIfStale(companyId, asAtDate);
  }

  async getLines(companyId: number, asAtDate?: string | null): Promise<BalanceSheetLineDto[]> {
    const reportDate = this.reportDate(asAtDate);
    const rows = await this.trialBalanceSnapshot.getLines(companyId, reportDate, ["ASSET", "LIABILITY", "EQUITY"]);

    return rows
      .map((r) => {
        const section = r.accountType as BalanceSheetSection;
        const balanceAmount = r.balanceAmount;
        return {
          glAccountId: r.glAccountId,
          glAccountCode: r.glAccountCode,
          glAccountName: r.glAccountName,
          section,
          amount: section === "ASSET" ? balanceAmount : -balanceAmount,
          categoryCode: r.categoryCode,
          categoryName: r.categoryName,
          categorySequence: r.categorySequence,
        };
      })
      .filter((line) => line.amount !== 0);
  }

  async getFinancialYearForDate(companyId: number, asAtDate: string): Promise<{ startDate: string; endDate: string } | null> {
    const { rows } = await this.db.query(
      `SELECT start_date::text, end_date::text
       FROM fiscal_year
       WHERE finance_company_id = $1
         AND $2::date BETWEEN start_date AND end_date
       ORDER BY start_date DESC
       LIMIT 1`,
      [companyId, asAtDate],
    );

    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      startDate: String(row.start_date),
      endDate: String(row.end_date),
    };
  }

  async getProfit(
    companyId: number,
    options: { fromDate?: string | null; toDate?: string | null },
  ): Promise<number> {
    return this.trialBalanceSnapshot.getProfit(companyId, options);
  }
}
