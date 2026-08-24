import { uglyPackageModule } from "../modules/ugly/module";

const uglyPackageTopNav = {
  label: "Ugly Package",
  routeId: uglyPackageModule.pageRoutes.home.id,
} as const;

export default uglyPackageTopNav;
