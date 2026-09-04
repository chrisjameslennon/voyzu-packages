import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError } from "@voyzu/capability/errors";
import {
  listSelectableOrganizationsForCurrentUser,
  SELECTED_ORGANIZATION_COOKIE,
} from "@voyzu/erp-core/organization-switcher/server";

import { SettingsScopeRepo } from "./db/settings-scope.repo";

export interface CompanySettingsScope {
  companyId: number;
  isTemplate: boolean;
}

export interface CompanyApiContext {
  companyId: number;
  companyCode: string;
}

async function getTemplateCompanyId(db: DbExecutor): Promise<number> {
  const id = await new SettingsScopeRepo(db).getTemplateCompanyId();
  if (!id) throw new BusinessRuleError("Template company is not configured");
  return id;
}

async function getCompanySettingsState(
  companyId: number,
  db: DbExecutor,
): Promise<{ id: number; isTemplate: boolean; status: string; useFinanceTemplateSettings: boolean }> {
  const row = await new SettingsScopeRepo(db).getCompanySettingsState(companyId);
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return {
    id: row.id,
    isTemplate: row.isTemplate,
    status: row.status,
    useFinanceTemplateSettings: row.useFinanceTemplateSettings,
  };
}

async function getActiveCompanyIdByCode(companyCode: string, db: DbExecutor): Promise<number> {
  const id = await new SettingsScopeRepo(db).getActiveCompanyIdByCode(companyCode);
  if (!id) throw new BusinessRuleError(`Company code ${companyCode} was not found`);
  return id;
}

async function getActiveCompanyApiContext(companyId: number, db: DbExecutor): Promise<CompanyApiContext> {
  const row = await new SettingsScopeRepo(db).getActiveCompanyApiContext(companyId);
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return row;
}

export async function resolveTemplateSettingsScope(db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  return { companyId: await getTemplateCompanyId(db), isTemplate: true };
}

export async function findCompanySettingsScope(
  organizationId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope | null> {
  const companyId = await new SettingsScopeRepo(db).getActiveCompanyIdByOrganizationId(
    organizationId,
  );
  return companyId ? { companyId, isTemplate: false } : null;
}

export async function resolveCompanySettingsScope(companyId: number, db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  const scope = await findCompanySettingsScope(companyId, db);
  if (!scope) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return scope;
}

export async function resolveCompanySettingsScopeByCode(companyCode: string, db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  return { companyId: await getActiveCompanyIdByCode(companyCode, db), isTemplate: false };
}

export async function resolveServerCompanyApiContext(db: DbExecutor = getDb()): Promise<CompanyApiContext> {
  const scope = await resolveServerSettingsScope("selected", db);
  return getActiveCompanyApiContext(scope.companyId, db);
}

export async function resolveApiCompanyIdFromPath(
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
  if (state.isTemplate || !state.useFinanceTemplateSettings) return state.id;
  return getTemplateCompanyId(db);
}

export async function assertCompanySettingsWritable(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<void> {
  const state = await getCompanySettingsState(companyId, db);
  if (!state.isTemplate && state.status === "INACTIVE") {
    throw new BusinessRuleError("This company has been archived, so its settings are read only.");
  }
  if (!state.isTemplate && state.useFinanceTemplateSettings) {
    throw new BusinessRuleError("This company uses finance template settings, so settings are read only here.");
  }
}

export async function resolveServerSettingsScope(
  mode: "template" | "selected",
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope> {
  if (mode === "template") return resolveTemplateSettingsScope(db);

  const cookieStore = await cookies();
  const raw = cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value;
  const companyId = raw ? Number.parseInt(raw, 10) : NaN;
  const accessibleCompanies = await listSelectableOrganizationsForCurrentUser();
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

export async function resolveApiSettingsScope(
  request: NextRequest,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope> {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const financeIndex = segments.indexOf("finance");
  const companyCode = financeIndex >= 0 ? segments[financeIndex + 1] : undefined;
  if (companyCode) return resolveCompanySettingsScopeByCode(companyCode, db);

  return resolveTemplateSettingsScope(db);
}
