import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { BalanceSheetLineDto, BalanceSheetResponseDto } from "@voyzu/finance/types/modules/company-reports/balance-sheet";
import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";

import { BalanceSheetRepo } from "../db/balance-sheet.repo";

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
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function previousDateString(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return localDateString(d);
}

async function fetchCompany(db: DbExecutor, companyId: number): Promise<{ name: string; reportLine1: string | null; reportLine2: string | null; reportFooter: string | null; baseCurrencyCode: string }> {
  const { rows } = await db.query(
    `SELECT c.name, fc.report_line_1, fc.report_line_2, fc.report_footer, c.base_currency_code FROM company c JOIN finance_company fc ON fc.company_id = c.id WHERE fc.id = $1`,
    [companyId],
  );
  if (!rows[0]) throw new NotFoundError(`Company id ${companyId} not found`);
  const r = rows[0] as Record<string, unknown>;
  return {
    name: String(r.name),
    reportLine1: r.report_line_1 == null ? null : String(r.report_line_1),
    reportLine2: r.report_line_2 == null ? null : String(r.report_line_2),
    reportFooter: r.report_footer == null ? null : String(r.report_footer),
    baseCurrencyCode: String(r.base_currency_code),
  };
}

export async function getOrganizationName(): Promise<string> {
  const { rows } = await getDb().query(`SELECT organization_name FROM organization LIMIT 1`);
  return rows[0]?.organization_name != null ? String(rows[0].organization_name) : "";
}

async function listFinancialYearsWithPostingsUnchecked(companyId: number): Promise<FinancialYearResponseDto[]> {
  const { rows } = await getDb().query(
    `SELECT fy.*,
       EXISTS (
         SELECT 1
         FROM journal_header jh
         WHERE jh.finance_company_id = fy.finance_company_id
           AND jh.status = 'POSTED'
           AND jh.posting_date BETWEEN fy.start_date AND fy.end_date
       ) AS has_postings
     FROM fiscal_year fy
     WHERE fy.finance_company_id = $1
     ORDER BY fy.start_date ASC`,
    [companyId],
  );

  return rows.map((row: Record<string, unknown>) => ({
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    companyId: Number(row.finance_company_id),
    startDate: localDateString(row.start_date),
    endDate: localDateString(row.end_date),
    status: String(row.status) as FinancialYearResponseDto["status"],
    hasPostings: Boolean(row.has_postings),
    audit: {
      created: {
        date: isoDateTimeString(row.creation_date),
        actorType: String(row.creation_actor_type) as FinancialYearResponseDto["audit"]["created"]["actorType"],
        userId: String(row.creation_user_id),
      },
      updated: {
        date: isoDateTimeString(row.updated_date),
        actorType: String(row.updated_actor_type) as FinancialYearResponseDto["audit"]["updated"]["actorType"],
        userId: String(row.updated_user_id),
      },
    },
  })).filter((year) => year.hasPostings);
}

async function getBalanceSheetUnchecked(
  companyId: number,
  asAtDate?: string | null,
): Promise<BalanceSheetResponseDto> {
  const db = getDb();
  const repo = new BalanceSheetRepo(db);

  const reportingYear = asAtDate ? await repo.getFinancialYearForDate(companyId, asAtDate) : null;
  const previousYearsProfitPromise = reportingYear
    ? repo.getProfit(companyId, { toDate: previousDateString(reportingYear.startDate) })
    : Promise.resolve(0);
  const currentYearProfitPromise = reportingYear
    ? repo.getProfit(companyId, { fromDate: reportingYear.startDate, toDate: asAtDate })
    : repo.getProfit(companyId, { toDate: asAtDate });

  const [company, lines, previousYearsProfit, currentYearProfit] = await Promise.all([
    fetchCompany(db, companyId),
    repo.getLines(companyId, asAtDate),
    previousYearsProfitPromise,
    currentYearProfitPromise,
  ]);

  const assetLines = lines.filter((line) => line.section === "ASSET");
  const liabilityLines = lines.filter((line) => line.section === "LIABILITY");
  const equityLines = lines.filter((line) => line.section === "EQUITY");

  if (previousYearsProfit !== 0) {
    equityLines.push({
      glAccountId: null,
      glAccountCode: null,
      glAccountName: "Prior Years Profit (Loss)",
      section: "EQUITY",
      amount: previousYearsProfit,
    } satisfies BalanceSheetLineDto);
  }

  if (currentYearProfit !== 0) {
    equityLines.push({
      glAccountId: null,
      glAccountCode: null,
      glAccountName: "Current Year Profit (Loss)",
      section: "EQUITY",
      amount: currentYearProfit,
    } satisfies BalanceSheetLineDto);
  }

  const totalAssets = assetLines.reduce((sum, line) => sum + line.amount, 0);
  const totalLiabilities = liabilityLines.reduce((sum, line) => sum + line.amount, 0);
  const totalEquity = equityLines.reduce((sum, line) => sum + line.amount, 0);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    asAtDate: asAtDate ?? null,
    assetLines,
    liabilityLines,
    equityLines,
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
  };
}

export const listFinancialYearsWithPostings = listFinancialYearsWithPostingsUnchecked;
export const getBalanceSheet = getBalanceSheetUnchecked;
