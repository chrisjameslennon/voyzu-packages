import type { DimensionCreateRequestDto } from "@voyzu/finance/types/modules/dimensions";
import type { DimensionUpdateRequestDto } from "@voyzu/finance/types/modules/dimensions";
import type { DimensionPatchRequestDto } from "@voyzu/finance/types/modules/dimensions";
import type { DimensionResponseDto } from "@voyzu/finance/types/modules/dimensions";
import type { DimensionValueResponseDto } from "@voyzu/finance/types/modules/dimensions";

import type { DimensionRow, InsertDimensionRow, UpdateDimensionRow, PatchDimensionRow } from "../db/dimension.row.types";

export function toDto(row: DimensionRow, values?: DimensionValueResponseDto[]): DimensionResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    status: row.status as DimensionResponseDto["status"],
    ...(values !== undefined && { values }),
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
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

export function toInsertRow(input: DimensionCreateRequestDto, companyId: number): InsertDimensionRow {
  return {
    finance_company_id: companyId,
    code: input.code,
    name: input.name,
  };
}

export function toUpdateRow(input: DimensionUpdateRequestDto): UpdateDimensionRow {
  return {
    name: input.name,
  };
}

export function toPatchRow(input: DimensionPatchRequestDto): PatchDimensionRow {
  const row: PatchDimensionRow = {};
  if (input.code !== undefined) row.code = input.code;
  if (input.name !== undefined) row.name = input.name;
  return row;
}
