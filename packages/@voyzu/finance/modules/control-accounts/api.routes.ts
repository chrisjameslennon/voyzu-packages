import { apiDefinitions as ap } from "./ap.api.routes";
import { apiDefinitions as ar } from "./ar.api.routes";

export const apiDefinitions = {
  apList: ap.list,
  apGet: ap.get,
  apPatch: ap.patch,
  arList: ar.list,
  arGet: ar.get,
  arPatch: ar.patch,
} as const;
