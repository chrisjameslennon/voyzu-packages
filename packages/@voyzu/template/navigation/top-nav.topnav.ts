import { pageRoutes } from "../modules/template/pages.routes";

export const templatesTopNav = {
  label: "Template",
  icon: "description",
  routeId: pageRoutes.list.id,
} as const;

export default templatesTopNav;
