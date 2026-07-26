import type {
  BankCashAccountCreateRequestDto,
  BankCashAccountBatchPatchRequestDto,
  BankCashAccountBatchUpdateRequestDto,
  BankCashAccountPatchRequestDto,
  BankCashAccountResponseDto,
  BankCashAccountType,
  BankCashAccountUpdateRequestDto,
} from "@voyzu-modules/core/types/modules/bank-cash-accounts";
import type { Filter, ListOptions } from "@voyzu/types/params";
import { BusinessRuleError, ConflictError, DataError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { withAuditActors } from "../../../server/audit-actors";
import { createCreationAuditStamp, createUpdateAuditStamp, withCreationAudit, withUpdateAudit } from "../../../server/audit-stamp";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";
import { BankCashAccountRepo } from "../db/bank-cash-account.repo";
import { AssignGLAccount, ChangeCode, ChangeType, Deactivate, Delete, UpdateGLAccount } from "../../domain/operation-policy";
import { toDto, toInsertRow, toPatchRow, updateToPatch } from "./bank-cash-account.mapper";
import { validateCreate, validatePatch, validateUpdate } from "./bank-cash-account.validator";

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

async function loadGlAccountTarget(repo: BankCashAccountRepo, companyId: number, glAccountId: number) {
  const glAccount = await repo.getGlAccount(companyId, glAccountId);
  if (!glAccount) throw new NotFoundError(`GL account id ${glAccountId} not found`);
  return { id: glAccount.id, status: glAccount.status as "ACTIVE" | "INACTIVE", accountType: glAccount.account_type };
}

function normalizeCodes(codes: string[]): string[] {
  return [...new Set(codes.map((code) => code.trim().toUpperCase()).filter(Boolean))];
}

function throwIfBlocked(blockers: { message: string }[]): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

export async function listBankCashAccounts(companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const rows = await new BankCashAccountRepo(getDb()).listAll(await scopedCompanyId(companyId));
  return Promise.all(rows.map(async (row) => withAuditActors(toDto(row), row)));
}

export async function filterBankCashAccounts(filters: Filter[], options?: ListOptions, companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const rows = await new BankCashAccountRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options);
  return Promise.all(rows.map(async (row) => withAuditActors(toDto(row), row)));
}

export async function searchBankCashAccounts(phrase: string, options?: ListOptions, companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const rows = await new BankCashAccountRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options);
  return Promise.all(rows.map(async (row) => withAuditActors(toDto(row), row)));
}

export async function getBankCashAccount(code: string, companyId?: number): Promise<BankCashAccountResponseDto | null> {
  const row = await new BankCashAccountRepo(getDb()).get(await scopedCompanyId(companyId), code);
  return row ? withAuditActors(toDto(row), row) : null;
}

export async function createBankCashAccount(input: BankCashAccountCreateRequestDto, companyId?: number): Promise<BankCashAccountResponseDto> {
  const errors = validateCreate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new BankCashAccountRepo(client);
      throwIfBlocked(AssignGLAccount(await loadGlAccountTarget(repo, resolvedCompanyId, input.glAccountId)));
      const row = await repo.insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), await createCreationAuditStamp()));
      return withAuditActors(toDto(row), row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) throw new ConflictError("A Bank / Cash Account with this code already exists");
    throw err;
  }
}

export async function patchBankCashAccount(code: string, input: BankCashAccountPatchRequestDto, companyId?: number): Promise<BankCashAccountResponseDto> {
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new BankCashAccountRepo(client);
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new DataError(`Bank / Cash Account ${code} not found`);
      if (input.code !== undefined) {
        throwIfBlocked(ChangeCode({
          code: existing.code,
          glAccountId: existing.gl_account_id,
          hasPostings: existing.has_postings,
          linkedBy: existing.linked_by,
        }, input.code));
      }
      if (input.type !== undefined) {
        throwIfBlocked(ChangeType({
          code: existing.code,
          type: existing.type,
          glAccountId: existing.gl_account_id,
          hasPostings: existing.has_postings,
          linkedBy: existing.linked_by,
        }, input.type));
      }
      if (input.glAccountId != null) {
        const target = await loadGlAccountTarget(repo, resolvedCompanyId, input.glAccountId);
        throwIfBlocked(UpdateGLAccount({
          code: existing.code,
          glAccountId: existing.gl_account_id,
          hasPostings: existing.has_postings,
          linkedBy: existing.linked_by,
        }, target));
      }
      const finalType = input.type ?? existing.type as BankCashAccountType;
      const normalizedInput: BankCashAccountPatchRequestDto = finalType === "BANK"
        ? { ...input, cashAccountIdentifier: null }
        : { ...input, bankName: null, bankBranchName: null, bankAccountIdentifier: null };
      const row = await repo.patch(resolvedCompanyId, code, withUpdateAudit(toPatchRow(normalizedInput), await createUpdateAuditStamp()));
      return withAuditActors(toDto(row), row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) throw new ConflictError("A Bank / Cash Account with this code already exists");
    if (err instanceof DataError) throw new NotFoundError(`Bank / Cash Account ${code} not found`);
    throw err;
  }
}

export async function updateBankCashAccount(code: string, input: BankCashAccountUpdateRequestDto, companyId?: number): Promise<BankCashAccountResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  return patchBankCashAccount(code, updateToPatch(input), companyId);
}

export async function deleteBankCashAccount(code: string, companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    await withTransaction(async (client) => {
      const repo = new BankCashAccountRepo(client);
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new DataError(`Bank / Cash Account ${code} not found`);
      throwIfBlocked(Delete({
        code: existing.code,
        glAccountId: existing.gl_account_id,
        hasPostings: existing.has_postings,
        linkedBy: existing.linked_by,
      }));
      await repo.delete(resolvedCompanyId, code);
    });
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(`Bank / Cash Account ${code} not found`);
    throw err;
  }
}

export async function batchGetBankCashAccounts(codes: string[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const rows = await new BankCashAccountRepo(getDb()).batchGet(await scopedCompanyId(companyId), normalizeCodes(codes));
  return Promise.all(rows.map(async (row) => withAuditActors(toDto(row), row)));
}

export async function batchCreateBankCashAccounts(inputs: BankCashAccountCreateRequestDto[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const result: BankCashAccountResponseDto[] = [];
  for (const input of inputs) result.push(await createBankCashAccount(input, companyId));
  return result;
}

export async function batchUpdateBankCashAccounts(inputs: BankCashAccountBatchUpdateRequestDto[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const result: BankCashAccountResponseDto[] = [];
  for (const input of inputs) result.push(await updateBankCashAccount(input.code, input, companyId));
  return result;
}

export async function batchPatchBankCashAccounts(inputs: BankCashAccountBatchPatchRequestDto[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  const result: BankCashAccountResponseDto[] = [];
  for (const input of inputs) result.push(await patchBankCashAccount(input.code, input, companyId));
  return result;
}

export async function batchDeleteBankCashAccounts(codes: string[], companyId?: number): Promise<void> {
  for (const code of normalizeCodes(codes)) await deleteBankCashAccount(code, companyId);
}

export async function activateBankCashAccount(code: string, companyId?: number): Promise<BankCashAccountResponseDto> {
  return (await activateBankCashAccounts([code], companyId))[0];
}

export async function deactivateBankCashAccount(code: string, companyId?: number): Promise<BankCashAccountResponseDto> {
  return (await deactivateBankCashAccounts([code], companyId))[0];
}

export async function activateBankCashAccounts(codes: string[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  return transitionBankCashAccountStatus(codes, "ACTIVE", companyId);
}

export async function deactivateBankCashAccounts(codes: string[], companyId?: number): Promise<BankCashAccountResponseDto[]> {
  return transitionBankCashAccountStatus(codes, "INACTIVE", companyId);
}

async function transitionBankCashAccountStatus(
  codes: string[],
  status: "ACTIVE" | "INACTIVE",
  companyId?: number,
): Promise<BankCashAccountResponseDto[]> {
  const normalizedCodes = normalizeCodes(codes);
  if (normalizedCodes.length === 0) throw new InputValidationError("At least one Bank / Cash Account code is required");

  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new BankCashAccountRepo(client);
    const results: BankCashAccountResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const code of normalizedCodes) {
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new NotFoundError(`Bank / Cash Account ${code} not found`);
      if (status === "INACTIVE") {
        throwIfBlocked(Deactivate({
          code: existing.code,
          glAccountId: existing.gl_account_id,
          hasPostings: existing.has_postings,
          linkedBy: existing.linked_by,
        }));
      }
      const row = await repo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit));
      results.push(await withAuditActors(toDto(row), row));
    }
    return results;
  });
}

export async function resolveBankCashDetails(
  companyId: number,
  _companyBaseCurrencyCode: string,
  details: BankCashDetailsRequestDto | null | undefined,
): Promise<BankCashJournalDetailsDto | null> {
  void _companyBaseCurrencyCode;
  if (!details) return null;
  if (!details.code || !/^[A-Z0-9_-]{1,40}$/.test(details.code)) throw new InputValidationError("bank_cash_details.code is required");
  const row = await new BankCashAccountRepo(getDb()).getActiveResolved(await resolveEffectiveSettingsCompanyId(companyId), details.code);
  if (!row) throw new BusinessRuleError(`bank_cash_details.code ${details.code} is not active`);
  return {
    id: row.id,
    code: row.code,
    type: row.type as BankCashAccountType,
    gl_account_id: row.gl_account_id,
    gl_account_code: row.gl_account_code ?? "",
    gl_account_name: row.gl_account_name ?? "",
    bank_name: row.bank_name,
    bank_branch_name: row.bank_branch_name,
    bank_account_identifier: row.bank_account_identifier,
    cash_account_identifier: row.cash_account_identifier,
    tx_id: details.tx_id ?? null,
    tx_code: details.tx_code ?? null,
    tx_ref: details.tx_ref ?? null,
    tx_details: details.tx_details ?? null,
    payment_ref: details.payment_ref ?? null,
  };
}

export function toJournalBankCashFields(details: BankCashJournalDetailsDto | null | undefined): Record<string, unknown> {
  if (!details) return {};
  return {
    bank_cash_account_id: details.id,
    bank_cash_code: details.code,
    bank_cash_type: details.type,
    bank_cash_gl_account_id: details.gl_account_id,
    bank_cash_gl_account_code: details.gl_account_code,
    bank_cash_gl_account_name: details.gl_account_name,
    bank_cash_bank_name: details.bank_name,
    bank_cash_bank_branch_name: details.bank_branch_name,
    bank_cash_account_identifier: details.bank_account_identifier,
    bank_cash_cash_account_identifier: details.cash_account_identifier,
    bank_cash_tx_id: details.tx_id,
    bank_cash_tx_code: details.tx_code,
    bank_cash_tx_ref: details.tx_ref,
    bank_cash_tx_details: details.tx_details,
    bank_cash_payment_ref: details.payment_ref,
  };
}

export interface BankCashDetailsRequestDto {
  code?: string | null;
  tx_id?: string | null;
  tx_code?: string | null;
  tx_ref?: string | null;
  tx_details?: string | null;
  payment_ref?: string | null;
}

export interface BankCashJournalDetailsDto {
  id: number;
  code: string;
  type: BankCashAccountType;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  bank_name?: string | null;
  bank_branch_name?: string | null;
  bank_account_identifier?: string | null;
  cash_account_identifier?: string | null;
  tx_id?: string | null;
  tx_code?: string | null;
  tx_ref?: string | null;
  tx_details?: string | null;
  payment_ref?: string | null;
}

