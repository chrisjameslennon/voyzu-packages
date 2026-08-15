import type { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

export interface TemplateCreateRequestDto {
  /** Stable, globally unique template business code. */
  code: string;
  /** Optional description of the template. */
  description: string | null;
}

export interface TemplatePatchRequestDto {
  /** Optional replacement description; null clears the description. */
  description?: string | null;
}

export interface TemplateUpdateRequestDto {
  /** Complete replacement description; null clears the description. */
  description: string | null;
}

export interface TemplateBatchUpdateRequestDto extends TemplateUpdateRequestDto {
  /** Template business code identifying the template to update. */
  code: string;
}

export interface TemplateBatchPatchRequestDto extends TemplatePatchRequestDto {
  /** Template business code identifying the template to patch. */
  code: string;
}

export interface TemplateResponseDto {
  /** Unique numeric identifier for the template. */
  id: number;
  /** Stable, globally unique template business code. */
  code: string;
  /** Optional description of the template. */
  description: string | null;
  /** Current lifecycle status of the template. */
  status: Status;
  /** Creation and most-recent-update audit metadata. */
  audit: AuditMetadataDto;
}

export interface TemplateReportRowDto {
  /** Stable, globally unique template business code. */
  code: string;
  /** Optional description of the template. */
  description: string | null;
  /** Current lifecycle status of the template. */
  status: Status;
}
