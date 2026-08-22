import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode14, CountryCode, CurrencyCode, NonBlankText } from "@voyzu/erp-core/types/constraints";

export const CompanyUpdateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
  countryCode: CountryCode,
  baseCurrencyCode: CurrencyCode,
});
export type CompanyUpdateRequestDto = Type.Static<typeof CompanyUpdateRequestDto>;
