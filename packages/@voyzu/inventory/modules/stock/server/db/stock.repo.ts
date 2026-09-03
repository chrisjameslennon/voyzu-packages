import type { DbExecutor } from "@voyzu/capability/db";
import type {
  AdjustmentRequest,
  IssueRequest,
  ReceiptRequest,
  ReservationRequest,
  StockActivity,
  StockCountDetail,
  StockCountRequest,
  StockCountRow,
  StockCustomFieldInput,
  StockOption,
  StockPosition,
  StockActivityDetail,
  TransferRequest,
} from "../../types/stock.types";
import type { StockReasonCode } from "../../../core/types";
import type { FinancialMovementType } from "../../../financial-activity/types/financial-activity.types";
const isoDate = (value: unknown) => new Date(String(value)).toISOString();
const audit = (row: Record<string, unknown>) => ({
  created: {
    date: isoDate(row.creation_date),
    actorType: row.creation_actor_type as "API" | "APP" | "SYSTEM",
    userId: row.creation_user_id == null ? null : String(row.creation_user_id),
    mutationId:
      row.creation_mutation_id == null
        ? null
        : String(row.creation_mutation_id),
  },
  updated: {
    date: isoDate(row.updated_date),
    actorType: row.updated_actor_type as "API" | "APP" | "SYSTEM",
    userId: row.updated_user_id == null ? null : String(row.updated_user_id),
    mutationId:
      row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  },
});
export class StockRepo {
  constructor(private readonly db: DbExecutor) {}
  async options(organizationId: number) {
    const [items, warehouses] = await Promise.all([
      this.db.query(
        "SELECT id::int, sku code, name, unit FROM item WHERE organization_id=$1 AND status='ACTIVE' AND quantity_tracked=true ORDER BY sku",
        [organizationId],
      ),
      this.db.query(
        "SELECT id::int, code, name, status FROM warehouse WHERE organization_id=$1 ORDER BY name",
        [organizationId],
      ),
    ]);
    return {
      items: items.rows as StockOption[],
      warehouses: warehouses.rows as StockOption[],
    };
  }
  async warehouseStatuses(
    organizationId: number,
    warehouseIds: number[],
  ): Promise<Map<number, "ACTIVE" | "INACTIVE">> {
    const uniqueIds = [...new Set(warehouseIds)];
    if (!uniqueIds.length) return new Map();
    const { rows } = await this.db.query(
      "SELECT id::int, status FROM warehouse WHERE organization_id=$1 AND id=ANY($2::bigint[])",
      [organizationId, uniqueIds],
    );
    return new Map(
      rows.map((row: Record<string, unknown>) => [
        Number(row.id),
        row.status as "ACTIVE" | "INACTIVE",
      ]),
    );
  }
  async positions(organizationId: number): Promise<StockPosition[]> {
    const { rows } = await this.db.query(
      `WITH movement AS (SELECT item_id,warehouse_id,sum(quantity_change)::float8 on_hand FROM inventory_transaction_line WHERE organization_id=$1 GROUP BY item_id,warehouse_id), reservation AS (SELECT item_id,warehouse_id,sum(quantity_change)::float8 reserved FROM inventory_reservation_line WHERE organization_id=$1 GROUP BY item_id,warehouse_id), pairs AS (SELECT item_id,warehouse_id FROM movement UNION SELECT item_id,warehouse_id FROM reservation) SELECT pairs.item_id::int,pairs.warehouse_id::int,item.sku,item.name item_name,item.status item_status,item.quantity_tracked,item.unit,warehouse.name warehouse_name,warehouse.status warehouse_status,coalesce(movement.on_hand,0)::float8 on_hand,coalesce(reservation.reserved,0)::float8 reserved FROM pairs JOIN item ON item.organization_id=$1 AND item.id=pairs.item_id JOIN warehouse ON warehouse.organization_id=$1 AND warehouse.id=pairs.warehouse_id LEFT JOIN movement USING(item_id,warehouse_id) LEFT JOIN reservation USING(item_id,warehouse_id) ORDER BY item.sku,warehouse.name`,
      [organizationId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.item_id) * 1000000 + Number(row.warehouse_id),
      itemId: Number(row.item_id),
      sku: String(row.sku),
      itemName: String(row.item_name),
      itemStatus: row.item_status as StockPosition["itemStatus"],
      quantityTracked: Boolean(row.quantity_tracked),
      unit: row.unit == null ? null : String(row.unit),
      warehouseId: Number(row.warehouse_id),
      warehouseName: String(row.warehouse_name),
      warehouseStatus: row.warehouse_status as StockPosition["warehouseStatus"],
      onHand: Number(row.on_hand),
      reserved: Number(row.reserved),
      available: Number(row.on_hand) - Number(row.reserved),
    }));
  }
  async activity(organizationId: number): Promise<StockActivity[]> {
    const { rows } = await this.db.query(
      `SELECT transaction.id::int id,
              transaction.code,
              'TRANSACTION'::text activity_source,
              transaction.transaction_date date,
              transaction.transaction_type type,
              count(line.id)::int line_count,
              transaction.source_type source,
              CASE WHEN transaction.source_type='STOCK_COUNT'
                THEN (SELECT count.code FROM stock_count count WHERE count.organization_id=transaction.organization_id AND count.id=transaction.source_id)
                ELSE NULL
              END source_code,
              transaction.reference
       FROM inventory_transaction transaction
       LEFT JOIN inventory_transaction_line line
         ON line.organization_id=transaction.organization_id
        AND line.inventory_transaction_id=transaction.id
       WHERE transaction.organization_id=$1
       GROUP BY transaction.id
       ORDER BY transaction.creation_date DESC,transaction.id DESC`,
      [organizationId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      activitySource: row.activity_source as StockActivity["activitySource"],
      date: new Date(String(row.date)).toISOString(),
      type: String(row.type),
      lineCount: Number(row.line_count),
      source: row.source == null ? null : String(row.source),
      sourceCode:
        row.source_code == null ? null : String(row.source_code),
      reference: row.reference == null ? null : String(row.reference),
    }));
  }
  async activityDetail(
    organizationId: number,
    code: string,
  ): Promise<StockActivityDetail | null> {
    const { rows } = await this.db.query(
      `SELECT transaction.id::int,
              transaction.organization_id,
              transaction.code,
              'TRANSACTION'::text activity_source,
              transaction.transaction_date date,
              transaction.transaction_type type,
              transaction.source_type,
              CASE WHEN transaction.source_type='STOCK_COUNT'
                THEN (SELECT count.code FROM stock_count count WHERE count.organization_id=transaction.organization_id AND count.id=transaction.source_id)
                ELSE NULL
              END source_code,
              transaction.reference,
              transaction.notes,
              transaction.creation_date,
              transaction.creation_actor_type,
              transaction.creation_user_id,
              transaction.creation_mutation_id,
              transaction.updated_date,
              transaction.updated_actor_type,
              transaction.updated_user_id,
              transaction.updated_mutation_id
       FROM inventory_transaction transaction
       WHERE transaction.organization_id=$1 AND transaction.code=$2
       LIMIT 1`,
      [organizationId, code],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    const lines = await this.db.query(
      `SELECT line.id::int,line.item_id::int,line.item_code sku,line.item_name,line.warehouse_id::int,warehouse.name warehouse,line.quantity_change::float8,line.reason_code
       FROM inventory_transaction_line line
       JOIN warehouse ON warehouse.organization_id=line.organization_id AND warehouse.id=line.warehouse_id
       WHERE line.organization_id=$1 AND line.inventory_transaction_id=$2
       ORDER BY line.id`,
      [
        organizationId,
        Number(row.id),
      ],
    );
    return {
      id: Number(row.id),
      code: String(row.code),
      activitySource: row.activity_source as StockActivityDetail["activitySource"],
      date: new Date(String(row.date)).toISOString(),
      type: String(row.type),
      source:
        row.source_type == null
          ? null
          : String(row.source_type),
      sourceCode:
        row.source_code == null ? null : String(row.source_code),
      reference: row.reference == null ? null : String(row.reference),
      notes: String(row.notes ?? ""),
      lines: lines.rows.map((line: Record<string, unknown>) => ({
        id: Number(line.id),
        itemId: Number(line.item_id),
        sku: String(line.sku),
        itemName: String(line.item_name),
        warehouseId: Number(line.warehouse_id),
        warehouse: String(line.warehouse),
        quantityChange: Number(line.quantity_change),
        reasonCode: line.reason_code == null ? null : line.reason_code as StockReasonCode,
      })),
      audit: audit(row),
    };
  }
  private async insertTransaction(
    organizationId: number,
    type: string,
    date: string,
    reference: string | undefined,
    notes: string | undefined,
    lines: Array<{
      itemId: number;
      warehouseId: number;
      quantity: number;
      reasonCode?: StockReasonCode;
    }>,
    stamp: Record<string, unknown>,
    customFields: StockCustomFieldInput[] = [],
    options: {
      source?: { type: "STOCK_COUNT"; id: number };
    } = {},
  ) {
    const e = Object.entries(stamp);
    const sequence = await this.db.query(
      "SELECT nextval(pg_get_serial_sequence('inventory_transaction','id')) AS id",
    );
    const transactionId = Number(sequence.rows[0].id);
    const prefixes: Record<string, string> = {
      RECEIPT: "INV-REC",
      ISSUE: "INV-ISS",
      TRANSFER: "INV-TRF",
      ADJUSTMENT: "INV-ADJ",
    };
    const code = `${prefixes[type] ?? "INV-TXN"}-${transactionId}`;
    await this.db.query(
      `INSERT INTO inventory_transaction(id,organization_id,code,transaction_type,transaction_date,reference,notes,source_type,source_id,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,$5::timestamptz,$6,$7,$8,$9,${e.map((_, i) => `$${i + 10}`).join(",")}) RETURNING id::int`,
      [
        transactionId,
        organizationId,
        code,
        type,
        date,
        reference ?? null,
        notes ?? "",
        options.source?.type ?? "DIRECT",
        options.source?.id ?? null,
        ...e.map(([, v]) => v),
      ],
    );
    for (const line of lines) {
      const insertedLine = await this.db.query(
        `INSERT INTO inventory_transaction_line(organization_id,inventory_transaction_id,item_id,item_code,item_name,warehouse_id,quantity_change,reason_code,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,(SELECT sku FROM item WHERE organization_id=$1 AND id=$3),(SELECT name FROM item WHERE organization_id=$1 AND id=$3),$4,$5,$6,${e.map((_, i) => `$${i + 7}`).join(",")}) RETURNING id::int`,
        [
          organizationId,
          transactionId,
          line.itemId,
          line.warehouseId,
          line.quantity,
          line.reasonCode ?? null,
          ...e.map(([, v]) => v),
        ],
      );
      if (type !== "TRANSFER") {
        if (!line.reasonCode)
          throw new Error(`A reason code is required for ${type.toLowerCase()} lines`);
        const movementType = type as FinancialMovementType;
        await this.db.query(
          `INSERT INTO inventory_financial_activity(organization_id,inventory_transaction_line_id,movement_type,reason_code,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,${e.map((_, i) => `$${i + 5}`).join(",")})`,
          [
            organizationId,
            Number(insertedLine.rows[0].id),
            movementType,
            line.reasonCode,
            ...e.map(([, v]) => v),
          ],
        );
      }
    }
    for (const field of customFields) {
      const definition = await this.db.query(
        "SELECT data_type FROM inv_custom_field WHERE organization_id=$1 AND id=$2 AND status='ACTIVE'",
        [organizationId, field.customFieldId],
      );
      const dataType = String(definition.rows[0]?.data_type ?? "");
      const values = Array.isArray(field.value) ? field.value : [field.value];
      for (const value of values) {
        if (value === null || value === "") continue;
        const valueColumns =
          dataType === "BOOLEAN"
            ? { boolean_value: value }
            : dataType === "NUMBER"
              ? { number_value: value }
              : dataType === "DATE"
                ? { date_value: value }
                : dataType === "OPTION" || dataType === "MULTIPLE_OPTIONS"
                  ? { option_list_value_id: value }
                  : { text_value: value };
        const valueEntries = Object.entries(valueColumns);
        await this.db.query(
          `INSERT INTO inv_custom_field_value(organization_id,custom_field_id,record_id,${valueEntries.map(([key]) => key).join(",")},${e.map(([key]) => key).join(",")}) VALUES($1,$2,$3,${valueEntries.map((_, index) => `$${index + 4}`).join(",")},${e.map((_, index) => `$${index + valueEntries.length + 4}`).join(",")})`,
          [
            organizationId,
            field.customFieldId,
            transactionId,
            ...valueEntries.map(([, item]) => item),
            ...e.map(([, item]) => item),
          ],
        );
      }
    }
    return transactionId;
  }
  async movement(
    organizationId: number,
    type: "RECEIPT" | "ISSUE",
    input: ReceiptRequest | IssueRequest,
    stamp: Record<string, unknown>,
  ) {
    return this.insertTransaction(
      organizationId,
      type,
      input.date,
      input.reference,
      input.notes,
      input.lines.map((line) => ({
        itemId: line.itemId,
        warehouseId: input.warehouseId,
        quantity: type === "ISSUE" ? -line.quantity : line.quantity,
        reasonCode: line.reasonCode,
      })),
      stamp,
      input.customFields ?? [],
    );
  }
  async transfer(
    organizationId: number,
    input: TransferRequest,
    stamp: Record<string, unknown>,
  ) {
    return this.insertTransaction(
      organizationId,
      "TRANSFER",
      input.date,
      input.reference,
      undefined,
      [
        {
          itemId: input.itemId,
          warehouseId: input.fromWarehouseId,
          quantity: -input.quantity,
        },
        {
          itemId: input.itemId,
          warehouseId: input.toWarehouseId,
          quantity: input.quantity,
        },
      ],
      stamp,
    );
  }
  async adjust(
    organizationId: number,
    input: AdjustmentRequest,
    stamp: Record<string, unknown>,
  ) {
    return this.insertTransaction(
      organizationId,
      "ADJUSTMENT",
      input.date,
      input.reference,
      input.notes,
      input.lines
        .filter((line) => line.quantityChange !== 0)
        .map((line) => ({
          itemId: line.itemId,
          warehouseId: input.warehouseId,
          quantity: line.quantityChange,
          reasonCode: line.reasonCode,
        })),
      stamp,
    );
  }
  async reserve(
    organizationId: number,
    input: ReservationRequest,
    stamp: Record<string, unknown>,
  ) {
    const e = Object.entries(stamp);
    const sequence = await this.db.query(
      "SELECT nextval(pg_get_serial_sequence('inventory_reservation','id')) AS id",
    );
    const reservationId = Number(sequence.rows[0].id);
    const code = `INV-RSV-${reservationId}`;
    await this.db.query(
      `INSERT INTO inventory_reservation(id,organization_id,code,source_type,reference,notes,reserved_at,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,'DIRECT',$4,$5,now(),${e.map((_, i) => `$${i + 6}`).join(",")})`,
      [
        reservationId,
        organizationId,
        code,
        input.reference,
        input.notes ?? "",
        ...e.map(([, v]) => v),
      ],
    );
    for (const line of input.lines)
      await this.db.query(
        `INSERT INTO inventory_reservation_line(organization_id,inventory_reservation_id,item_id,item_code,item_name,warehouse_id,quantity_change,reason_code,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,(SELECT sku FROM item WHERE organization_id=$1 AND id=$3),(SELECT name FROM item WHERE organization_id=$1 AND id=$3),$4,$5,$6,${e.map((_, i) => `$${i + 7}`).join(",")})`,
        [
          organizationId,
          reservationId,
          input.itemId,
          line.warehouseId,
          line.quantity,
          line.reasonCode,
          ...e.map(([, v]) => v),
        ],
      );
    return reservationId;
  }
  async counts(organizationId: number): Promise<StockCountRow[]> {
    const { rows } = await this.db.query(
      `SELECT count.id::int,count.code,warehouse.name warehouse,count.count_date::text,count.reference,count.status,count(line.id)::int items,count(line.id) FILTER(WHERE line.counted_quantity IS NOT NULL AND line.counted_quantity<>line.expected_quantity)::int adjustments FROM stock_count count JOIN warehouse ON warehouse.organization_id=count.organization_id AND warehouse.id=count.warehouse_id LEFT JOIN stock_count_line line ON line.organization_id=count.organization_id AND line.stock_count_id=count.id WHERE count.organization_id=$1 GROUP BY count.id,warehouse.name ORDER BY count.count_date DESC,count.id DESC`,
      [organizationId],
    );
    return rows.map((r: Record<string, unknown>) => ({
      id: Number(r.id),
      code: String(r.code),
      warehouse: String(r.warehouse),
      countDate: String(r.count_date),
      reference: String(r.reference ?? ""),
      items: Number(r.items),
      adjustments: Number(r.adjustments),
      status: r.status as StockCountRow["status"],
    }));
  }
  async count(
    organizationId: number,
    id: number,
  ): Promise<StockCountDetail | null> {
    const { rows } = await this.db.query(
      `SELECT count.*,count.count_date::text count_date_text,warehouse.name warehouse FROM stock_count count JOIN warehouse ON warehouse.organization_id=count.organization_id AND warehouse.id=count.warehouse_id WHERE count.organization_id=$1 AND count.id=$2`,
      [organizationId, id],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    const lines = await this.db.query(
      `SELECT line.id::int,line.item_id::int,item.sku,item.name item_name,line.expected_quantity::float8,line.counted_quantity::float8,line.reason_code FROM stock_count_line line JOIN item ON item.organization_id=line.organization_id AND item.id=line.item_id WHERE line.organization_id=$1 AND line.stock_count_id=$2 ORDER BY item.sku`,
      [organizationId, id],
    );
    return {
      id: Number(row.id),
      code: String(row.code),
      warehouseId: Number(row.warehouse_id),
      warehouse: String(row.warehouse),
      countDate: String(row.count_date_text),
      reference: String(row.reference ?? ""),
      notes: String(row.notes),
      status: row.status as StockCountDetail["status"],
      lines: lines.rows.map((line: Record<string, unknown>) => ({
        id: Number(line.id),
        itemId: Number(line.item_id),
        sku: String(line.sku),
        itemName: String(line.item_name),
        expectedQuantity: Number(line.expected_quantity),
        countedQuantity:
          line.counted_quantity == null ? null : Number(line.counted_quantity),
        variance:
          line.counted_quantity == null
            ? null
            : Number(line.counted_quantity) - Number(line.expected_quantity),
        reasonCode: line.reason_code as StockCountDetail["lines"][number]["reasonCode"],
      })),
      audit: audit(row),
    };
  }
  async nextCountCode(organizationId: number) {
    const r = await this.db.query(
      "SELECT COALESCE(MAX((substring(code from '[0-9]+$'))::int),0)+1 value FROM stock_count WHERE organization_id=$1",
      [organizationId],
    );
    return `INV-STCOUNT-${String(r.rows[0].value).padStart(6, "0")}`;
  }
  async createCount(
    organizationId: number,
    input: StockCountRequest,
    stamp: Record<string, unknown>,
  ) {
    const code = await this.nextCountCode(organizationId);
    const e = Object.entries(stamp);
    const r = await this.db.query(
      `INSERT INTO stock_count(organization_id,code,warehouse_id,count_date,status,reference,notes,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4::date,'DRAFT',$5,$6,${e.map((_, i) => `$${i + 7}`).join(",")}) RETURNING id::int`,
      [
        organizationId,
        code,
        input.warehouseId,
        input.countDate,
        input.reference?.trim() ?? "",
        input.notes ?? "",
        ...e.map(([, v]) => v),
      ],
    );
    const id = Number(r.rows[0].id);
    const positions = await this.positions(organizationId);
    const byItem = new Map(
      positions
        .filter((p) => p.warehouseId === input.warehouseId)
        .map((p) => [p.itemId, p.onHand]),
    );
    for (const line of input.lines) {
      await this.db.query(
        `INSERT INTO stock_count_line(organization_id,stock_count_id,item_id,expected_quantity,counted_quantity,reason_code,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,$5,$6,${e.map((_, i) => `$${i + 7}`).join(",")})`,
        [
          organizationId,
          id,
          line.itemId,
          byItem.get(line.itemId) ?? 0,
          line.countedQuantity,
          line.reasonCode,
          ...e.map(([, v]) => v),
        ],
      );
    }
    return id;
  }
  async saveCount(
    organizationId: number,
    id: number,
    input: StockCountRequest,
    status: "DRAFT" | "IN_PROGRESS",
    stamp: Record<string, unknown>,
  ) {
    const e = Object.entries(stamp);
    await this.db.query(
      `UPDATE stock_count SET warehouse_id=$3,count_date=$4::date,reference=$5,notes=$6,status=$7,${e.map(([k], i) => `${k}=$${i + 8}`).join(",")} WHERE organization_id=$1 AND id=$2 AND status!='COMPLETED'`,
      [
        organizationId,
        id,
        input.warehouseId,
        input.countDate,
        input.reference?.trim() ?? "",
        input.notes ?? "",
        status,
        ...e.map(([, v]) => v),
      ],
    );
    for (const line of input.lines)
      await this.db.query(
        "UPDATE stock_count_line SET counted_quantity=$4,reason_code=$5 WHERE organization_id=$1 AND stock_count_id=$2 AND item_id=$3",
        [organizationId, id, line.itemId, line.countedQuantity, line.reasonCode],
      );
  }
  async completeCount(
    organizationId: number,
    id: number,
    stamp: Record<string, unknown>,
  ) {
    const count = await this.count(organizationId, id);
    if (!count) return;
    const changes = count.lines.filter((line) => line.variance);
    if (changes.length)
      await this.insertTransaction(
        organizationId,
        "ADJUSTMENT",
        new Date().toISOString(),
        count.reference || undefined,
        count.notes || "Stocktake adjustment",
        changes.map((line) => ({
          itemId: line.itemId,
          warehouseId: count.warehouseId,
          quantity: line.variance!,
          reasonCode: line.reasonCode,
        })),
        stamp,
        [],
        {
          source: { type: "STOCK_COUNT", id },
        },
      );
    const e = Object.entries(stamp);
    await this.db.query(
      `UPDATE stock_count SET status='COMPLETED',completed_at=now(),${e.map(([k], i) => `${k}=$${i + 3}`).join(",")} WHERE organization_id=$1 AND id=$2`,
      [organizationId, id, ...e.map(([, v]) => v)],
    );
  }
  async deleteCount(
    organizationId: number,
    id: number,
    stamp: Record<string, unknown>,
  ) {
    const e = Object.entries(stamp);
    await this.db.query(
      `UPDATE stock_count SET deletion_date=now(),${e.map(([k], i) => `${k}=$${i + 3}`).join(",")} WHERE organization_id=$1 AND id=$2 AND status!='COMPLETED'`,
      [organizationId, id, ...e.map(([, v]) => v)],
    );
    await this.db.query(
      "DELETE FROM stock_count WHERE organization_id=$1 AND id=$2 AND status!='COMPLETED'",
      [organizationId, id],
    );
  }
}
