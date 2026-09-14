import { internalApi } from "@voyzu/capability/internal-api";

export async function getSelectedOrganization() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) return null;
  const { organization_id, ...record } = selectedOrganization;
  return { id: organization_id, ...record };
}
