import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { pageRoutes as financeCompaniesPageRoutes } from "@voyzu/finance/finance-companies/pages.routes";

export const financeAdminLeftNav = [{
  label: "Finance Admin",
  items: [{
    label: "Financial Entities",
    icon: "domain",
    routeId: financeCompaniesPageRoutes.list.id,
  }],
}] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeAdminLeftNav;
