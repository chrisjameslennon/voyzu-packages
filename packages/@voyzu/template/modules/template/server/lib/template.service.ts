import { getDb, withTransaction } from "@voyzu/capability/db";
import {
  BusinessRuleError,
  ConflictError,
  DataError,
  InputValidationError,
  NotFoundError,
} from "@voyzu/capability/errors";
import { checkResponse } from "@voyzu/capability/validation";
import {
  createCreationAuditStamp,
  createUpdateAuditStamp,
  withAuditActors,
  withCreationAudit,
  withUpdateAudit,
} from "@voyzu/audit/stamps";
import type { Status } from "@voyzu/types/modules/core";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type {
  TemplateBatchPatchRequestDto,
  TemplateBatchUpdateRequestDto,
  TemplateCreateRequestDto,
  TemplatePatchRequestDto,
  TemplateResponseDto,
  TemplateUpdateRequestDto,
} from "../../../types";
import { Activate, Deactivate, Delete } from "../../domain/operation-policy";
import { TemplateRepo } from "../db/template.repo";
import type { TemplateRow } from "../db/template.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./template.mapper";
import { validateCreate, validatePatch, validateResponse, validateTemplateCode, validateUpdate } from "./template.validator";

const normalizeCode = (value: string): string => value.trim().toUpperCase();

function validatedCode(value: string): string {
  const normalized = normalizeCode(value);
  const error = validateTemplateCode(normalized);
  if (error) throw new InputValidationError(error);
  return normalized;
}

function validateCodes(values: string[]): string[] {
  const codes = [...new Set(values.map(validatedCode))];
  if (!codes.length) throw new InputValidationError("At least one template code is required");
  return codes;
}

function throwIfBlocked(blockers: Array<{ message: string }>): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map(({ message }) => message).join("; "));
}

async function checkedDto(row: TemplateRow): Promise<TemplateResponseDto> {
  const dto = await withAuditActors(toDto(row), row);
  return checkResponse(dto, validateResponse(dto), `template (${row.code})`);
}

const checkedDtos = (rows: TemplateRow[]): Promise<TemplateResponseDto[]> => Promise.all(rows.map(checkedDto));

function translateDuplicate(error: unknown): never {
  if (
    (typeof error === "object" && error !== null && "code" in error && error.code === "23505")
    || (error instanceof Error && error.message.includes("duplicate key value"))
  ) {
    throw new ConflictError("A template with this code already exists");
  }
  throw error;
}

export async function createTemplate(input: TemplateCreateRequestDto): Promise<TemplateResponseDto> {
  const errors = validateCreate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    const row = await new TemplateRepo(getDb()).insert(withCreationAudit(
      toInsertRow(input),
      await createCreationAuditStamp(),
    ));
    return checkedDto(row);
  } catch (error) {
    return translateDuplicate(error);
  }
}

export async function batchCreateTemplates(inputs: TemplateCreateRequestDto[]): Promise<TemplateResponseDto[]> {
  if (!inputs.length) throw new InputValidationError("At least one template is required");
  for (const input of inputs) {
    const errors = validateCreate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  try {
    return await withTransaction(async (client) => {
      const repo = new TemplateRepo(client);
      const audit = await createCreationAuditStamp();
      const rows: TemplateRow[] = [];
      for (const input of inputs) rows.push(await repo.insert(withCreationAudit(toInsertRow(input), audit)));
      return checkedDtos(rows);
    });
  } catch (error) {
    return translateDuplicate(error);
  }
}

export async function getTemplate(code: string): Promise<TemplateResponseDto | null> {
  const row = await new TemplateRepo(getDb()).get(validatedCode(code));
  return row ? checkedDto(row) : null;
}

export async function listTemplates(options?: ListOptions): Promise<TemplateResponseDto[]> {
  return checkedDtos(await new TemplateRepo(getDb()).list(options));
}

export async function filterTemplates(filters: Filter[], options?: ListOptions): Promise<TemplateResponseDto[]> {
  return checkedDtos(await new TemplateRepo(getDb()).filter(filters, options));
}

export async function searchTemplates(phrase: string, options?: ListOptions): Promise<TemplateResponseDto[]> {
  if (!phrase.trim()) throw new InputValidationError("Search text is required");
  return checkedDtos(await new TemplateRepo(getDb()).search(phrase, options));
}

export async function updateTemplate(code: string, input: TemplateUpdateRequestDto): Promise<TemplateResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    const row = await new TemplateRepo(getDb()).update(
      validatedCode(code),
      withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp()),
    );
    return checkedDto(row);
  } catch (error) {
    if (error instanceof DataError) throw new NotFoundError(error.message);
    throw error;
  }
}

export async function patchTemplate(code: string, input: TemplatePatchRequestDto): Promise<TemplateResponseDto> {
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  try {
    const row = await new TemplateRepo(getDb()).patch(
      validatedCode(code),
      withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp()),
    );
    return checkedDto(row);
  } catch (error) {
    if (error instanceof DataError) throw new NotFoundError(error.message);
    throw error;
  }
}

export async function batchGetTemplates(codes: string[]): Promise<TemplateResponseDto[]> {
  return checkedDtos(await new TemplateRepo(getDb()).batchGet(validateCodes(codes)));
}

export async function batchUpdateTemplates(inputs: TemplateBatchUpdateRequestDto[]): Promise<TemplateResponseDto[]> {
  if (!inputs.length) throw new InputValidationError("At least one template is required");
  for (const input of inputs) {
    const errors = validateUpdate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  return withTransaction(async (client) => {
    const repo = new TemplateRepo(client);
    const audit = await createUpdateAuditStamp();
    const rows: TemplateRow[] = [];
    for (const { code, ...update } of inputs) {
      try {
        rows.push(await repo.update(validatedCode(code), withUpdateAudit(toUpdateRow(update), audit)));
      } catch (error) {
        if (error instanceof DataError) throw new NotFoundError(error.message);
        throw error;
      }
    }
    return checkedDtos(rows);
  });
}

export async function batchPatchTemplates(inputs: TemplateBatchPatchRequestDto[]): Promise<TemplateResponseDto[]> {
  if (!inputs.length) throw new InputValidationError("At least one template is required");
  for (const input of inputs) {
    const errors = validatePatch(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  return withTransaction(async (client) => {
    const repo = new TemplateRepo(client);
    const audit = await createUpdateAuditStamp();
    const rows: TemplateRow[] = [];
    for (const { code, ...patch } of inputs) {
      try {
        rows.push(await repo.patch(validatedCode(code), withUpdateAudit(toPatchRow(patch), audit)));
      } catch (error) {
        if (error instanceof DataError) throw new NotFoundError(error.message);
        throw error;
      }
    }
    return checkedDtos(rows);
  });
}

async function requireRows(repo: TemplateRepo, codes: string[]): Promise<TemplateRow[]> {
  const rows = await repo.batchGet(codes);
  const found = new Set(rows.map(({ code }) => code));
  const missing = codes.filter((code) => !found.has(code));
  if (missing.length) throw new NotFoundError(`Template ${missing.join(", ")} was not found`);
  return rows;
}

export async function deleteTemplate(code: string): Promise<void> {
  return batchDeleteTemplates([code]);
}

export async function batchDeleteTemplates(codes: string[]): Promise<void> {
  const normalized = validateCodes(codes);
  await withTransaction(async (client) => {
    const repo = new TemplateRepo(client);
    const rows = await requireRows(repo, normalized);
    rows.forEach((row) => throwIfBlocked(Delete(row)));
    await repo.stampDeletion(normalized, await createUpdateAuditStamp());
    await repo.delete(normalized);
  });
}

export async function activateTemplate(code: string): Promise<TemplateResponseDto> {
  return (await transitionTemplateStatus([code], "ACTIVE"))[0];
}

export async function deactivateTemplate(code: string): Promise<TemplateResponseDto> {
  return (await transitionTemplateStatus([code], "INACTIVE"))[0];
}

export async function activateTemplates(codes: string[]): Promise<TemplateResponseDto[]> {
  return transitionTemplateStatus(codes, "ACTIVE");
}

export async function deactivateTemplates(codes: string[]): Promise<TemplateResponseDto[]> {
  return transitionTemplateStatus(codes, "INACTIVE");
}

async function transitionTemplateStatus(codes: string[], status: Status): Promise<TemplateResponseDto[]> {
  const normalized = validateCodes(codes);
  return withTransaction(async (client) => {
    const repo = new TemplateRepo(client);
    const rows = await requireRows(repo, normalized);
    rows.forEach((row) => throwIfBlocked(status === "ACTIVE" ? Activate(row) : Deactivate(row)));
    const audit = await createUpdateAuditStamp();
    const updated: TemplateRow[] = [];
    for (const row of rows) {
      updated.push(await repo.patch(row.code, withUpdateAudit({ status }, audit)));
    }
    return checkedDtos(updated);
  });
}
