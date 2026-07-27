import { iceCreamsModule } from "../module";

export const iceCreamsTopNav = {
  label: "Ice Creams",
  icon: "icecream",
  routeId: iceCreamsModule.pageRoutes.list.id,
} as const;

export default iceCreamsTopNav;
