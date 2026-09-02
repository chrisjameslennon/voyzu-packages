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
  IssueRequest,
  ReceiptRequest,
  ReservationRequest,
  StockCountRequest,
  StockCountDetail,
  TransferRequest,
} from "../../types/stock.types";
import { StockRepo } from "../db/stock.repo";
import { ConfigurationRepo } from "../../../configuration/server/db/configuration.repo";
import {
  Adjust,
  CompleteStockCount,
  CreateStockCount,
  DeleteStockCount,
  Issue,
  Receive,
  Reserve,
  SaveStockCount,
  Transfer,
} from "../../domain/operation-policy";

function enforce(blockers: Array<{ message: string }>) {
  if (blockers.length) throw new BusinessRuleError(blockers[0]!.message);
}
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
async function availabilityRequirements(
  repo: StockRepo,
  organizationId: number,
  requirements: Array<{
    itemId: number;
    warehouseId: number;
    quantity: number;
  }>,
): Promise<Array<{ available: number; requested: number }>> {
  const positions = await repo.positions(organizationId);
  return requirements.map((requirement) => {
    const position = positions.find(
      (p) => p.itemId === requirement.itemId && p.warehouseId === requirement.warehouseId,
    );
    return { available: position?.available ?? 0, requested: requirement.quantity };
  });
}
export async function receiveStock(
  organizationId: number,
  input: ReceiptRequest,
) {
  return withTransaction(async (db) => {
    const missingCustomFields = await missingMovementCustomFields(db, organizationId, "RECEIPT", input);
    enforce(Receive(input.lines, input.notes, missingCustomFields));
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
  input: IssueRequest,
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const missingCustomFields = await missingMovementCustomFields(db, organizationId, "ISSUE", input);
    const availability = await availabilityRequirements(repo, organizationId, input.lines.map((line) => ({
        itemId: line.itemId,
        warehouseId: input.warehouseId,
        quantity: line.quantity,
      })));
    enforce(Issue(availability, input.lines, input.notes, missingCustomFields));
    return repo.movement(
      organizationId,
      "ISSUE",
      input,
      withCreationAudit({}, await createCreationAuditStamp()),
    );
  });
}

async function missingMovementCustomFields(
  db: DbExecutor,
  organizationId: number,
  appliesTo: "RECEIPT" | "ISSUE",
  input: ReceiptRequest | IssueRequest,
): Promise<string[]> {
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
  return missing.map((field) => field!.name);
}
export async function transferStock(
  organizationId: number,
  input: TransferRequest,
) {
  return withTransaction(async (db) => {
    const repo = new StockRepo(db);
    const availability = await availabilityRequirements(repo, organizationId, [
      {
        itemId: input.itemId,
        warehouseId: input.fromWarehouseId,
        quantity: input.quantity,
      },
    ]);
    enforce(Transfer(input.fromWarehouseId, input.toWarehouseId, availability));
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
    const availability = await availabilityRequirements(
      repo,
      organizationId,
      input.lines.map((line) => ({
        itemId: input.itemId,
        warehouseId: line.warehouseId,
        quantity: line.quantity,
      })),
    );
    enforce(Reserve(availability, input.lines, input.notes));
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
  enforce(Adjust(input.lines, input.notes));
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
    enforce(CreateStockCount(input.lines, input.notes));
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
    enforce(SaveStockCount(current.status, input.lines, input.notes));
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
    enforce(CompleteStockCount(current.status, current.lines, current.notes));
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
    enforce(DeleteStockCount(current.status));
    await repo.deleteCount(
      organizationId,
      id,
      withUpdateAudit({}, await createUpdateAuditStamp()),
    );
  });
}
