import type {
  IceCreamCreateRequestDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
  IceCreamUpdateRequestDto,
} from "@voyzu/ice-creams/types";
import type {
  IceCreamRow,
  InsertIceCreamRow,
  PatchIceCreamRow,
  UpdateIceCreamRow,
} from "../db/ice-cream.row.types";

export function toInsertRow(
  input: IceCreamCreateRequestDto,
  flavorId: number,
): InsertIceCreamRow {
  return {
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    flavor_id: flavorId,
    supplier: input.supplier.trim(),
  };
}

export function toUpdateRow(
  input: IceCreamUpdateRequestDto,
  flavorId: number,
): UpdateIceCreamRow {
  return {
    name: input.name.trim(),
    flavor_id: flavorId,
    supplier: input.supplier.trim(),
  };
}

export function toPatchRow(
  input: IceCreamPatchRequestDto,
  flavorId?: number,
): PatchIceCreamRow {
  return {
    ...(input.name !== undefined && { name: input.name.trim() }),
    ...(flavorId !== undefined && { flavor_id: flavorId }),
    ...(input.supplier !== undefined && { supplier: input.supplier.trim() }),
  };
}

export function toDto(row: IceCreamRow): IceCreamResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    flavor: {
      id: row.flavor_id,
      code: row.flavor_code,
      name: row.flavor_name,
      status: row.flavor_status,
    },
    supplier: row.supplier,
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
