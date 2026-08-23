import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { BusinessCode, CountryCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const ArCounterpartyResponseDto = StrictObject({
  id: PositiveId,
  companyId: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
  countryCode: Type.Union([CountryCode, Type.Null()]),
  countryName: Type.Union([NonBlankText, Type.Null()]),
  taxRegionOrProvince: Type.Union([Type.String(), Type.Null()]),
  audit: AuditMetadataDto,
});
export type ArCounterpartyResponseDto = Type.Static<typeof ArCounterpartyResponseDto>;
