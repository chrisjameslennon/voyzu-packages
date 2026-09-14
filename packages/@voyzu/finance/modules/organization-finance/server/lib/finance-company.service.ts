import "server-only";

import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { internalApi } from "@voyzu/capability/internal-api";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "../../types/index";
import { createCreationAuditStamp } from "../../../common/server/index";
import { FinanceCompanyRepo, type FinanceCompanyRow } from "../db/finance-company.repo";
import { FinancialEntityInitializationRepo } from "../initialization/financial-entity-initialization.repo";

function toDto(row: FinanceCompanyRow): FinanceCompanyResponseDto {
  if (row.finance_organization_id == null) throw new BusinessRuleError(`Organization ${row.id} is missing its financial entity`);
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
    financeCompanyId: Number(row.finance_organization_id),
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

export async function getOrganizationFinance(organizationId: number): Promise<FinanceCompanyResponseDto | null> {
  const row = await new FinanceCompanyRepo(getDb()).getByOrganizationId(organizationId);
  return row ? toDto(row) : null;
}

export async function createFinancialEntity({ organizationId }: { organizationId: number }): Promise<{ financialEntityId: number }> {
  return withTransaction(async () => {
    await createFinanceCompanyForErpOrganization(organizationId);
    const company = await getOrganizationFinance(organizationId);
    if (company?.financeCompanyId == null) throw new BusinessRuleError(`Unable to create financial entity for organization ${organizationId}`);
    return { financialEntityId: company.financeCompanyId };
  });
}

export async function listSelectableFinanceCompaniesForCurrentUser(): Promise<OrganizationResponseDto[]> {
  const { organizations: accessibleOrganizations } = await internalApi.call("@core/organization-context", "get", {});
  if (accessibleOrganizations.length === 0) return [];
  const financeOrganizationIds = new Set(await new FinanceCompanyRepo(getDb()).listOrganizationIds());
  return accessibleOrganizations.filter((organization) => financeOrganizationIds.has(organization.organization_id))
    .map(({ organization_id, ...organization }) => ({ id: organization_id, ...organization }));
}

export async function resolveFinanceCompanySelectionForCurrentUser(requestedOrganizationId: number | null) {
  const organizations = await listSelectableFinanceCompaniesForCurrentUser();
  const selectedOrganization = organizations.find((organization) => organization.id === requestedOrganizationId)
    ?? organizations[0]
    ?? null;
  return { organizations, selectedOrganization };
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

export async function updateOrganizationFinance(organizationId: number, input: FinanceCompanyUpdateRequestDto): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    const repo = new FinanceCompanyRepo(db);
    const row = await repo.getForUpdate(organizationId);
    if (!row) throw new NotFoundError(`Organization ${organizationId} not found`);
    const current = toDto(row);
    if (current.status !== "ACTIVE") throw new BusinessRuleError("Archived organizations have read-only Finance settings");
    await repo.updateSettings(current.financeCompanyId, input);
    const updated = await repo.getByOrganizationId(organizationId);
    if (!updated) throw new NotFoundError(`Organization ${organizationId} not found after update`);
    return toDto(updated);
  });
}

export async function updateFinanceCompany(code: string, input: FinanceCompanyUpdateRequestDto): Promise<FinanceCompanyResponseDto> {
  const current = await getFinanceCompany(code);
  if (!current) throw new NotFoundError(`Organization ${code} not found`);
  return updateOrganizationFinance(current.id, input);
}
