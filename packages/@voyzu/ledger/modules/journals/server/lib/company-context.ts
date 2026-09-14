import { internalApi } from "@voyzu/capability/internal-api";
import { findCompanySettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function getSelectedCompany() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) return null;
  const financeScope = await findCompanySettingsScope(selectedOrganization.organization_id);
  if (!financeScope) return null;
  return {
    ...selectedOrganization,
    organizationId: selectedOrganization.organization_id,
    id: financeScope.companyId,
  };
}
