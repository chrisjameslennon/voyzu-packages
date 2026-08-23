import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { BusinessCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const FinancialPeriodStatus = Type.Union([Type.Literal("OPEN"), Type.Literal("CLOSED")]);
export type FinancialPeriodStatus = Type.Static<typeof FinancialPeriodStatus>;

export const FinancialPeriodResponseDto = StrictObject({
  id: PositiveId,
  financialYearId: PositiveId,
  companyId: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  startDate: IsoDate,
  endDate: IsoDate,
  status: FinancialPeriodStatus,
  hasPostings: Type.Boolean({ description: "True when a posted journal has a posting date within this financial period." }),
  audit: AuditMetadataDto,
});
export type FinancialPeriodResponseDto = Type.Static<typeof FinancialPeriodResponseDto>;
