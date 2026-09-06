import { pageRoutes } from "../modules/customers/pages.routes";

export const commercialTopNav = {
  label: "Commercial",
  icon: "storefront",
  routeId: pageRoutes.customers.id,
} as const;
export default commercialTopNav;
