import { capabilities } from "@voyzu/capability/contracts";
import { findCompanySettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function getSelectedCompany() {
  const { selectedOrganization } = await capabilities.use("erp.organization-context").getActiveOrganization({});
  if (!selectedOrganization) return null;
  const financeScope = await findCompanySettingsScope(selectedOrganization.id);
  if (!financeScope) return null;
  return {
    ...selectedOrganization,
    organizationId: selectedOrganization.id,
    id: financeScope.companyId,
  };
}
