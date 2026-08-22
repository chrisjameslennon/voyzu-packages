import type { AccountType, Status } from "@voyzu/core/types/modules/core";
import type { FinancialDocumentDefaultCreateRequestDto } from "@voyzu/core/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultPatchRequestDto } from "@voyzu/core/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultResponseDto } from "@voyzu/core/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultUpdateRequestDto } from "@voyzu/core/types/modules/financial-document-defaults";

import type {
  FinancialDocumentDefaultRow,
  InsertFinancialDocumentDefaultRow,
  UpdateFinancialDocumentDefaultRow,
  PatchFinancialDocumentDefaultRow,
} from "../db/financial-document-default.row.types";

export function toDto(row: FinancialDocumentDefaultRow): FinancialDocumentDefaultResponseDto {
  const isBankLinked = row.bank_cash_control_account_id != null;
  const glAccountId = isBankLinked ? row.bank_cash_gl_account_id : row.gl_account_id;
  const accountTypeCode = isBankLinked ? row.bank_cash_gl_account_type : row.gl_account_type;
  const glAccountCode = isBankLinked ? row.bank_cash_gl_account_code : row.gl_account_code;
  const glAccountName = isBankLinked ? row.bank_cash_gl_account_name : row.gl_account_name;
  return {
    documentCode: row.document_code,
    code: row.code,
    name: row.name,
    targetType: row.target_type,
    allowedAccountTypes: row.allowed_account_types as AccountType[],
    overridePropertyName: row.override_property_name,
    overrideScope: row.override_scope,
    glAccountId: glAccountId ?? null,
    accountTypeCode: (accountTypeCode ?? row.allowed_account_types[0] ?? "") as AccountType,
    glAccount: glAccountCode != null ? {
      code: glAccountCode,
      name: glAccountName ?? "",
      accountType: (accountTypeCode ?? "") as AccountType,
    } : null,
    isBankLinked,
    bankCashControlAccountId: row.bank_cash_control_account_id,
    bankCashControlAccount: isBankLinked && row.bank_cash_code != null && row.bank_cash_gl_account_id != null ? {
      code: row.bank_cash_code,
      type: row.bank_cash_type ?? "",
      glAccountId: row.bank_cash_gl_account_id,
      glAccountCode: row.bank_cash_gl_account_code ?? "",
      glAccountName: row.bank_cash_gl_account_name ?? "",
    } : null,
    status: row.status as Status,
    linkedBy: [],
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

export function toInsertRow(input: FinancialDocumentDefaultCreateRequestDto, companyId: number): InsertFinancialDocumentDefaultRow {
  return {
    finance_company_id: companyId,
    document_code: input.documentCode,
    code: input.code,
    name: input.name,
    target_type: input.targetType,
    allowed_account_types: input.allowedAccountTypes,
    override_property_name: input.overridePropertyName,
    override_scope: input.overrideScope,
    gl_account_id: input.glAccountId,
    bank_cash_control_account_id: input.bankCashControlAccountId,
    status: "ACTIVE",
  };
}

export function toUpdateRow(input: FinancialDocumentDefaultUpdateRequestDto): UpdateFinancialDocumentDefaultRow {
  return {
    gl_account_id: input.glAccountId,
    bank_cash_control_account_id: input.bankCashControlAccountId,
  };
}

export function toPatchRow(input: FinancialDocumentDefaultPatchRequestDto): PatchFinancialDocumentDefaultRow {
  const row: PatchFinancialDocumentDefaultRow = {};
  if (input.glAccountId !== undefined) row.gl_account_id = input.glAccountId;
  if (input.bankCashControlAccountId !== undefined) row.bank_cash_control_account_id = input.bankCashControlAccountId;
  return row;
}
