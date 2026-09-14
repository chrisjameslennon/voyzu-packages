import type { VoyzuPackageNavigationDomain } from "@voyzu/types/framework";
import { financeLeftNav } from "./finance.left-nav";

const domains = [{
  label: "Finance",
  rootPath: "/finance",
  routeId: "voyzu.countryTaxSettings.page.list",
  leftNav: financeLeftNav,
}] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
