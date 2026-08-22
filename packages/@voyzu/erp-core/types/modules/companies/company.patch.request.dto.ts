import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode14, CountryCode, CurrencyCode, NonBlankText } from "@voyzu/erp-core/types/constraints";

export const CompanyPatchRequestDto = StrictObject({
  code: Type.Optional(BusinessCode14),
  name: Type.Optional(NonBlankText),
  countryCode: Type.Optional(CountryCode),
  baseCurrencyCode: Type.Optional(CurrencyCode),
}, { minProperties: 1 });
export type CompanyPatchRequestDto = Type.Static<typeof CompanyPatchRequestDto>;
