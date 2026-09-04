import type { DbExecutor } from "@voyzu/capability/db";
import type {
  FinancialActivityDetail,
  FinancialActivitySummary,
} from "../../types/financial-activity.types";

const SELECT = `SELECT activity.id::int,
  activity.organization_id::int,
  activity.inventory_transaction_line_id::int,
  activity.movement_type,
  activity.reason_code,
  activity.status,
  transaction.id::int inventory_transaction_id,
  transaction.code transaction_code,
  transaction.transaction_date,
  transaction.reference,
  transaction.notes,
  line.item_id::int,
  line.item_code,
  line.item_name,
  line.warehouse_id::int,
  warehouse.name warehouse_name,
  line.quantity_change::float8,
  activity.creation_date,
  activity.creation_actor_type,
  activity.creation_user_id,
  activity.creation_mutation_id,
  activity.updated_date,
  activity.updated_actor_type,
  activity.updated_user_id,
  activity.updated_mutation_id
FROM inventory_financial_activity activity
JOIN inventory_transaction_line line
  ON line.organization_id=activity.organization_id
 AND line.id=activity.inventory_transaction_line_id
JOIN inventory_transaction transaction
  ON transaction.organization_id=line.organization_id
 AND transaction.id=line.inventory_transaction_id
JOIN warehouse
  ON warehouse.organization_id=line.organization_id
 AND warehouse.id=line.warehouse_id`;

const iso = (value: unknown) => new Date(String(value)).toISOString();
const summary = (row: Record<string, unknown>): FinancialActivitySummary => ({
  id: Number(row.id),
  organizationId: Number(row.organization_id),
  inventoryTransactionLineId: Number(row.inventory_transaction_line_id),
  inventoryTransactionId: Number(row.inventory_transaction_id),
  transactionCode: String(row.transaction_code),
  transactionDate: iso(row.transaction_date),
  movementType: row.movement_type as FinancialActivitySummary["movementType"],
  reasonCode: row.reason_code as FinancialActivitySummary["reasonCode"],
  status: row.status as FinancialActivitySummary["status"],
  itemId: Number(row.item_id),
  itemCode: String(row.item_code),
  itemName: String(row.item_name),
  warehouseId: Number(row.warehouse_id),
  warehouseName: String(row.warehouse_name),
  quantityChange: Number(row.quantity_change),
});

export class FinancialActivityRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(organizationId: number): Promise<FinancialActivitySummary[]> {
    const { rows } = await this.db.query(
      `${SELECT} WHERE activity.organization_id=$1 ORDER BY transaction.transaction_date DESC,activity.id DESC`,
      [organizationId],
    );
    return (rows as Record<string, unknown>[]).map(summary);
  }

  async get(organizationId: number, id: number): Promise<FinancialActivityDetail | null> {
    const { rows } = await this.db.query(
      `${SELECT} WHERE activity.organization_id=$1 AND activity.id=$2`,
      [organizationId, id],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      ...summary(row),
      reference: row.reference == null ? null : String(row.reference),
      notes: String(row.notes ?? ""),
      audit: {
        created: {
          date: iso(row.creation_date),
          actorType: row.creation_actor_type as "API" | "APP" | "SYSTEM",
          userId: row.creation_user_id == null ? null : String(row.creation_user_id),
          mutationId: row.creation_mutation_id == null ? null : String(row.creation_mutation_id),
        },
        updated: {
          date: iso(row.updated_date),
          actorType: row.updated_actor_type as "API" | "APP" | "SYSTEM",
          userId: row.updated_user_id == null ? null : String(row.updated_user_id),
          mutationId: row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
        },
      },
    };
  }

  async markProcessed(
    organizationId: number,
    id: number,
    stamp: Record<string, unknown>,
  ): Promise<void> {
    const entries = Object.entries(stamp);
    await this.db.query(
      `UPDATE inventory_financial_activity
       SET status='PROCESSED',${entries.map(([key], index) => `${key}=$${index + 3}`).join(",")}
       WHERE organization_id=$1 AND id=$2 AND status='AVAILABLE'`,
      [organizationId, id, ...entries.map(([, value]) => value)],
    );
  }
}
