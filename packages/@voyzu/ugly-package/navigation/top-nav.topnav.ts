import { uglyModule } from "../modules/ugly/module";

const uglyPackageTopNav = {
  label: "Ugly Package",
  routeId: uglyModule.pageRoutes.home.id,
} as const;

export default uglyPackageTopNav;
