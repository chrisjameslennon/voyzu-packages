import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { TrialBalanceResponseDto } from "@voyzu/core/types/modules/company-reports";

import { TrialBalanceRepo } from "../db/trial-balance.repo";

async function fetchCompany(db: ReturnType<typeof getDb>, companyId: number): Promise<{ name: string; reportLine1: string | null; reportLine2: string | null; reportFooter: string | null; baseCurrencyCode: string }> {
  const { rows } = await db.query(
    `SELECT name, report_line_1, report_line_2, report_footer, base_currency_code FROM company WHERE id = $1`,
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

async function getTrialBalanceUnchecked(
  companyId: number,
  asAtDate?: string | null,
): Promise<TrialBalanceResponseDto> {
  const db = getDb();
  const repo = new TrialBalanceRepo(db);

  const [company, lines] = await Promise.all([
    fetchCompany(db, companyId),
    repo.getLines(companyId, asAtDate),
  ]);

  const totalDebit = lines.reduce((s, l) => s + l.debitTotal, 0);
  const totalCredit = lines.reduce((s, l) => s + l.creditTotal, 0);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    asAtDate: asAtDate ?? null,
    lines,
    totalDebit,
    totalCredit,
  };
}

export const getTrialBalance = getTrialBalanceUnchecked;
