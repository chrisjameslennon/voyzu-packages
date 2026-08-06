import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";
import type { GlAccountCreateRequestDto } from "@voyzu/core/types/modules/gl-accounts";
import type { GlAccountUpdateRequestDto } from "@voyzu/core/types/modules/gl-accounts";
import type { GlAccountPatchRequestDto } from "@voyzu/core/types/modules/gl-accounts";
import type { GlAccountBatchPatchRequestDto, GlAccountBatchUpdateRequestDto } from "@voyzu/core/types/modules/gl-accounts";
import type { GlAccountResponseDto } from "@voyzu/core/types/modules/gl-accounts";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError , DataError } from "@voyzu/capability/errors";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { UserRepo } from "@voyzu/auth/users/server";
import { createCreationAuditStamp, createUpdateAuditStamp, withCreationAudit, withUpdateAudit } from "../../../server";

import { GlAccountRepo } from "../db/gl-account.repo";
import type { GlAccountRow } from "../db/gl-account.row.types";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";
import { ChangeCode, Deactivate, Delete } from "../../domain/operation-policy";

import { toDto, toInsertRow, toUpdateRow, toPatchRow } from "./gl-account.mapper";
import { validateCreate, validateUpdate, validatePatch, validateResponse } from "./gl-account.validator";
import { checkResponse } from "@voyzu/capability/validation";

function checkedResponse(dto: GlAccountResponseDto): GlAccountResponseDto {
  return checkResponse(dto, validateResponse(dto), `GL account (id=${dto.id})`);
}

async function getAuditActor(
  repo: UserRepo,
  userId: string | null,
): Promise<GlAccountResponseDto["audit"]["created"]["user"]> {
  if (!userId) return null;
  const parsed = Number(userId);
  if (!Number.isInteger(parsed)) return null;
  const row = await repo.getById(parsed);
  return row
    ? {
        id: row.id,
        code: row.code,
        displayName: row.display_name,
      }
    : null;
}

async function enrichRow(row: GlAccountRow): Promise<GlAccountResponseDto> {
  const userRepo = new UserRepo(getDb());
  const [creationUser, updatedUser] = await Promise.all([
    getAuditActor(userRepo, row.creation_user_id),
    getAuditActor(userRepo, row.updated_user_id),
  ]);
  const dto = toDto(row);
  return checkedResponse({
    ...dto,
    audit: {
      created: {
        ...dto.audit.created,
        user: creationUser,
      },
      updated: {
        ...dto.audit.updated,
        user: updatedUser,
      },
    },
  });
}

async function enrichRows(rows: GlAccountRow[]): Promise<GlAccountResponseDto[]> {
  return Promise.all(rows.map((r) => enrichRow(r)));
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

function normalizeCodes(codes: string[]): string[] {
  return [...new Set(codes.map((code) => code.trim().toUpperCase()).filter(Boolean))];
}

async function assertDeleteAllowed(repo: GlAccountRepo, companyId: number, code: string): Promise<void> {
  const existing = await repo.get(companyId, code);
  if (!existing) throw new DataError(`GL account ${code} not found`);
  const blockers = Delete({ code: existing.code, hasPostings: existing.has_postings, linkedBy: existing.linked_by });
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}


export async function createGlAccount(input: GlAccountCreateRequestDto, companyId?: number): Promise<GlAccountResponseDto> {
  const errors = validateCreate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const row = await new GlAccountRepo(getDb()).insert(withCreationAudit(
      toInsertRow(input, await scopedCompanyId(companyId)),
      await createCreationAuditStamp(),
    ));
    return await enrichRow(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account with this code already exists");
    }
    throw err;
  }
}

export async function getGlAccount(code: string, companyId?: number): Promise<GlAccountResponseDto | null> {
  const row = await new GlAccountRepo(getDb()).get(await scopedCompanyId(companyId), code);
  if (!row) return null;
  return await enrichRow(row);
}

export async function updateGlAccount(code: string, input: GlAccountUpdateRequestDto, companyId?: number): Promise<GlAccountResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const repo = new GlAccountRepo(getDb());
    const existing = await repo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`GL account ${code} not found`);
    const blockers = ChangeCode({ code: existing.code, hasPostings: existing.has_postings, linkedBy: existing.linked_by }, input.code);
    if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
    const row = await repo.update(resolvedCompanyId, code, withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp()));
    return await enrichRow(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account with the target code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`GL account ${code} not found`);
    }
    throw err;
  }
}

export async function patchGlAccount(code: string, input: GlAccountPatchRequestDto, companyId?: number): Promise<GlAccountResponseDto> {
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const repo = new GlAccountRepo(getDb());
    const row = await repo.patch(resolvedCompanyId, code, withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp()));
    return await enrichRow(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account with the target code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`GL account ${code} not found`);
    }
    throw err;
  }
}

export async function deleteGlAccount(code: string, companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const repo = new GlAccountRepo(getDb());
  await assertDeleteAllowed(repo, resolvedCompanyId, code);
  await repo.delete(resolvedCompanyId, code);
}


export async function listGlAccounts(companyId?: number): Promise<GlAccountResponseDto[]> {
  const rows = await new GlAccountRepo(getDb()).listAll(await scopedCompanyId(companyId));
  return await enrichRows(rows);
}

export async function filterGlAccounts(
  filters: Filter[],
  options?: ListOptions,
  companyId?: number,
): Promise<GlAccountResponseDto[]> {
  const rows = await new GlAccountRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options);
  return await enrichRows(rows);
}

export async function searchGlAccounts(
  phrase: string,
  options?: ListOptions,
  companyId?: number,
): Promise<GlAccountResponseDto[]> {
  const rows = await new GlAccountRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options);
  return await enrichRows(rows);
}
export async function batchCreateGlAccounts(inputs: GlAccountCreateRequestDto[], companyId?: number): Promise<GlAccountResponseDto[]> {
  for (const input of inputs) {
    const errors = validateCreate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new GlAccountRepo(client);
      const results: GlAccountResponseDto[] = [];
      const audit = await createCreationAuditStamp();
      for (const input of inputs) {
        const row = await repo.insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), audit));
        results.push(await enrichRow(row));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more codes already exist");
    }
    throw err;
  }
}

export async function batchGetGlAccounts(codes: string[], companyId?: number): Promise<GlAccountResponseDto[]> {
  const rows = await new GlAccountRepo(getDb()).batchGet(await scopedCompanyId(companyId), codes);
  return await enrichRows(rows);
}

export async function batchUpdateGlAccounts(inputs: GlAccountBatchUpdateRequestDto[], companyId?: number): Promise<GlAccountResponseDto[]> {
  for (const input of inputs) {
    const errors = validateUpdate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new GlAccountRepo(client);
      const results: GlAccountResponseDto[] = [];
      const audit = await createUpdateAuditStamp();
      for (const input of inputs) {
        const row = await repo.update(resolvedCompanyId, input.code, withUpdateAudit(toUpdateRow(input), audit));
        results.push(await enrichRow(row));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more target codes already exist");
    }
    if (err instanceof DataError) {
      throw new NotFoundError("One or more GL accounts not found");
    }
    throw err;
  }
}

export async function batchPatchGlAccounts(inputs: GlAccountBatchPatchRequestDto[], companyId?: number): Promise<GlAccountResponseDto[]> {
  for (const input of inputs) {
    const errors = validatePatch(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new GlAccountRepo(client);
      const results: GlAccountResponseDto[] = [];
      const audit = await createUpdateAuditStamp();
      for (const input of inputs) {
        const row = await repo.patch(resolvedCompanyId, input.code, withUpdateAudit(toPatchRow(input), audit));
        results.push(await enrichRow(row));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more target codes already exist");
    }
    if (err instanceof DataError) {
      throw new NotFoundError("One or more GL accounts not found");
    }
    throw err;
  }
}

export async function batchDeleteGlAccounts(codes: string[], companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const repo = new GlAccountRepo(getDb());
  for (const code of codes) {
    await assertDeleteAllowed(repo, resolvedCompanyId, code);
  }
  await repo.batchDelete(resolvedCompanyId, codes);
}


export async function activateGlAccounts(codes: string[], companyId?: number): Promise<GlAccountResponseDto[]> {
  return transitionGlAccountStatus(codes, "ACTIVE", companyId);
}

export async function activateGlAccount(code: string, companyId?: number): Promise<GlAccountResponseDto> {
  const [account] = await activateGlAccounts([code], companyId);
  return account;
}

export async function deactivateGlAccounts(codes: string[], companyId?: number): Promise<GlAccountResponseDto[]> {
  return transitionGlAccountStatus(codes, "INACTIVE", companyId);
}

export async function deactivateGlAccount(code: string, companyId?: number): Promise<GlAccountResponseDto> {
  const [account] = await deactivateGlAccounts([code], companyId);
  return account;
}

async function transitionGlAccountStatus(
  codes: string[],
  status: "ACTIVE" | "INACTIVE",
  companyId?: number,
): Promise<GlAccountResponseDto[]> {
  const normalizedCodes = normalizeCodes(codes);
  if (normalizedCodes.length === 0) throw new InputValidationError("At least one GL account code is required");
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new GlAccountRepo(client);
    const existing = await repo.batchGet(resolvedCompanyId, normalizedCodes);
    const found = new Set(existing.map((account) => account.code));
    const missing = normalizedCodes.filter((code) => !found.has(code));
    if (missing.length > 0) throw new NotFoundError(`GL account ${missing.join(", ")} not found`);

    if (status === "INACTIVE") {
      const blockers = existing.flatMap((account) => Deactivate({
        code: account.code,
        hasPostings: account.has_postings,
        linkedBy: account.linked_by,
      }));
      if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
    }

    const results: GlAccountResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const code of normalizedCodes) {
      const row = await repo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit));
      results.push(await enrichRow(row));
    }
    return results;
  });
}


