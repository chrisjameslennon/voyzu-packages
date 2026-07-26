import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";
import type { FinancialDocumentDefaultCreateRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultPatchRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultResponseDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import type { FinancialDocumentDefaultUpdateRequestDto } from "@voyzu-modules/types/modules/financial-document-defaults";
import { runtime } from "@voyzu/capability/runtime";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError, DataError } from "@voyzu/capability/errors";
import { AssignTarget } from "@voyzu-modules/all-modules/common/financial-document-defaults/domain/operation-policy";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { createUpdateAuditStamp, withAuditActors, withUpdateAudit } from "../../../server";

import { FinancialDocumentDefaultRepo, type FinancialDocumentDefaultKey } from "../db/financial-document-default.repo";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";

import { toDto, toUpdateRow, toPatchRow } from "./financial-document-default.mapper";
import { validateUpdate, validatePatch, validateResponse } from "./financial-document-default.validator";

export type FinancialDocumentDefaultRouteKey = FinancialDocumentDefaultKey;

function checkedResponse(dto: FinancialDocumentDefaultResponseDto): FinancialDocumentDefaultResponseDto {
  const errors = validateResponse(dto);
  if (errors.length) {
    const message = `Invalid posting code response (${dto.documentCode}/${dto.code}): ${errors.join("; ")}`;
    if (runtime.isDevLike) {
      throw new Error(message);
    }
    console.error(message);
  }
  return dto;
}

async function enrichRow(row: Parameters<typeof toDto>[0]): Promise<FinancialDocumentDefaultResponseDto> {
  return checkedResponse(await withAuditActors(toDto(row), row));
}

function enrichRows(rows: Array<Parameters<typeof toDto>[0]>): Promise<FinancialDocumentDefaultResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

async function assertGlAccountTarget(repo: FinancialDocumentDefaultRepo, companyId: number, glAccountId: number, current: { code: string; allowed_account_types: string[] }): Promise<void> {
  const target = await repo.getGlAccount(companyId, glAccountId);
  if (!target) throw new NotFoundError(`GL account id ${glAccountId} not found`);
  const blockers = AssignTarget(
    { code: current.code, targetType: "GENERAL_LEDGER", allowedAccountTypes: current.allowed_account_types as FinancialDocumentDefaultResponseDto["allowedAccountTypes"] },
    { kind: "GENERAL_LEDGER", id: target.id, status: target.status, accountType: target.accountType },
  );
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

function assertGeneralLedgerDefault(existing: { target_type: string; allowed_account_types: string[] }): string[] {
  if (existing.target_type !== "GENERAL_LEDGER") {
    throw new BusinessRuleError("Bank / Cash financial document defaults require bankCashControlAccountId, not glAccountId");
  }
  return existing.allowed_account_types;
}

function assertBankCashDefault(existing: { target_type: string }): void {
  if (existing.target_type !== "BANK_CASH_ACCOUNT") {
    throw new BusinessRuleError("General Ledger financial document defaults require glAccountId, not bankCashControlAccountId");
  }
}

function assertOnlyFinancialDocumentDefaultTargetUpdate(input: object): void {
  const allowed = new Set(["glAccountId", "bankCashControlAccountId"]);
  const invalid = Object.keys(input).filter((key) => !allowed.has(key));
  if (invalid.length) {
    throw new BusinessRuleError("Posting codes are read-only; only their posting target can be changed");
  }
  if ("glAccountId" in input && "bankCashControlAccountId" in input) {
    throw new InputValidationError("Update either glAccountId or bankCashControlAccountId, not both");
  }
}

async function assertBankCashControlAccountTarget(repo: FinancialDocumentDefaultRepo, companyId: number, bankCashControlAccountId: number, code: string): Promise<void> {
  const target = await repo.getBankCashControlAccount(companyId, bankCashControlAccountId);
  if (!target) throw new NotFoundError(`Bank / Cash control account id ${bankCashControlAccountId} not found`);
  const blockers = AssignTarget(
    { code, targetType: "BANK_CASH_ACCOUNT", allowedAccountTypes: [] },
    { kind: "BANK_CASH_ACCOUNT", id: target.id, status: target.status },
  );
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

function parseKey(value: unknown): FinancialDocumentDefaultKey | null {
  if (!value || typeof value !== "object") return null;
  const key = value as { documentCode?: unknown; code?: unknown };
  if (typeof key.documentCode !== "string" || typeof key.code !== "string") return null;
  return { documentCode: key.documentCode, code: key.code };
}

function assertKeysPresent(keys: FinancialDocumentDefaultKey[]): void {
  if (keys.length === 0) throw new InputValidationError("At least one posting code key is required");
}

export function encodeFinancialDocumentDefaultKey(documentCode: string, code: string): string {
  return `${encodeURIComponent(documentCode)}~${encodeURIComponent(code)}`;
}

export function decodeFinancialDocumentDefaultKey(value: string): FinancialDocumentDefaultKey | null {
  const [documentCode, code, ...rest] = value.split("~");
  if (!documentCode || !code || rest.length) return null;
  return { documentCode: decodeURIComponent(documentCode), code: decodeURIComponent(code) };
}

export async function createFinancialDocumentDefault(input: FinancialDocumentDefaultCreateRequestDto): Promise<FinancialDocumentDefaultResponseDto> {
  void input;
  throw new BusinessRuleError("Posting codes are read-only; only the assigned GL account can be changed");
}

export async function getFinancialDocumentDefault(documentCode: string, code: string, companyId?: number): Promise<FinancialDocumentDefaultResponseDto | null> {
  const row = await new FinancialDocumentDefaultRepo(getDb()).get(await scopedCompanyId(companyId), documentCode, code);
  if (!row) return null;
  return enrichRow(row);
}

export async function updateFinancialDocumentDefault(documentCode: string, code: string, input: FinancialDocumentDefaultUpdateRequestDto, companyId?: number): Promise<FinancialDocumentDefaultResponseDto> {
  assertOnlyFinancialDocumentDefaultTargetUpdate(input);
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));

  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new FinancialDocumentDefaultRepo(client);
      const existing = await repo.get(resolvedCompanyId, documentCode, code);
      if (!existing) throw new NotFoundError(`Posting code ${documentCode}/${code} not found`);
      if (existing.target_type === "BANK_CASH_ACCOUNT") {
        if (input.glAccountId !== undefined) {
          throw new BusinessRuleError("Bank / Cash financial document defaults require bankCashControlAccountId, not glAccountId");
        }
        if (input.bankCashControlAccountId === undefined) {
          throw new InputValidationError("bankCashControlAccountId is required");
        }
        await assertBankCashControlAccountTarget(repo, resolvedCompanyId, input.bankCashControlAccountId, existing.code);
      } else {
        if (input.bankCashControlAccountId !== undefined) {
          throw new BusinessRuleError("General Ledger financial document defaults require glAccountId, not bankCashControlAccountId");
        }
        if (input.glAccountId === undefined) {
          throw new InputValidationError("glAccountId is required");
        }
        assertGeneralLedgerDefault(existing);
        await assertGlAccountTarget(repo, resolvedCompanyId, input.glAccountId, existing);
      }
      const row = await repo.update(resolvedCompanyId, documentCode, code, withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp()));
      return enrichRow(row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A posting code with this document code and code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`Posting code ${documentCode}/${code} not found`);
    }
    throw err;
  }
}

export async function patchFinancialDocumentDefault(documentCode: string, code: string, input: FinancialDocumentDefaultPatchRequestDto, companyId?: number): Promise<FinancialDocumentDefaultResponseDto> {
  assertOnlyFinancialDocumentDefaultTargetUpdate(input);
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));

  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new FinancialDocumentDefaultRepo(client);
      const existing = await repo.get(resolvedCompanyId, documentCode, code);
      if (!existing) throw new NotFoundError(`Posting code ${documentCode}/${code} not found`);
      if (existing.target_type === "BANK_CASH_ACCOUNT") {
        if (input.glAccountId !== undefined) {
          throw new BusinessRuleError("Bank / Cash financial document defaults require bankCashControlAccountId, not glAccountId");
        }
        assertBankCashDefault(existing);
        const bankCashControlAccountId = input.bankCashControlAccountId ?? existing.bank_cash_control_account_id;
        if (!bankCashControlAccountId) throw new InputValidationError("Bank / Cash control account is required");
        await assertBankCashControlAccountTarget(repo, resolvedCompanyId, bankCashControlAccountId, existing.code);
      } else {
        if (input.bankCashControlAccountId !== undefined) {
          throw new BusinessRuleError("General Ledger financial document defaults require glAccountId, not bankCashControlAccountId");
        }
        assertGeneralLedgerDefault(existing);
        const glAccountId = input.glAccountId ?? existing.gl_account_id;
        if (!glAccountId) throw new InputValidationError("GL account is required");
        await assertGlAccountTarget(repo, resolvedCompanyId, glAccountId, existing);
      }
      const row = await repo.patch(resolvedCompanyId, documentCode, code, withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp()));
      return enrichRow(row);
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A posting code with this document code and code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`Posting code ${documentCode}/${code} not found`);
    }
    throw err;
  }
}

export async function deleteFinancialDocumentDefault(documentCode: string, code: string): Promise<void> {
  void documentCode;
  void code;
  throw new BusinessRuleError("Posting codes are read-only; only the assigned GL account can be changed");
}

export async function listFinancialDocumentDefaults(companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  const rows = await new FinancialDocumentDefaultRepo(getDb()).listAll(await scopedCompanyId(companyId));
  return enrichRows(rows);
}

export function listFinancialDocumentDefaultSlots(): string[] {
  return [];
}

export async function filterFinancialDocumentDefaults(filters: Filter[], options?: ListOptions, companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  const rows = await new FinancialDocumentDefaultRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options);
  return enrichRows(rows);
}

export async function searchFinancialDocumentDefaults(phrase: string, options?: ListOptions, companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  const rows = await new FinancialDocumentDefaultRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options);
  return enrichRows(rows);
}

export async function batchCreateFinancialDocumentDefaults(inputs: FinancialDocumentDefaultCreateRequestDto[]): Promise<FinancialDocumentDefaultResponseDto[]> {
  void inputs;
  throw new BusinessRuleError("Posting codes are read-only; only the assigned GL account can be changed");
}

export async function batchGetFinancialDocumentDefaults(keys: FinancialDocumentDefaultKey[], companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  const rows = await new FinancialDocumentDefaultRepo(getDb()).batchGet(await scopedCompanyId(companyId), keys);
  return enrichRows(rows);
}

export async function batchUpdateFinancialDocumentDefaults(inputs: Array<FinancialDocumentDefaultUpdateRequestDto & FinancialDocumentDefaultKey>): Promise<FinancialDocumentDefaultResponseDto[]> {
  void inputs;
  throw new BusinessRuleError("Batch financial-document-default updates are not supported; update the assigned GL account one posting code at a time");
}

export async function batchPatchFinancialDocumentDefaults(inputs: Array<FinancialDocumentDefaultPatchRequestDto & FinancialDocumentDefaultKey>): Promise<FinancialDocumentDefaultResponseDto[]> {
  void inputs;
  throw new BusinessRuleError("Batch financial-document-default updates are not supported; update the assigned GL account one posting code at a time");
}

export async function batchDeleteFinancialDocumentDefaults(keys: FinancialDocumentDefaultKey[]): Promise<void> {
  void keys;
  throw new BusinessRuleError("Posting codes are read-only; only the assigned GL account can be changed");
}

export async function activateFinancialDocumentDefault(documentCode: string, code: string, companyId?: number): Promise<FinancialDocumentDefaultResponseDto> {
  const [row] = await activateFinancialDocumentDefaults([{ documentCode, code }], companyId);
  return row;
}

export async function deactivateFinancialDocumentDefault(documentCode: string, code: string, companyId?: number): Promise<FinancialDocumentDefaultResponseDto> {
  const [row] = await deactivateFinancialDocumentDefaults([{ documentCode, code }], companyId);
  return row;
}

export async function activateFinancialDocumentDefaults(keys: FinancialDocumentDefaultKey[], companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  return transitionFinancialDocumentDefaultStatus(keys, "ACTIVE", companyId);
}

export async function deactivateFinancialDocumentDefaults(keys: FinancialDocumentDefaultKey[], companyId?: number): Promise<FinancialDocumentDefaultResponseDto[]> {
  return transitionFinancialDocumentDefaultStatus(keys, "INACTIVE", companyId);
}

async function transitionFinancialDocumentDefaultStatus(
  keys: FinancialDocumentDefaultKey[],
  status: "ACTIVE" | "INACTIVE",
  companyId?: number,
): Promise<FinancialDocumentDefaultResponseDto[]> {
  assertKeysPresent(keys);
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new FinancialDocumentDefaultRepo(client);
    const results: FinancialDocumentDefaultResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const key of keys) {
      const existing = await repo.get(resolvedCompanyId, key.documentCode, key.code);
      if (!existing) throw new NotFoundError(`Posting code ${key.documentCode}/${key.code} not found`);
      const row = await repo.patch(resolvedCompanyId, key.documentCode, key.code, withUpdateAudit({ status }, audit));
      results.push(await enrichRow(row));
    }
    return results;
  });
}
export function normalizeFinancialDocumentDefaultKeys(keys: unknown): FinancialDocumentDefaultKey[] {
  if (!Array.isArray(keys)) return [];
  return keys.map(parseKey).filter((key): key is FinancialDocumentDefaultKey => key != null);
}

