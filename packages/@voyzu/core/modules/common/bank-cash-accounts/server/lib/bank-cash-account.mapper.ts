import type { Status } from "@voyzu/core/types/modules/core";
import type {
  BankCashAccountCreateRequestDto,
  BankCashAccountPatchRequestDto,
  BankCashAccountResponseDto,
  BankCashAccountType,
  BankCashAccountUpdateRequestDto,
} from "@voyzu/core/types/modules/bank-cash-accounts";
import type { BankCashAccountRow, InsertBankCashAccountRow, PatchBankCashAccountRow } from "../db/bank-cash-account.row.types";

export function toDto(row: BankCashAccountRow): BankCashAccountResponseDto {
  return {
    id: row.id,
    code: row.code,
    ledger: row.ledger,
    type: row.type as BankCashAccountType,
    glAccountId: row.gl_account_id,
    glAccount: row.gl_account_code && row.gl_account_type ? {
      code: row.gl_account_code,
      name: row.gl_account_name ?? "",
      accountType: row.gl_account_type,
    } : null,
    bankName: row.bank_name,
    bankBranchName: row.bank_branch_name,
    bankAccountIdentifier: row.bank_account_identifier,
    cashAccountIdentifier: row.cash_account_identifier,
    status: row.status as Status,
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
    linkedBy: row.linked_by,
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

export function toInsertRow(input: BankCashAccountCreateRequestDto, companyId: number): InsertBankCashAccountRow {
  return {
    company_id: companyId,
    code: input.code,
    type: input.type,
    gl_account_id: input.glAccountId,
    bank_name: input.type === "BANK" ? input.bankName ?? null : null,
    bank_branch_name: input.type === "BANK" ? input.bankBranchName ?? null : null,
    bank_account_identifier: input.type === "BANK" ? input.bankAccountIdentifier ?? null : null,
    cash_account_identifier: input.type === "BANK" ? null : input.cashAccountIdentifier ?? null,
  };
}

export function toPatchRow(input: BankCashAccountPatchRequestDto): PatchBankCashAccountRow {
  return {
    code: input.code,
    type: input.type,
    gl_account_id: input.glAccountId,
    bank_name: input.bankName,
    bank_branch_name: input.bankBranchName,
    bank_account_identifier: input.bankAccountIdentifier,
    cash_account_identifier: input.cashAccountIdentifier,
  };
}

export function updateToPatch(input: BankCashAccountUpdateRequestDto): BankCashAccountPatchRequestDto {
  return {
    code: input.code,
    type: input.type,
    glAccountId: input.glAccountId,
    bankName: input.bankName,
    bankBranchName: input.bankBranchName,
    bankAccountIdentifier: input.bankAccountIdentifier,
    cashAccountIdentifier: input.cashAccountIdentifier,
  };
}
