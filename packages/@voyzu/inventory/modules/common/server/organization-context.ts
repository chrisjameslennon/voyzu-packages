import { cookies } from "next/headers";
import {
  SELECTED_ORGANIZATION_COOKIE,
  parseSelectedOrganizationId,
  resolveOrganizationSelectionForCurrentUser,
} from "@voyzu/erp-core/organization-switcher/server";

export async function getSelectedOrganization() {
  const cookieStore = await cookies();
  const selectedOrganizationId = parseSelectedOrganizationId(
    cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value,
  );
  const { selectedOrganization } = await resolveOrganizationSelectionForCurrentUser(selectedOrganizationId);
  return selectedOrganization;
}
