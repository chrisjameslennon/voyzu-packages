import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

const IceCreamCode = Type.String({
  pattern: "^[A-Z0-9][A-Z0-9_-]*$",
  description: "An uppercase business code containing letters, numbers, underscores or hyphens.",
});
const NonBlankText = Type.String({ pattern: "\\S" });
const PositiveId = Type.Integer({ minimum: 1 });

export const IceCreamFlavorResponseDto = StrictObject({
  id: PositiveId,
  code: IceCreamCode,
  name: NonBlankText,
  status: Status,
});
export type IceCreamFlavorResponseDto = Type.Static<typeof IceCreamFlavorResponseDto>;

export const IceCreamCreateRequestDto = StrictObject({
  code: IceCreamCode,
  name: NonBlankText,
  flavorCode: IceCreamCode,
  supplier: NonBlankText,
});
export type IceCreamCreateRequestDto = Type.Static<typeof IceCreamCreateRequestDto>;

export const IceCreamUpdateRequestDto = StrictObject({
  name: NonBlankText,
  flavorCode: IceCreamCode,
  supplier: NonBlankText,
});
export type IceCreamUpdateRequestDto = Type.Static<typeof IceCreamUpdateRequestDto>;

export const IceCreamPatchRequestDto = Type.Partial(IceCreamUpdateRequestDto, {
  additionalProperties: false,
});
export type IceCreamPatchRequestDto = Type.Static<typeof IceCreamPatchRequestDto>;

export const IceCreamBatchUpdateRequestDto = StrictObject({
  ...IceCreamUpdateRequestDto.properties,
  code: IceCreamCode,
});
export type IceCreamBatchUpdateRequestDto = Type.Static<typeof IceCreamBatchUpdateRequestDto>;

export const IceCreamBatchPatchRequestDto = StrictObject({
  ...IceCreamPatchRequestDto.properties,
  code: IceCreamCode,
});
export type IceCreamBatchPatchRequestDto = Type.Static<typeof IceCreamBatchPatchRequestDto>;

export const IceCreamResponseDto = StrictObject({
  id: PositiveId,
  code: IceCreamCode,
  name: NonBlankText,
  flavor: IceCreamFlavorResponseDto,
  supplier: NonBlankText,
  status: Status,
  audit: AuditMetadataDto,
});
export type IceCreamResponseDto = Type.Static<typeof IceCreamResponseDto>;

export const IceCreamReportRowDto = StrictObject({
  code: IceCreamCode,
  name: NonBlankText,
  flavorCode: IceCreamCode,
  flavorName: NonBlankText,
  supplier: NonBlankText,
  status: Status,
});
export type IceCreamReportRowDto = Type.Static<typeof IceCreamReportRowDto>;
