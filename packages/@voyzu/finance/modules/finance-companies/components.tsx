import { component } from "@voyzu/ui-surface/server";

export const components = {
  organizationFinanceTab: component.defineLazy(
    "organizations.detail.finance",
    () => import("./server/components/OrganizationFinanceTabComponent")
      .then((module) => module.OrganizationFinanceTabComponent),
  ),
} as const;
