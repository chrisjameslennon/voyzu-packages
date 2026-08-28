import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";

export const listCountryTaxSettings = platformOperation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(Type.Any()) },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.listCountryTaxSettings),
);
export const getCountryTaxSetting = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([Type.Any(), Type.Null()]) },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.getCountryTaxSetting),
);
export const operations = { listCountryTaxSettings, getCountryTaxSetting } as const;
