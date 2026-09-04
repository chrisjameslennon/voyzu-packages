import { cookies } from "next/headers";
import {
  SELECTED_ORGANIZATION_COOKIE,
  parseSelectedOrganizationId,
  resolveOrganizationSelectionForCurrentUser,
} from "@voyzu/erp-core/organization-switcher/server";
import { findCompanySettingsScope } from "../../../common/server/settings-scope";

export async function getSelectedCompany() {
  const cookieStore = await cookies();
  const selectedOrganizationId = parseSelectedOrganizationId(cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value);
  const { selectedOrganization } = await resolveOrganizationSelectionForCurrentUser(selectedOrganizationId);
  if (!selectedOrganization) return null;
  const financeScope = await findCompanySettingsScope(selectedOrganization.id);
  if (!financeScope) return null;
  return {
    ...selectedOrganization,
    organizationId: selectedOrganization.id,
    id: financeScope.companyId,
  };
}
