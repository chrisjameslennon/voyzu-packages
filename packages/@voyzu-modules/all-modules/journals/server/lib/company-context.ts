import { cookies } from "next/headers";
import {
  SELECTED_COMPANY_COOKIE,
  parseSelectedCompanyId,
  resolveCompanySelectionForCurrentUser,
} from "@voyzu-modules/all-modules/company-switcher/server";

export async function getSelectedCompany() {
  const cookieStore = await cookies();
  const selectedCompanyId = parseSelectedCompanyId(cookieStore.get(SELECTED_COMPANY_COOKIE)?.value);
  const { selectedCompany } = await resolveCompanySelectionForCurrentUser(selectedCompanyId);
  return selectedCompany;
}
