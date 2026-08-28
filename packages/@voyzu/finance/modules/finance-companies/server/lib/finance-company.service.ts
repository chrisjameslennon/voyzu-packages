import "server-only";

import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { listSelectableOrganizationsForCurrentUser } from "@voyzu/erp-core/organization-switcher/server";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";
import { createCreationAuditStamp } from "../../../common/server";
import { FinanceCompanyRepo, type FinanceCompanyRow } from "../db/finance-company.repo";

function toDto(row: FinanceCompanyRow): FinanceCompanyResponseDto {
  return {
    id: Number(row.id),
    code: row.code,
    name: row.name,
    countryCode: row.country_code,
    country: { code: row.country_code, name: row.country_name },
    baseCurrencyCode: row.base_currency_code,
    baseCurrency: { code: row.base_currency_code, name: row.currency_name },
    status: row.status,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        ...(row.creation_user_id != null && { userId: row.creation_user_id }),
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        ...(row.updated_user_id != null && { userId: row.updated_user_id }),
        mutationId: row.updated_mutation_id,
      },
    },
    financeCompanyId: row.finance_organization_id == null ? null : Number(row.finance_organization_id),
    financeEnabled: row.finance_organization_id != null,
    taxFilingAnchorMonth: Number(row.tax_filing_anchor_month),
    taxFilingIntervalMonths: Number(row.tax_filing_interval_months) as 1 | 2 | 3 | 6 | 12,
    useFinanceTemplateSettings: row.use_finance_template_settings,
    ...(row.report_line_1 != null && { reportLine1: row.report_line_1 }),
    ...(row.report_line_2 != null && { reportLine2: row.report_line_2 }),
    ...(row.report_footer != null && { reportFooter: row.report_footer }),
    hasPostings: row.has_postings,
  };
}

async function findByCode(code: string, db: DbExecutor): Promise<FinanceCompanyResponseDto | null> {
  const row = await new FinanceCompanyRepo(db).getByCode(code);
  return row ? toDto(row) : null;
}

export async function listFinanceCompanies(): Promise<FinanceCompanyResponseDto[]> {
  return (await new FinanceCompanyRepo(getDb()).list()).map(toDto);
}

export function getFinanceCompany(code: string): Promise<FinanceCompanyResponseDto | null> {
  return findByCode(code, getDb());
}

export async function listSelectableFinanceCompaniesForCurrentUser(): Promise<OrganizationResponseDto[]> {
  const accessibleOrganizations = await listSelectableOrganizationsForCurrentUser();
  if (accessibleOrganizations.length === 0) return [];
  const financeOrganizationIds = new Set(await new FinanceCompanyRepo(getDb()).listOrganizationIds());
  return accessibleOrganizations.filter((organization) => financeOrganizationIds.has(organization.id));
}

export async function resolveFinanceCompanySelectionForCurrentUser(requestedOrganizationId: number | null) {
  const organizations = await listSelectableFinanceCompaniesForCurrentUser();
  const selectedOrganization = organizations.find((organization) => organization.id === requestedOrganizationId)
    ?? organizations[0]
    ?? null;
  return { organizations, selectedOrganization };
}

export async function activateFinanceCompany(code: string): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    const repo = new FinanceCompanyRepo(db);
    await repo.lock(code);
    const company = await repo.getActivationContext(code);
    if (!company) throw new NotFoundError(`Company ${code} not found`);
    if (company.status !== "ACTIVE") throw new BusinessRuleError("Only an active organization company can be enabled for Finance");
    if (!company.financial_period_start_month) throw new BusinessRuleError(`Finance country settings are not configured for company ${code}`);

    const financeCompanyId = await repo.ensureFinanceOrganization(
      Number(company.id),
      company.tax_filing_anchor_month,
      company.tax_filing_interval_months,
    );
    if (!financeCompanyId) throw new BusinessRuleError(`Unable to enable company ${code} for Finance`);

    await repo.createFiscalCalendar(
      financeCompanyId,
      String(company.financial_period_start_month),
      await createCreationAuditStamp(),
    );
    const result = await findByCode(code, db);
    if (!result) throw new NotFoundError(`Company ${code} not found after Finance activation`);
    return result;
  });
}

export async function updateFinanceCompany(code: string, input: FinanceCompanyUpdateRequestDto): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    const repo = new FinanceCompanyRepo(db);
    const current = await findByCode(code, db);
    if (!current) throw new NotFoundError(`Company ${code} not found`);
    if (!current.financeCompanyId) throw new BusinessRuleError(`Company ${code} is not enabled for Finance`);
    if (!current.useFinanceTemplateSettings && input.useFinanceTemplateSettings) {
      throw new BusinessRuleError("A company cannot be re-coupled to Finance Admin standard settings");
    }
    if (current.useFinanceTemplateSettings && !input.useFinanceTemplateSettings) {
      if (!await repo.copyTemplateSettings(current.financeCompanyId)) {
        throw new BusinessRuleError("Finance template is not configured");
      }
    }
    await repo.updateSettings(current.financeCompanyId, input);
    const updated = await findByCode(code, db);
    if (!updated) throw new NotFoundError(`Company ${code} not found after update`);
    return updated;
  });
}

export async function deleteFinanceCompanyForErpOrganization(organizationId: number, db: DbExecutor): Promise<void> {
  await new FinanceCompanyRepo(db).deleteByOrganizationId(organizationId);
}
