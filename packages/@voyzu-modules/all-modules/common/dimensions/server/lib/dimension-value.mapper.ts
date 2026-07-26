import type { DimensionValueCreateRequestDto } from "@voyzu-modules/types/modules/dimensions";
import type { DimensionValueResponseDto, DimensionValueStatus } from "@voyzu-modules/types/modules/dimensions";

import type { DimensionValueRow, InsertDimensionValueRow } from "../db/dimension-value.row.types";

export function toValueDto(row: DimensionValueRow): DimensionValueResponseDto {
  return {
    id: row.id,
    dimensionId: row.dimension_id,
    name: row.name,
    status: row.status as DimensionValueStatus,
    hasPostings: row.has_postings,
    companiesWithPostings: row.companies_with_postings,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
      },
    },
  };
}

export function toInsertValueRow(companyId: number, dimensionId: number, input: DimensionValueCreateRequestDto): InsertDimensionValueRow {
  return {
    company_id: companyId,
    dimension_id: dimensionId,
    name: input.name,
    ...(input.status !== undefined && { status: input.status }),
  };
}
