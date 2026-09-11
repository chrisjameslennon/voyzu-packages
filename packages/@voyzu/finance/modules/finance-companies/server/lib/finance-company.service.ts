import "server-only";

import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { capabilities } from "@voyzu/capability/contracts";
import type { SemanticDataValue } from "@voyzu/capability/contracts";
type OrganizationResponseDto = SemanticDataValue<"organization">;
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "@voyzu/finance/types/modules/finance-companies";
import { createCreationAuditStamp } from "../../../common/server";
import { FinanceCompanyRepo, type FinanceCompanyRow } from "../db/finance-company.repo";
import { FinancialEntityInitializationRepo } from "../initialization/financial-entity-initialization.repo";

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
        date: new Date(row.creation_date).toISOString(),
        actorType: row.creation_actor_type,
        ...(row.creation_user_id != null && { userId: row.creation_user_id }),
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: new Date(row.updated_date).toISOString(),
        actorType: row.updated_actor_type,
        ...(row.updated_user_id != null && { userId: row.updated_user_id }),
        mutationId: row.updated_mutation_id,
      },
    },
    financeCompanyId: row.finance_organization_id == null ? null : Number(row.finance_organization_id),
    financeEnabled: row.finance_organization_id != null,
    taxFilingAnchorMonth: Number(row.tax_filing_anchor_month),
    taxFilingIntervalMonths: Number(row.tax_filing_interval_months) as 1 | 2 | 3 | 6 | 12,
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

export function getFinanceCompany(code: string): Promise<FinanceCompanyResponseDto | null> {
  return findByCode(code, getDb());
}

export async function getOrganizationFinanceMasterData(organizationId: number): Promise<FinanceCompanyResponseDto | null> {
  const row = await new FinanceCompanyRepo(getDb()).getByOrganizationId(organizationId);
  return row?.finance_organization_id != null ? toDto(row) : null;
}

export async function createFinancialEntity({ organizationId }: { organizationId: number }): Promise<{ financialEntityId: number }> {
  return withTransaction(async () => {
    await createFinanceCompanyForErpOrganization(organizationId);
    const company = await getOrganizationFinanceMasterData(organizationId);
    if (company?.financeCompanyId == null) throw new BusinessRuleError(`Unable to create financial entity for organization ${organizationId}`);
    return { financialEntityId: company.financeCompanyId };
  });
}

export async function listSelectableFinanceCompaniesForCurrentUser(): Promise<OrganizationResponseDto[]> {
  const { organizations: accessibleOrganizations } = await capabilities.use("erp.organization-context").getAvailableOrganizations({});
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

    await provisionFinanceCompanyForErpOrganization(Number(company.id), db);
    const result = await findByCode(code, db);
    if (!result) throw new NotFoundError(`Company ${code} not found after Finance activation`);
    return result;
  });
}

async function provisionFinanceCompanyForErpOrganization(
  organizationId: number,
  db: DbExecutor,
): Promise<void> {
  const repo = new FinanceCompanyRepo(db);
  const organization = await repo.getProvisioningContext(organizationId);
  if (!organization) throw new NotFoundError(`Organization ${organizationId} not found`);
  if (!organization.financial_period_start_month) {
    throw new BusinessRuleError(`Finance country settings are not configured for organization ${organizationId}`);
  }

  const financialEntity = await repo.ensureFinanceOrganization(
    organizationId,
    organization.tax_filing_anchor_month,
    organization.tax_filing_interval_months,
  );
  if (!financialEntity) {
    throw new BusinessRuleError(`Unable to create financial entity for organization ${organizationId}`);
  }
  // Existing entities (including reactivations) keep their customized settings.
  if (financialEntity.created) {
    await new FinancialEntityInitializationRepo(db).initialize(
      financialEntity.id,
      await createCreationAuditStamp(),
    );
  }
}

export function createFinanceCompanyForErpOrganization(
  organizationId: number,
): Promise<void> {
  return withTransaction((db) => provisionFinanceCompanyForErpOrganization(organizationId, db));
}

export function activateFinanceCompanyForErpOrganization(
  organizationId: number,
): Promise<void> {
  return withTransaction((db) => provisionFinanceCompanyForErpOrganization(organizationId, db));
}

export async function deactivateFinanceCompanyForErpOrganization(
  _organizationId: number,
): Promise<void> {
  // Finance derives availability from the owning ERP organization's status.
}

export async function updateFinanceCompany(code: string, input: FinanceCompanyUpdateRequestDto): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    const repo = new FinanceCompanyRepo(db);
    const current = await findByCode(code, db);
    if (!current) throw new NotFoundError(`Company ${code} not found`);
    if (!current.financeCompanyId) throw new BusinessRuleError(`Company ${code} is not enabled for Finance`);
    await repo.updateSettings(current.financeCompanyId, input);
    const updated = await findByCode(code, db);
    if (!updated) throw new NotFoundError(`Company ${code} not found after update`);
    return updated;
  });
}

export async function deleteFinanceCompanyForErpOrganization(organizationId: number): Promise<void> {
  await new FinanceCompanyRepo(getDb()).deleteByOrganizationId(organizationId);
}
