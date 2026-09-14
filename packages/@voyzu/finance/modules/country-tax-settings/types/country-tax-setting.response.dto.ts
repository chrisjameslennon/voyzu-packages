import Type from "typebox";
import { StrictObject } from "@voyzu/types/http-api";
import { CountryFinanceSchema } from "@voyzu/types/business-objects/country-finance";
export {
  CountryTaxAuthorityResponseDto,
  CountryTaxRuleResponseDto,
  CountryTaxComponentResponseDto,
} from "@voyzu/types/business-objects/country-finance";

export const CountryTaxSettingResponseDto = StrictObject({
  ...Type.Omit(CountryFinanceSchema, ["code"]).properties,
  id: Type.String(),
  code: Type.String(),
  name: Type.String(),
  currencyCode: Type.String(),
  currencyName: Type.String(),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
});
export type CountryTaxSettingResponseDto = Type.Static<typeof CountryTaxSettingResponseDto>;
