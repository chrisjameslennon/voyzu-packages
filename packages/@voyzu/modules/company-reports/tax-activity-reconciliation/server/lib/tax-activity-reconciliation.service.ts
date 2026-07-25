import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { TaxActivityReconciliationResponseDto } from "@voyzu/types/modules/company-reports";

import { TaxActivityReconciliationRepo } from "../db/tax-activity-reconciliation.repo";

interface TaxActivityReconciliationCompany {
  name: string;
  reportLine1: string | null;
  reportLine2: string | null;
  reportFooter: string | null;
  baseCurrencyCode: string;
}

async function fetchCompany(db: ReturnType<typeof getDb>, companyId: number): Promise<TaxActivityReconciliationCompany> {
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

export async function getTaxActivityReconciliation(
  companyId: number,
  periodStartDate: string,
  periodEndDate: string,
  periodLabel: string,
  taxAuthorityCode?: string | null,
): Promise<TaxActivityReconciliationResponseDto> {
  const db = getDb();
  const repo = new TaxActivityReconciliationRepo(db);
  const [company, taxAuthorityOptions] = await Promise.all([
    fetchCompany(db, companyId),
    repo.listTaxAuthoritiesForCompany(companyId),
  ]);
  const selectedTaxAuthority = taxAuthorityOptions.find((option) => option.taxAuthorityCode === taxAuthorityCode)
    ?? taxAuthorityOptions[0]
    ?? null;
  const allLines = await repo.getAccrualLinesForPeriod(companyId, periodStartDate, periodEndDate);
  const lines = selectedTaxAuthority
    ? allLines.filter((line) => line.taxAuthorityCode === selectedTaxAuthority.taxAuthorityCode)
    : [];
  const [total, trialBalanceTaxMovement] = await Promise.all([
    Promise.resolve(repo.total(lines)),
    repo.getTrialBalanceTaxMovement(companyId, periodStartDate, periodEndDate),
  ]);
  const allAuthorityTotal = repo.total(allLines);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    taxAuthorityCode: selectedTaxAuthority?.taxAuthorityCode ?? "",
    taxAuthorityName: selectedTaxAuthority?.taxAuthorityName ?? "",
    taxAuthorityOptions,
    periodLabel,
    periodStartDate,
    periodEndDate,
    lines,
    total,
    trialBalanceReconciled: Math.abs(allAuthorityTotal + trialBalanceTaxMovement) < 0.01,
  };
}
