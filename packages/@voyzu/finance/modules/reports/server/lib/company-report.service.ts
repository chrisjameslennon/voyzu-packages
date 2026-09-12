import type { DbExecutor } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";

import {
  CompanyReportRepo,
  type CompanyReportContext,
  type FinanceCompanyFilingSettings,
} from "../db/company-report.repo";

export type { FinanceCompanyFilingSettings } from "../db/company-report.repo";

export async function getCompanyReportContext(
  db: DbExecutor,
  companyId: number,
): Promise<CompanyReportContext> {
  const company = await new CompanyReportRepo(db).getCompany(companyId);
  if (!company) throw new NotFoundError(`Company id ${companyId} not found`);
  return company;
}

export async function getFinanceCompanyFilingSettings(
  db: DbExecutor,
  organizationId: number,
): Promise<FinanceCompanyFilingSettings | null> {
  return new CompanyReportRepo(db).getFilingSettingsByOrganizationId(
    organizationId,
  );
}
