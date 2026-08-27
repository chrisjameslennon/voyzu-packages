import { pageRoutes } from "../modules/ice-creams/pages.routes";

export const iceCreamsTopNav = {
  label: "Ice Creams",
  icon: "icecream",
  routeId: pageRoutes.list.id,
} as const;

export default iceCreamsTopNav;
