import type { DbExecutor } from "@voyzu/capability/db";
import type { BalanceSheetLineDto, BalanceSheetSection } from "@voyzu/finance/types/modules/company-reports/balance-sheet";
import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";

import { TrialBalanceSnapshotRepo } from "../../../common/server/db/trial-balance-snapshot.repo";

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function localDateString(value: unknown): string {
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return String(value);
}

function isoDateTimeString(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
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
       WHERE finance_organization_id = $1
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

  async listFinancialYearsWithPostings(
    companyId: number,
  ): Promise<FinancialYearResponseDto[]> {
    const { rows } = await this.db.query(
      `SELECT fy.*,
              EXISTS (
                SELECT 1
                FROM journal_header jh
                WHERE jh.finance_organization_id = fy.finance_organization_id
                  AND jh.status = 'POSTED'
                  AND jh.posting_date BETWEEN fy.start_date AND fy.end_date
              ) AS has_postings
       FROM fiscal_year fy
       WHERE fy.finance_organization_id = $1
       ORDER BY fy.start_date ASC`,
      [companyId],
    );

    return rows
      .map((row: Record<string, unknown>) => ({
        id: Number(row.id),
        code: String(row.code),
        name: String(row.name),
        companyId: Number(row.finance_organization_id),
        startDate: localDateString(row.start_date),
        endDate: localDateString(row.end_date),
        status: String(row.status) as FinancialYearResponseDto["status"],
        hasPostings: Boolean(row.has_postings),
        audit: {
          created: {
            date: isoDateTimeString(row.creation_date),
            actorType: String(
              row.creation_actor_type,
            ) as FinancialYearResponseDto["audit"]["created"]["actorType"],
            userId: String(row.creation_user_id),
          },
          updated: {
            date: isoDateTimeString(row.updated_date),
            actorType: String(
              row.updated_actor_type,
            ) as FinancialYearResponseDto["audit"]["updated"]["actorType"],
            userId: String(row.updated_user_id),
          },
        },
      }))
      .filter((year) => year.hasPostings);
  }

  async getProfit(
    companyId: number,
    options: { fromDate?: string | null; toDate?: string | null },
  ): Promise<number> {
    return this.trialBalanceSnapshot.getProfit(companyId, options);
  }
}
