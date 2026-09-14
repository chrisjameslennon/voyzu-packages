import type { NextRequest } from "next/server";

import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError } from "@voyzu/capability/errors";
import { internalApi } from "@voyzu/capability/internal-api";

import { SettingsScopeRepo } from "../db/settings-scope.repo";

export interface CompanySettingsScope {
  companyId: number;
}

export interface CompanyHttpApiContext {
  companyId: number;
  companyCode: string;
}

async function getCompanySettingsState(
  companyId: number,
  db: DbExecutor,
): Promise<{ id: number; status: string }> {
  const row = await new SettingsScopeRepo(db).getCompanySettingsState(companyId);
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return {
    id: row.id,
    status: row.status,
  };
}

async function getActiveCompanyIdByCode(companyCode: string, db: DbExecutor): Promise<number> {
  const id = await new SettingsScopeRepo(db).getActiveCompanyIdByCode(companyCode);
  if (!id) throw new BusinessRuleError(`Company code ${companyCode} was not found`);
  return id;
}

async function getActiveCompanyHttpApiContext(companyId: number, db: DbExecutor): Promise<CompanyHttpApiContext> {
  const row = await new SettingsScopeRepo(db).getActiveCompanyHttpApiContext(companyId);
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return row;
}

export async function findCompanySettingsScope(
  organizationId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope | null> {
  const companyId = await new SettingsScopeRepo(db).getActiveCompanyIdByOrganizationId(
    organizationId,
  );
  return companyId ? { companyId } : null;
}

export async function resolveCompanySettingsScope(companyId: number, db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  const scope = await findCompanySettingsScope(companyId, db);
  if (!scope) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return scope;
}

export async function resolveCompanySettingsScopeByCode(companyCode: string, db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  return { companyId: await getActiveCompanyIdByCode(companyCode, db) };
}

export async function resolveServerCompanyHttpApiContext(db: DbExecutor = getDb()): Promise<CompanyHttpApiContext> {
  const scope = await resolveServerSettingsScope(db);
  return getActiveCompanyHttpApiContext(scope.companyId, db);
}

export async function resolveHttpApiCompanyIdFromPath(
  request: NextRequest,
  db: DbExecutor = getDb(),
): Promise<number> {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const financeIndex = segments.indexOf("finance");
  const companyCode = financeIndex >= 0 ? segments[financeIndex + 1] : undefined;
  if (!companyCode) throw new BusinessRuleError("Company code path parameter is required");
  return (await resolveCompanySettingsScopeByCode(companyCode, db)).companyId;
}

export async function resolveEffectiveSettingsCompanyId(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<number> {
  const state = await getCompanySettingsState(companyId, db);
  return state.id;
}

export async function assertCompanySettingsWritable(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<void> {
  const state = await getCompanySettingsState(companyId, db);
  if (state.status === "INACTIVE") {
    throw new BusinessRuleError("This company has been archived, so its settings are read only.");
  }
}

export async function resolveServerSettingsScope(
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope> {
  const { organization_id: companyId, organizations: available } = await internalApi.call("@core/organization-context", "get", {});
  const accessibleCompanies = available.map(({ organization_id, ...organization }) => ({ id: organization_id, ...organization }));
  const financeCompanyIds = new Set(
    await new SettingsScopeRepo(db).listFinanceOrganizationIds(),
  );
  const financeCompanies = accessibleCompanies.filter((company) => financeCompanyIds.has(company.id));
  const selectedCompany = financeCompanies.find((company) => company.id === companyId)
    ?? financeCompanies[0]
    ?? null;
  if (!selectedCompany) {
    throw new BusinessRuleError("You do not have access to any companies");
  }
  return resolveCompanySettingsScope(selectedCompany.id, db);
}

export async function resolveHttpApiSettingsScope(
  request: NextRequest,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope> {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const financeIndex = segments.indexOf("finance");
  const companyCode = financeIndex >= 0 ? segments[financeIndex + 1] : undefined;
  if (companyCode) return resolveCompanySettingsScopeByCode(companyCode, db);
  throw new BusinessRuleError("Company code path parameter is required");
}
