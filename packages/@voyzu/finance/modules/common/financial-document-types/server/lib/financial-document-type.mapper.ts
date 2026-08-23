import type { Ledger, Status } from "@voyzu/finance/types/modules/core";
import type { FinancialDocumentTypeCreateRequestDto } from "@voyzu/finance/types/modules/financial-document-types";
import type { FinancialDocumentTypePatchRequestDto } from "@voyzu/finance/types/modules/financial-document-types";
import type { FinancialDocumentTypeResponseDto } from "@voyzu/finance/types/modules/financial-document-types";
import type { FinancialDocumentTypeUpdateRequestDto } from "@voyzu/finance/types/modules/financial-document-types";

import type {
  FinancialDocumentTypeRow,
  InsertFinancialDocumentTypeRow,
  UpdateFinancialDocumentTypeRow,
  PatchFinancialDocumentTypeRow,
} from "../db/financial-document-type.row.types";

export function toDto(row: FinancialDocumentTypeRow): FinancialDocumentTypeResponseDto {
  return {
    code: row.code,
    name: row.name,
    description: row.description,
    documentPurpose: row.document_purpose,
    primarySupportingLedger: row.primary_supporting_ledger as Ledger,
    supportsDimensions: row.supports_dimensions,
    cashMovement: row.cash_movement,
    supportsItems: row.supports_items,
    status: row.status as Status,
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

export function toInsertRow(input: FinancialDocumentTypeCreateRequestDto): InsertFinancialDocumentTypeRow {
  return {
    code: input.code,
    name: input.name,
    description: input.description,
    document_purpose: input.documentPurpose,
    primary_supporting_ledger: input.primarySupportingLedger,
    supports_dimensions: false,
    cash_movement: false,
    supports_items: false,
  };
}

export function toUpdateRow(input: FinancialDocumentTypeUpdateRequestDto): UpdateFinancialDocumentTypeRow {
  return {
    code: input.code,
    name: input.name,
    description: input.description,
    document_purpose: input.documentPurpose,
    primary_supporting_ledger: input.primarySupportingLedger,
    status: input.status,
  };
}

export function toPatchRow(input: FinancialDocumentTypePatchRequestDto): PatchFinancialDocumentTypeRow {
  const row: PatchFinancialDocumentTypeRow = {};
  if (input.code !== undefined) row.code = input.code;
  if (input.name !== undefined) row.name = input.name;
  if (input.description !== undefined) row.description = input.description;
  if (input.documentPurpose !== undefined) row.document_purpose = input.documentPurpose;
  if (input.primarySupportingLedger !== undefined) {
    row.primary_supporting_ledger = input.primarySupportingLedger;
  }
  if (input.status !== undefined) row.status = input.status;
  return row;
}
