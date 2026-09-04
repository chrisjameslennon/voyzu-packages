import { getDb, type DbExecutor } from "@voyzu/capability/db";
import { SettingsScopeRepo } from "./db/settings-scope.repo";

export interface CompanySettingsUiState {
  isArchived: boolean;
  readOnly: boolean;
}

export async function getCompanySettingsUiState(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsUiState> {
  const state = await new SettingsScopeRepo(db).getCompanySettingsState(companyId);
  const isArchived = state?.status === "INACTIVE";

  return {
    isArchived,
    readOnly: isArchived,
  };
}
