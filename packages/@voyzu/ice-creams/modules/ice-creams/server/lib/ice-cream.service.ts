import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import {
  BusinessRuleError,
  ConflictError,
  DataError,
  NotFoundError,
} from "@voyzu/capability/errors";
import { events as platformEvents } from "@voyzu/capability/events";
import {
  createCreationAuditStamp,
  createUpdateAuditStamp,
  withAuditActors,
  withCreationAudit,
  withUpdateAudit,
} from "@voyzu/audit/stamps";
import type { Filter, ListOptions } from "@voyzu/types/params";
import type { Status } from "@voyzu/types/modules/core";

import type {
  IceCreamBatchPatchRequestDto,
  IceCreamBatchUpdateRequestDto,
  IceCreamCreateRequestDto,
  IceCreamFlavorResponseDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
  IceCreamUpdateRequestDto,
} from "@voyzu/ice-creams/types";
import { Activate, Deactivate, Delete } from "../../domain/operation-policy";
import { events } from "../../events";
import { IceCreamRepo } from "../db/ice-cream.repo";
import type { IceCreamRow } from "../db/ice-cream.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./ice-cream.mapper";

function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeCodes(values: string[]): string[] {
  return [...new Set(values.map(normalizeCode).filter(Boolean))];
}

function throwIfBlocked(blockers: Array<{ message: string }>): void {
  if (blockers.length) {
    throw new BusinessRuleError(blockers.map(({ message }) => message).join("; "));
  }
}

async function responseDto(row: IceCreamRow): Promise<IceCreamResponseDto> {
  return withAuditActors(toDto(row), row);
}

function responseDtos(rows: IceCreamRow[]): Promise<IceCreamResponseDto[]> {
  return Promise.all(rows.map(responseDto));
}

async function resolveActiveFlavor(
  repo: IceCreamRepo,
  flavorCode: string,
): Promise<IceCreamFlavorResponseDto> {
  const flavor = await repo.getFlavor(flavorCode);
  if (!flavor) throw new NotFoundError(`Flavour ${flavorCode} was not found`);
  if (flavor.status !== "ACTIVE") {
    throw new BusinessRuleError(`Flavour ${flavor.code} is inactive`);
  }
  return flavor;
}

function translateDuplicate(error: unknown): never {
  if (error instanceof Error && error.message.includes("duplicate key value")) {
    throw new ConflictError("An ice cream with this code already exists");
  }
  throw error;
}

export async function listIceCreamFlavors(): Promise<IceCreamFlavorResponseDto[]> {
  return new IceCreamRepo(getDb()).listFlavors();
}

export async function createIceCream(
  input: IceCreamCreateRequestDto,
): Promise<IceCreamResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const repo = new IceCreamRepo(db);
      const flavor = await resolveActiveFlavor(repo, input.flavorCode);
      const row = await repo.insert(withCreationAudit(
        toInsertRow(input, flavor.id),
        await createCreationAuditStamp(),
      ));
      const iceCream = await responseDto(row);
      await platformEvents.dispatch(events.iceCreamCreated, iceCream, { transaction: db });
      return iceCream;
    });
  } catch (error) {
    return translateDuplicate(error);
  }
}

export async function getIceCream(code: string): Promise<IceCreamResponseDto | null> {
  const row = await new IceCreamRepo(getDb()).get(normalizeCode(code));
  return row ? responseDto(row) : null;
}

export async function listIceCreams(options?: ListOptions): Promise<IceCreamResponseDto[]> {
  return responseDtos(await new IceCreamRepo(getDb()).list(options));
}

export async function filterIceCreams(
  filters: Filter[],
  options?: ListOptions,
): Promise<IceCreamResponseDto[]> {
  return responseDtos(await new IceCreamRepo(getDb()).filter(filters, options));
}

export async function searchIceCreams(
  phrase: string,
  options?: ListOptions,
): Promise<IceCreamResponseDto[]> {
  return responseDtos(await new IceCreamRepo(getDb()).search(phrase, options));
}

export async function updateIceCream(
  code: string,
  input: IceCreamUpdateRequestDto,
): Promise<IceCreamResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const repo = new IceCreamRepo(db);
      const flavor = await resolveActiveFlavor(repo, input.flavorCode);
      const row = await repo.update(
        normalizeCode(code),
        withUpdateAudit(toUpdateRow(input, flavor.id), await createUpdateAuditStamp()),
      );
      const iceCream = await responseDto(row);
      await platformEvents.dispatch(events.iceCreamUpdated, iceCream, { transaction: db });
      return iceCream;
    });
  } catch (error) {
    if (error instanceof DataError) throw new NotFoundError(error.message);
    throw error;
  }
}

export async function patchIceCream(
  code: string,
  input: IceCreamPatchRequestDto,
): Promise<IceCreamResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const repo = new IceCreamRepo(db);
      const flavor = input.flavorCode === undefined
        ? undefined
        : await resolveActiveFlavor(repo, input.flavorCode);
      const row = await repo.patch(
        normalizeCode(code),
        withUpdateAudit(toPatchRow(input, flavor?.id), await createUpdateAuditStamp()),
      );
      const iceCream = await responseDto(row);
      await platformEvents.dispatch(events.iceCreamUpdated, iceCream, { transaction: db });
      return iceCream;
    });
  } catch (error) {
    if (error instanceof DataError) throw new NotFoundError(error.message);
    throw error;
  }
}

export async function batchCreateIceCreams(
  inputs: IceCreamCreateRequestDto[],
): Promise<IceCreamResponseDto[]> {
  try {
    return await withTransaction(async (client) => {
      const repo = new IceCreamRepo(client);
      const audit = await createCreationAuditStamp();
      const rows: IceCreamRow[] = [];
      for (const input of inputs) {
        const flavor = await resolveActiveFlavor(repo, input.flavorCode);
        rows.push(await repo.insert(withCreationAudit(toInsertRow(input, flavor.id), audit)));
      }
      const iceCreams = await responseDtos(rows);
      await platformEvents.dispatch(events.iceCreamsCreated, iceCreams, { transaction: client });
      return iceCreams;
    });
  } catch (error) {
    return translateDuplicate(error);
  }
}

export async function batchGetIceCreams(codes: string[]): Promise<IceCreamResponseDto[]> {
  return responseDtos(await new IceCreamRepo(getDb()).batchGet(normalizeCodes(codes)));
}

export async function batchUpdateIceCreams(
  inputs: IceCreamBatchUpdateRequestDto[],
): Promise<IceCreamResponseDto[]> {
  return withTransaction(async (client) => {
    const repo = new IceCreamRepo(client);
    const audit = await createUpdateAuditStamp();
    const rows: IceCreamRow[] = [];
    for (const input of inputs) {
      const { code, ...update } = input;
      const flavor = await resolveActiveFlavor(repo, update.flavorCode);
      try {
        rows.push(await repo.update(normalizeCode(code), withUpdateAudit(toUpdateRow(update, flavor.id), audit)));
      } catch (error) {
        if (error instanceof DataError) throw new NotFoundError(error.message);
        throw error;
      }
    }
    const iceCreams = await responseDtos(rows);
    await platformEvents.dispatch(events.iceCreamsUpdated, iceCreams, { transaction: client });
    return iceCreams;
  });
}

export async function batchPatchIceCreams(
  inputs: IceCreamBatchPatchRequestDto[],
): Promise<IceCreamResponseDto[]> {
  return withTransaction(async (client) => {
    const repo = new IceCreamRepo(client);
    const audit = await createUpdateAuditStamp();
    const rows: IceCreamRow[] = [];
    for (const input of inputs) {
      const { code, ...patch } = input;
      const flavor = patch.flavorCode
        ? await resolveActiveFlavor(repo, patch.flavorCode)
        : undefined;
      try {
        rows.push(await repo.patch(normalizeCode(code), withUpdateAudit(toPatchRow(patch, flavor?.id), audit)));
      } catch (error) {
        if (error instanceof DataError) throw new NotFoundError(error.message);
        throw error;
      }
    }
    const iceCreams = await responseDtos(rows);
    await platformEvents.dispatch(events.iceCreamsUpdated, iceCreams, { transaction: client });
    return iceCreams;
  });
}

async function requireRows(repo: IceCreamRepo, codes: string[]): Promise<IceCreamRow[]> {
  const rows = await repo.batchGet(codes);
  const found = new Set(rows.map(({ code }) => code));
  const missing = codes.filter((code) => !found.has(code));
  if (missing.length) throw new NotFoundError(`Ice cream ${missing.join(", ")} was not found`);
  return rows;
}

export async function deleteIceCream(code: string): Promise<void> {
  await withTransaction(async (db) => {
    const repo = new IceCreamRepo(db);
    const [row] = await requireRows(repo, normalizeCodes([code]));
    throwIfBlocked(Delete(row));
    const iceCream = await responseDto(row);
    await platformEvents.dispatch(events.iceCreamDeleted, iceCream, { transaction: db });
    const audit = await createUpdateAuditStamp();
    await repo.stampDeletion([row.code], audit);
    await repo.delete([row.code]);
  });
}

export async function batchDeleteIceCreams(codes: string[]): Promise<void> {
  const normalized = normalizeCodes(codes);
  await withTransaction(async (client) => {
    const repo = new IceCreamRepo(client);
    const rows = await requireRows(repo, normalized);
    rows.forEach((row) => throwIfBlocked(Delete(row)));
    const iceCreams = await responseDtos(rows);
    await platformEvents.dispatch(events.iceCreamsDeleted, iceCreams, { transaction: client });
    const audit = await createUpdateAuditStamp();
    await repo.stampDeletion(normalized, audit);
    await repo.delete(normalized);
  });
}

export async function activateIceCream(code: string): Promise<IceCreamResponseDto> {
  return withTransaction(async (db) => {
    const [iceCream] = await transitionIceCreamStatus(db, [code], "ACTIVE");
    await platformEvents.dispatch(events.iceCreamActivated, iceCream, { transaction: db });
    return iceCream;
  });
}

export async function deactivateIceCream(code: string): Promise<IceCreamResponseDto> {
  return withTransaction(async (db) => {
    const [iceCream] = await transitionIceCreamStatus(db, [code], "INACTIVE");
    await platformEvents.dispatch(events.iceCreamDeactivated, iceCream, { transaction: db });
    return iceCream;
  });
}

export async function activateIceCreams(codes: string[]): Promise<IceCreamResponseDto[]> {
  return withTransaction(async (db) => {
    const iceCreams = await transitionIceCreamStatus(db, codes, "ACTIVE");
    await platformEvents.dispatch(events.iceCreamsActivated, iceCreams, { transaction: db });
    return iceCreams;
  });
}

export async function deactivateIceCreams(codes: string[]): Promise<IceCreamResponseDto[]> {
  return withTransaction(async (db) => {
    const iceCreams = await transitionIceCreamStatus(db, codes, "INACTIVE");
    await platformEvents.dispatch(events.iceCreamsDeactivated, iceCreams, { transaction: db });
    return iceCreams;
  });
}

async function transitionIceCreamStatus(
  db: DbExecutor,
  codes: string[],
  status: Status,
): Promise<IceCreamResponseDto[]> {
  const normalized = normalizeCodes(codes);
  const repo = new IceCreamRepo(db);
  const rows = await requireRows(repo, normalized);
  rows.forEach((row) => throwIfBlocked(status === "ACTIVE" ? Activate(row) : Deactivate(row)));
  const audit = await createUpdateAuditStamp();
  const updated: IceCreamRow[] = [];
  for (const row of rows) {
    updated.push(await repo.patch(row.code, withUpdateAudit({ status }, audit)));
  }
  return responseDtos(updated);
}
