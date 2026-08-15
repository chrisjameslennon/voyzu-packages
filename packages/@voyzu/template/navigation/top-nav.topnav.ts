import { templateModule } from "../modules/template/module";

export const templatesTopNav = {
  label: "Template",
  icon: "description",
  routeId: templateModule.pageRoutes.list.id,
} as const;

export default templatesTopNav;
