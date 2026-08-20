import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { DimensionValueResponseDto } from "./dimension-value.response.dto";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const DimensionStatus = Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]);
export type DimensionStatus = Type.Static<typeof DimensionStatus>;

export const DimensionResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  status: DimensionStatus,
  values: Type.Optional(Type.Array(DimensionValueResponseDto)),
  hasPostings: Type.Boolean({ description: "True when one or more posted journal headers include a line dimension for this dimension." }),
  companiesWithPostings: Type.Array(Type.String()),
  audit: AuditMetadataDto,
});
export type DimensionResponseDto = Type.Static<typeof DimensionResponseDto>;
