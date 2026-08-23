import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/finance/types/modules/core";
import { NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const DimensionValueStatus = Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]);
export type DimensionValueStatus = Type.Static<typeof DimensionValueStatus>;

export const DimensionValueResponseDto = StrictObject({
  id: PositiveId,
  dimensionId: PositiveId,
  name: NonBlankText,
  status: DimensionValueStatus,
  hasPostings: Type.Boolean({ description: "True when one or more posted journal headers include this dimension value." }),
  companiesWithPostings: Type.Array(Type.String()),
  audit: AuditMetadataDto,
});
export type DimensionValueResponseDto = Type.Static<typeof DimensionValueResponseDto>;
