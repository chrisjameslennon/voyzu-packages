import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

const TemplateCode = Type.String({
  maxLength: 40,
  pattern: "^[A-Z0-9][A-Z0-9_-]*$",
  description: "An uppercase business code containing letters, numbers, underscores or hyphens.",
});
const TemplateDescription = Type.Union([
  Type.String({ maxLength: 200 }),
  Type.Null(),
]);
const PositiveId = Type.Integer({ minimum: 1 });

export const TemplateCreateRequestDto = StrictObject({
  code: TemplateCode,
  description: TemplateDescription,
});
export type TemplateCreateRequestDto = Type.Static<typeof TemplateCreateRequestDto>;

export const TemplateUpdateRequestDto = StrictObject({
  description: TemplateDescription,
});
export type TemplateUpdateRequestDto = Type.Static<typeof TemplateUpdateRequestDto>;

export const TemplatePatchRequestDto = Type.Partial(TemplateUpdateRequestDto, {
  additionalProperties: false,
});
export type TemplatePatchRequestDto = Type.Static<typeof TemplatePatchRequestDto>;

export const TemplateBatchUpdateRequestDto = StrictObject({
  ...TemplateUpdateRequestDto.properties,
  code: TemplateCode,
});
export type TemplateBatchUpdateRequestDto = Type.Static<typeof TemplateBatchUpdateRequestDto>;

export const TemplateBatchPatchRequestDto = StrictObject({
  ...TemplatePatchRequestDto.properties,
  code: TemplateCode,
});
export type TemplateBatchPatchRequestDto = Type.Static<typeof TemplateBatchPatchRequestDto>;

export const TemplateResponseDto = StrictObject({
  id: PositiveId,
  code: TemplateCode,
  description: TemplateDescription,
  status: Status,
  audit: AuditMetadataDto,
});
export type TemplateResponseDto = Type.Static<typeof TemplateResponseDto>;

export const TemplateReportRowDto = StrictObject({
  code: TemplateCode,
  description: TemplateDescription,
  status: Status,
});
export type TemplateReportRowDto = Type.Static<typeof TemplateReportRowDto>;
