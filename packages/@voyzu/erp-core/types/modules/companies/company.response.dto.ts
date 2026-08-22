import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/erp-core/types/modules/core";
import { BusinessCode, CountryCode, CurrencyCode, NonBlankText, PositiveId } from "@voyzu/erp-core/types/constraints";

export const CompanyResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  countryCode: CountryCode,
  country: Type.Optional(StrictObject({
    code: BusinessCode,
    name: NonBlankText,
  })),
  baseCurrencyCode: CurrencyCode,
  baseCurrency: Type.Optional(StrictObject({
    code: BusinessCode,
    name: NonBlankText,
  })),
  status: Status,
  audit: AuditMetadataDto,
});
export type CompanyResponseDto = Type.Static<typeof CompanyResponseDto>;
