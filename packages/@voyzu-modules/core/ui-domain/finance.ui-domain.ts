import { journalsModule } from "@voyzu-modules/core/journals";

import { financePageRoutes } from "./finance.definition";
import { financeLeftNav } from "./finance.left-nav";

export const financeUiDomain = {
  id: "voyzu.core.finance.ui-domain",
  label: "Finance",
  topNavItem: {
    label: "Finance",
    routeId: journalsModule.pageRoutes.list.id,
  },
  pageRoutes: financePageRoutes,
  leftNav: financeLeftNav,
} as const;

export default financeUiDomain;
