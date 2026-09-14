import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as ap } from "./ap.pages.routes";
import { pageRoutes as ar } from "./ar.pages.routes";

export const pageRoutes = mergePageRoutes(ap, ar);
