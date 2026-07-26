import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { TaxActivityResponseDto } from "@voyzu-modules/types/modules/company-reports";

import { TaxActivityRepo } from "../db/tax-activity.repo";

interface TaxActivityCompany {
  name: string;
  reportLine1: string | null;
  reportLine2: string | null;
  reportFooter: string | null;
  baseCurrencyCode: string;
}

async function fetchCompany(db: ReturnType<typeof getDb>, companyId: number): Promise<TaxActivityCompany> {
  const { rows } = await db.query(
    `SELECT
       name,
       report_line_1,
       report_line_2,
       report_footer,
       base_currency_code
     FROM company
     WHERE id = $1`,
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

export async function getTaxActivity(
  companyId: number,
  periodStartDate: string,
  periodEndDate: string,
  periodLabel: string,
): Promise<TaxActivityResponseDto> {
  const db = getDb();
  const repo = new TaxActivityRepo(db);

  const company = await fetchCompany(db, companyId);
  const lines = await repo.getAccrualLinesForPeriod(companyId, periodStartDate, periodEndDate);
  const summary = repo.summarize(lines);
  const trialBalanceTaxMovement = await repo.getTrialBalanceTaxMovement(companyId, periodStartDate, periodEndDate);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    periodLabel,
    periodStartDate,
    periodEndDate,
    ...summary,
    trialBalanceReconciled: Math.abs(summary.closingTaxPositionImpact + trialBalanceTaxMovement) < 0.01,
  };
}
