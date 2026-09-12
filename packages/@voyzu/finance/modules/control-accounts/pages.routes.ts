import { pageRoutes as ap } from "./ap.pages.routes";
import { pageRoutes as ar } from "./ar.pages.routes";

export const pageRoutes = {
  apList: ap.list,
  apDetail: ap.detail,
  arList: ar.list,
  arDetail: ar.detail,
} as const;
