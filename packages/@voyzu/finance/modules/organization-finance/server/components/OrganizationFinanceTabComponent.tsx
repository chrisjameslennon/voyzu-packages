import "server-only";

import { getFinanceCompany } from "../lib/finance-company.service";
import { OrganizationFinanceTab } from "../../client/OrganizationFinanceTab";

export async function OrganizationFinanceTabComponent(props: Record<string, unknown>) {
  const organizationCode = typeof props.organizationCode === "string"
    ? props.organizationCode
    : "";
  if (!organizationCode) return null;
  const company = await getFinanceCompany(organizationCode);
  if (!company) return null;
  return <OrganizationFinanceTab company={company} />;
}
