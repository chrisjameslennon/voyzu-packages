import { getDb } from "@voyzu/capability/db";
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

function previousDateString(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return localDateString(d);
}

import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function listFinancialYearsWithPostingsUnchecked(companyId: number): Promise<FinancialYearResponseDto[]> {
  return new BalanceSheetRepo(getDb()).listFinancialYearsWithPostings(companyId);
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
    getCompanyReportContext(db, companyId),
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
