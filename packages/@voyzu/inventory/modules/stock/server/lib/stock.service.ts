import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  createCreationAuditStamp,
  createUpdateAuditStamp,
  withCreationAudit,
  withAuditActors,
  withUpdateAudit,
} from "@voyzu/audit/stamps";
import type {
  AdjustmentRequest,
  MovementRequest,
  ReservationRequest,
  StockCountRequest,
  StockCountDetail,
  TransferRequest,
} from "../../types/stock.types";
import { StockRepo } from "../db/stock.repo";
import { ConfigurationRepo } from "../../../configuration/server/db/configuration.repo";
import {
  Adjust,
  MoveAvailableStock,
  Transfer,
} from "../../domain/operation-policy";
const enrichStockCountAudit = (record: StockCountDetail) =>
  withAuditActors(record, {
    creation_user_id: record.audit.created.userId,
    updated_user_id: record.audit.updated.userId,
  });
export const listStockPositions = (organizationId: number) =>
  new StockRepo(getDb()).positions(organizationId);
export const listStockActivity = (organizationId: number) =>
  new StockRepo(getDb()).activity(organizationId);
export const getStockActivityDetail = async (
  organizationId: number,
  code: string,
) => {
  const record = await new StockRepo(getDb()).activityDetail(
    organizationId,
    code,
  );
  return record
    ? withAuditActors(record, {
        creation_user_id: record.audit.created.userId,
        updated_user_id: record.audit.updated.userId,
      })
    : null;
};
export const getStockOptions = (organizationId: number) =>
  new StockRepo(getDb()).options(organizationId);
export const listStockCounts = (organizationId: number) =>
  new StockRepo(getDb()).counts(organizationId);
export const getStockCount = async (organizationId: number, id: number) => {
  const record = await new StockRepo(getDb()).count(organizationId, id);
  return record ? enrichStockCountAudit(record) : null;
};
async function validateAvailable(
  repo: StockRepo,
  organizationId: number,
  requirements: Array<{
    itemId: number;
    warehouseId: number;
    quantity: number;
  }>,
) {
  const positions = await repo.positions(organizationId);
  const blockers = MoveAvailableStock(
    requirements.map((requirement) => {
      const position = positions.find(
        (p) =>
          p.itemId === requirement.itemId &&
          p.warehouseId === requirement.warehouseId,
      );
      return {
        available: position?.available ?? 0,
        requested: requirement.quantity,
      };
    }),
  );
  if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
}
export async function receiveStock(
  organizationId: number,
  input: MovementRequest,
) {
  return withTransaction(async (db) => {
    await validateMovementCustomFields(db, organizationId, "RECEIPT", input);
    return new StockRepo(db).movement(
      organizationId,
      "RECEIPT",
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
  });
}
export async function issueStock(
  organizationId: number,
  input: MovementRequest,
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    await validateMovementCustomFields(db, organizationId, "ISSUE", input);
    await validateAvailable(
      repo,
      organizationId,
      input.lines.map((line) => ({
        itemId: line.itemId,
        warehouseId: input.warehouseId,
        quantity: line.quantity,
      })),
    );
    return repo.movement(
      organizationId,
      "ISSUE",
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
  });
}

async function validateMovementCustomFields(
  db: DbExecutor,
  organizationId: number,
  appliesTo: "RECEIPT" | "ISSUE",
  input: MovementRequest,
) {
  const repo = new ConfigurationRepo(db);
  const rows = await repo.list(organizationId, "custom-field");
  const definitions = (
    await Promise.all(
      rows.map((row) => repo.get(organizationId, "custom-field", row.id)),
    )
  ).filter(
    (field) => field?.status === "ACTIVE" && field.appliesTo === appliesTo,
  );
  const supplied = new Map(
    (input.customFields ?? []).map((field) => [
      field.customFieldId,
      field.value,
    ]),
  );
  const missing = definitions.filter((field) => {
    if (!field?.required) return false;
    const value = supplied.get(field.id);
    return (
      value == null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  });
  if (missing.length)
    throw new BusinessRuleError(
      `Complete required custom fields: ${missing.map((field) => field!.name).join(", ")}`,
    );
}
export async function transferStock(
  organizationId: number,
  input: TransferRequest,
) {
  const blockers = Transfer(input.fromWarehouseId, input.toWarehouseId);
  if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    await validateAvailable(repo, organizationId, [
      {
        itemId: input.itemId,
        warehouseId: input.fromWarehouseId,
        quantity: input.quantity,
      },
    ]);
    return repo.transfer(
      organizationId,
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
  });
}
export async function reserveStock(
  organizationId: number,
  input: ReservationRequest,
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    await validateAvailable(
      repo,
      organizationId,
      input.lines.map((line) => ({
        itemId: input.itemId,
        warehouseId: line.warehouseId,
        quantity: line.quantity,
      })),
    );
    await repo.reserve(
      organizationId,
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
  });
}
export async function adjustStock(
  organizationId: number,
  input: AdjustmentRequest,
) {
  const blockers = Adjust(input.lines);
  if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
  return withTransaction(async (db) =>
    new StockRepo(db).adjust(
      organizationId,
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    ),
  );
}
export async function createStockCount(
  organizationId: number,
  input: StockCountRequest,
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const id = await repo.createCount(
      organizationId,
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
    return enrichStockCountAudit((await repo.count(organizationId, id))!);
  });
}
export async function saveStockCount(
  organizationId: number,
  id: number,
  input: StockCountRequest,
  status: "DRAFT" | "IN_PROGRESS",
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const current = await repo.count(organizationId, id);
    if (!current) throw new NotFoundError("Stocktake was not found");
    if (current.status === "COMPLETED")
      throw new BusinessRuleError("A completed stocktake cannot be changed");
    await repo.saveCount(
      organizationId,
      id,
      input,
      status,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return enrichStockCountAudit((await repo.count(organizationId, id))!);
  });
}
export async function completeStockCount(organizationId: number, id: number) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const current = await repo.count(organizationId, id);
    if (!current) throw new NotFoundError("Stocktake was not found");
    if (current.status === "COMPLETED")
      throw new BusinessRuleError("This stocktake is already complete");
    await repo.completeCount(
      organizationId,
      id,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
    return enrichStockCountAudit((await repo.count(organizationId, id))!);
  });
}
export async function deleteStockCount(organizationId: number, id: number) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const current = await repo.count(organizationId, id);
    if (!current) throw new NotFoundError("Stocktake was not found");
    if (current.status === "COMPLETED")
      throw new BusinessRuleError("A completed stocktake cannot be deleted");
    await repo.deleteCount(
      organizationId,
      id,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
  });
}
