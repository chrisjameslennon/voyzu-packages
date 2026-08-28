import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import { CountryTaxSettingResponseDto } from "@voyzu/finance/types/modules/country-tax-settings";
import Type from "typebox";

export const listCountryTaxSettings = platformOperation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(CountryTaxSettingResponseDto) },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.listCountryTaxSettings),
);
export const getCountryTaxSetting = platformOperation.defineLazy(
  {
    parameters: Type.Tuple([Type.String()]),
    result: Type.Union([CountryTaxSettingResponseDto, Type.Null()]),
  },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.getCountryTaxSetting),
);
export const operations = { listCountryTaxSettings, getCountryTaxSetting } as const;
