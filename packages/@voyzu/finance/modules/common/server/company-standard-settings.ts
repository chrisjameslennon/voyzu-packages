import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { SettingsScopeRepo } from "./db/settings-scope.repo";

export interface CompanySettingsUiState {
  usesFinanceTemplateSettings: boolean;
  isArchived: boolean;
  readOnly: boolean;
}

export async function getCompanySettingsUiState(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsUiState> {
  const state = await new SettingsScopeRepo(db).getCompanySettingsState(companyId);
  const usesFinanceTemplateSettings = state?.useFinanceTemplateSettings === true;
  const isArchived = state?.status === "INACTIVE";

  return {
    usesFinanceTemplateSettings,
    isArchived,
    readOnly: usesFinanceTemplateSettings || isArchived,
  };
}

export async function companyUsesOrganizationStandardSettings(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<boolean> {
  return (await getCompanySettingsUiState(companyId, db)).usesFinanceTemplateSettings;
}
