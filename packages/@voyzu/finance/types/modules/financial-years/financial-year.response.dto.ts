import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { BusinessCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const FinancialYearStatus = Type.Union([Type.Literal("INACTIVE"), Type.Literal("PLANNED"), Type.Literal("OPEN"), Type.Literal("CLOSED")]);
export type FinancialYearStatus = Type.Static<typeof FinancialYearStatus>;

export const FinancialYearResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  companyId: PositiveId,
  startDate: IsoDate,
  endDate: IsoDate,
  status: FinancialYearStatus,
  hasPostings: Type.Boolean({ description: "True when a posted journal has a posting date within this financial year." }),
  audit: AuditMetadataDto,
});
export type FinancialYearResponseDto = Type.Static<typeof FinancialYearResponseDto>;
