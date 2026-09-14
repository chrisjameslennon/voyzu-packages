import { internalApi } from "@voyzu/capability/internal-api";
export async function getSelectedCompany() {
 const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
 return selectedOrganization ? { ...selectedOrganization, id: selectedOrganization.organization_id, organizationId: selectedOrganization.organization_id } : null;
}
