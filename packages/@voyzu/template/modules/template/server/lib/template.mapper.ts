import type { TemplateCreateRequestDto, TemplatePatchRequestDto, TemplateResponseDto, TemplateUpdateRequestDto } from "../../../types";
import type { InsertTemplateRow, PatchTemplateRow, TemplateRow, UpdateTemplateRow } from "../db/template.row.types";

const normalizeDescription = (value: string | null): string | null => value?.trim() || null;

export function toInsertRow(input: TemplateCreateRequestDto): InsertTemplateRow {
  return {
    code: input.code.trim().toUpperCase(),
    description: normalizeDescription(input.description),
  };
}

export function toPatchRow(input: TemplatePatchRequestDto): PatchTemplateRow {
  return {
    ...(input.description !== undefined && { description: normalizeDescription(input.description) }),
  };
}

export function toUpdateRow(input: TemplateUpdateRequestDto): UpdateTemplateRow {
  return { description: normalizeDescription(input.description) };
}

export function toDto(row: TemplateRow): TemplateResponseDto {
  return {
    id: row.id,
    code: row.code,
    description: row.description,
    status: row.status,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}
