import { capabilities } from "@voyzu/capability/contracts";

export async function getSelectedOrganization() {
  const { selectedOrganization } = await capabilities.use("erp.organization-context").getActiveOrganization({});
  return selectedOrganization;
}
