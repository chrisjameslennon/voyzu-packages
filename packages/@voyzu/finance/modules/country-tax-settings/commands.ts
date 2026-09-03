import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import { CountryTaxSettingResponseDto } from "@voyzu/finance/types/modules/country-tax-settings";
import Type from "typebox";

export const listCountryTaxSettings = platformCommand.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(CountryTaxSettingResponseDto) },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.listCountryTaxSettings),
);
export const getCountryTaxSetting = platformCommand.defineLazy(
  {
    parameters: Type.Tuple([Type.String()]),
    result: Type.Union([CountryTaxSettingResponseDto, Type.Null()]),
  },
  () => import("./server/lib/country-tax-setting.service").then((module) => module.getCountryTaxSetting),
);
export const commands = { listCountryTaxSettings, getCountryTaxSetting } as const;
