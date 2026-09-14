import { httpApiRoutes as ap } from "./ap.http-api.routes";
import { httpApiRoutes as ar } from "./ar.http-api.routes";
export const httpApiRoutes = { ...ap, ...ar } as const;
