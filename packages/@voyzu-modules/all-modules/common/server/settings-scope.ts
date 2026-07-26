import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError } from "@voyzu/capability/errors";

export interface CompanySettingsScope {
  companyId: number;
  isTemplate: boolean;
}

export interface CompanyApiContext {
  companyId: number;
  companyCode: string;
}

const SELECTED_COMPANY_COOKIE = "voyzuSelectedCompanyId";
const LEGACY_SELECTED_COMPANY_COOKIE = "selectedCompanyId";

async function getTemplateCompanyId(db: DbExecutor): Promise<number> {
  const { rows } = await db.query(
    "SELECT id FROM company WHERE is_template = true AND status != 'DELETED' ORDER BY id LIMIT 1",
  );
  const id = rows[0]?.id == null ? null : Number(rows[0].id);
  if (!id) throw new BusinessRuleError("Template company is not configured");
  return id;
}

async function getCompanySettingsState(
  companyId: number,
  db: DbExecutor,
): Promise<{ id: number; isTemplate: boolean; status: string; useOrganizationStandardSettings: boolean }> {
  const { rows } = await db.query(
    "SELECT id, is_template, status, use_organization_standard_settings FROM company WHERE id = $1 AND status != 'DELETED'",
    [companyId],
  );
  const row = rows[0];
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return {
    id: Number(row.id),
    isTemplate: row.is_template === true,
    status: String(row.status),
    useOrganizationStandardSettings: row.use_organization_standard_settings === true,
  };
}

async function getActiveCompanyId(companyId: number, db: DbExecutor): Promise<number> {
  const { rows } = await db.query(
    "SELECT id FROM company WHERE id = $1 AND is_template = false AND status != 'DELETED'",
    [companyId],
  );
  if (!rows[0]) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return Number(rows[0].id);
}

async function getActiveCompanyIdByCode(companyCode: string, db: DbExecutor): Promise<number> {
  const { rows } = await db.query(
    "SELECT id FROM company WHERE code = $1 AND is_template = false AND status != 'DELETED'",
    [companyCode],
  );
  if (!rows[0]) throw new BusinessRuleError(`Company code ${companyCode} was not found`);
  return Number(rows[0].id);
}

async function getActiveCompanyApiContext(companyId: number, db: DbExecutor): Promise<CompanyApiContext> {
  const { rows } = await db.query(
    "SELECT id, code FROM company WHERE id = $1 AND is_template = false AND status != 'DELETED'",
    [companyId],
  );
  const row = rows[0];
  if (!row) throw new BusinessRuleError(`Company id ${companyId} was not found`);
  return { companyId: Number(row.id), companyCode: String(row.code) };
}

async function getDefaultActiveCompanyId(db: DbExecutor): Promise<number> {
  const { rows } = await db.query(
    "SELECT id FROM company WHERE is_template = false AND status = 'ACTIVE' ORDER BY code LIMIT 1",
  );
  if (!rows[0]) throw new BusinessRuleError("No active company is configured");
  return Number(rows[0].id);
}

export async function resolveTemplateSettingsScope(db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  return { companyId: await getTemplateCompanyId(db), isTemplate: true };
}

export async function resolveCompanySettingsScope(companyId: number, db: DbExecutor = getDb()): Promise<CompanySettingsScope> {
  return { companyId: await getActiveCompanyId(companyId, db), isTemplate: false };
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
  if (state.isTemplate || !state.useOrganizationStandardSettings) return state.id;
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
  if (!state.isTemplate && state.useOrganizationStandardSettings) {
    throw new BusinessRuleError("This company uses organization standard settings, so settings are read only here.");
  }
}

export async function resolveServerSettingsScope(
  mode: "template" | "selected",
  db: DbExecutor = getDb(),
): Promise<CompanySettingsScope> {
  if (mode === "template") return resolveTemplateSettingsScope(db);

  const cookieStore = await cookies();
  const raw = cookieStore.get(SELECTED_COMPANY_COOKIE)?.value
    ?? cookieStore.get(LEGACY_SELECTED_COMPANY_COOKIE)?.value;
  const companyId = raw ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return { companyId: await getDefaultActiveCompanyId(db), isTemplate: false };
  }
  try {
    return await resolveCompanySettingsScope(companyId, db);
  } catch (err) {
    if (err instanceof BusinessRuleError) {
      return { companyId: await getDefaultActiveCompanyId(db), isTemplate: false };
    }
    throw err;
  }
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
