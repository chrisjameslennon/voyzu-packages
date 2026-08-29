import type { DbExecutor } from "@voyzu/capability/db";
import type {
  AdjustmentRequest,
  MovementRequest,
  ReservationRequest,
  StockActivity,
  StockCountDetail,
  StockCountRequest,
  StockCountRow,
  StockCustomFieldInput,
  StockOption,
  StockPosition,
  TransferRequest,
} from "../../types/stock.types";
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
        "SELECT id::int, code, name FROM warehouse WHERE organization_id=$1 AND status='ACTIVE' ORDER BY name",
        [organizationId],
      ),
    ]);
    return {
      items: items.rows as StockOption[],
      warehouses: warehouses.rows as StockOption[],
    };
  }
  async positions(organizationId: number): Promise<StockPosition[]> {
    const { rows } = await this.db.query(
      `WITH movement AS (SELECT item_id,warehouse_id,sum(quantity_change)::float8 on_hand FROM inventory_transaction_line WHERE organization_id=$1 GROUP BY item_id,warehouse_id), reservation AS (SELECT item_id,warehouse_id,sum(quantity)::float8 reserved FROM inventory_reservation WHERE organization_id=$1 AND status='ACTIVE' GROUP BY item_id,warehouse_id), pairs AS (SELECT item_id,warehouse_id FROM movement UNION SELECT item_id,warehouse_id FROM reservation) SELECT pairs.item_id::int,pairs.warehouse_id::int,item.sku,item.name item_name,item.unit,warehouse.name warehouse_name,coalesce(movement.on_hand,0)::float8 on_hand,coalesce(reservation.reserved,0)::float8 reserved FROM pairs JOIN item ON item.organization_id=$1 AND item.id=pairs.item_id JOIN warehouse ON warehouse.organization_id=$1 AND warehouse.id=pairs.warehouse_id LEFT JOIN movement USING(item_id,warehouse_id) LEFT JOIN reservation USING(item_id,warehouse_id) ORDER BY item.sku,warehouse.name`,
      [organizationId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.item_id) * 1000000 + Number(row.warehouse_id),
      itemId: Number(row.item_id),
      sku: String(row.sku),
      itemName: String(row.item_name),
      unit: row.unit == null ? null : String(row.unit),
      warehouseId: Number(row.warehouse_id),
      warehouseName: String(row.warehouse_name),
      onHand: Number(row.on_hand),
      reserved: Number(row.reserved),
      available: Number(row.on_hand) - Number(row.reserved),
    }));
  }
  async activity(organizationId: number): Promise<StockActivity[]> {
    const { rows } = await this.db.query(
      `SELECT * FROM (
        SELECT line.id::int,transaction.transaction_date date,transaction.transaction_type type,item.sku,item.name item_name,warehouse.name warehouse,line.quantity_change::float8,transaction.source_business_object source,transaction.source_id,transaction.reference
        FROM inventory_transaction_line line
        JOIN inventory_transaction transaction ON transaction.organization_id=line.organization_id AND transaction.id=line.inventory_transaction_id
        JOIN item ON item.organization_id=line.organization_id AND item.id=line.item_id
        JOIN warehouse ON warehouse.organization_id=line.organization_id AND warehouse.id=line.warehouse_id
        WHERE line.organization_id=$1
        UNION ALL
        SELECT (-reservation.id)::int,reservation.reserved_at,CASE WHEN reservation.status='RELEASED' THEN 'RESERVATION RELEASE' ELSE 'RESERVATION' END,item.sku,item.name,warehouse.name,NULL::float8,NULL::float8,reservation.source_business_object,reservation.source_id,reservation.reference
        FROM inventory_reservation reservation
        JOIN item ON item.organization_id=reservation.organization_id AND item.id=reservation.item_id
        JOIN warehouse ON warehouse.organization_id=reservation.organization_id AND warehouse.id=reservation.warehouse_id
        WHERE reservation.organization_id=$1
      ) activity ORDER BY date DESC,id DESC`,
      [organizationId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      date: new Date(String(row.date)).toISOString(),
      type: String(row.type),
      sku: String(row.sku),
      itemName: String(row.item_name),
      warehouse: String(row.warehouse),
      quantityChange:
        row.quantity_change == null ? null : Number(row.quantity_change),
      source: row.source == null ? null : String(row.source),
      sourceId: row.source_id == null ? null : String(row.source_id),
      reference: row.reference == null ? null : String(row.reference),
    }));
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
    }>,
    stamp: Record<string, unknown>,
    customFields: StockCustomFieldInput[] = [],
  ) {
    const e = Object.entries(stamp);
    const result = await this.db.query(
      `INSERT INTO inventory_transaction(organization_id,transaction_type,transaction_date,reference,notes,source_business_object,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3::timestamptz,$4,$5,'INVENTORY_${type}',${e.map((_, i) => `$${i + 6}`).join(",")}) RETURNING id::int`,
      [
        organizationId,
        type,
        date,
        reference ?? null,
        notes ?? "",
        ...e.map(([, v]) => v),
      ],
    );
    const transactionId = Number(result.rows[0].id);
    for (const line of lines)
      await this.db.query(
        `INSERT INTO inventory_transaction_line(organization_id,inventory_transaction_id,item_id,warehouse_id,quantity_change,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,$5,${e.map((_, i) => `$${i + 6}`).join(",")})`,
        [
          organizationId,
          transactionId,
          line.itemId,
          line.warehouseId,
          line.quantity,
          ...e.map(([, v]) => v),
        ],
      );
    for (const field of customFields) {
      const definition = await this.db.query(
        "SELECT data_type FROM custom_field WHERE organization_id=$1 AND id=$2 AND status='ACTIVE'",
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
          `INSERT INTO custom_field_value(organization_id,custom_field_id,record_id,${valueEntries.map(([key]) => key).join(",")},${e.map(([key]) => key).join(",")}) VALUES($1,$2,$3,${valueEntries.map((_, index) => `$${index + 4}`).join(",")},${e.map((_, index) => `$${index + valueEntries.length + 4}`).join(",")})`,
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
    input: MovementRequest,
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
      input.notes,
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
    for (const line of input.lines)
      await this.db.query(
        `INSERT INTO inventory_reservation(organization_id,item_id,warehouse_id,quantity,reference,status,reserved_at,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,$5,'ACTIVE',now(),${e.map((_, i) => `$${i + 6}`).join(",")})`,
        [
          organizationId,
          input.itemId,
          line.warehouseId,
          line.quantity,
          input.reference,
          ...e.map(([, v]) => v),
        ],
      );
  }
  async counts(organizationId: number): Promise<StockCountRow[]> {
    const { rows } = await this.db.query(
      `SELECT count.id::int,count.count_no,warehouse.name warehouse,count.count_date::text,count.status,count(line.id)::int items,count(line.id) FILTER(WHERE line.counted_quantity IS NOT NULL AND line.counted_quantity<>line.expected_quantity)::int adjustments FROM stock_count count JOIN warehouse ON warehouse.organization_id=count.organization_id AND warehouse.id=count.warehouse_id LEFT JOIN stock_count_line line ON line.organization_id=count.organization_id AND line.stock_count_id=count.id WHERE count.organization_id=$1 GROUP BY count.id,warehouse.name ORDER BY count.count_date DESC,count.id DESC`,
      [organizationId],
    );
    return rows.map((r: Record<string, unknown>) => ({
      id: Number(r.id),
      countNo: String(r.count_no),
      warehouse: String(r.warehouse),
      countDate: String(r.count_date),
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
      `SELECT count.*,warehouse.name warehouse FROM stock_count count JOIN warehouse ON warehouse.organization_id=count.organization_id AND warehouse.id=count.warehouse_id WHERE count.organization_id=$1 AND count.id=$2`,
      [organizationId, id],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    const lines = await this.db.query(
      `SELECT line.id::int,line.item_id::int,item.sku,item.name item_name,line.expected_quantity::float8,line.counted_quantity::float8 FROM stock_count_line line JOIN item ON item.organization_id=line.organization_id AND item.id=line.item_id WHERE line.organization_id=$1 AND line.stock_count_id=$2 ORDER BY item.sku`,
      [organizationId, id],
    );
    return {
      id: Number(row.id),
      countNo: String(row.count_no),
      warehouseId: Number(row.warehouse_id),
      warehouse: String(row.warehouse),
      countDate: String(row.count_date),
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
      })),
      audit: audit(row),
    };
  }
  async nextCountNo(organizationId: number) {
    const r = await this.db.query(
      "SELECT COALESCE(MAX((substring(count_no from '[0-9]+$'))::int),0)+1 value FROM stock_count WHERE organization_id=$1",
      [organizationId],
    );
    return `COUNT-${String(r.rows[0].value).padStart(6, "0")}`;
  }
  async createCount(
    organizationId: number,
    input: StockCountRequest,
    stamp: Record<string, unknown>,
  ) {
    const no = await this.nextCountNo(organizationId);
    const e = Object.entries(stamp);
    const r = await this.db.query(
      `INSERT INTO stock_count(organization_id,count_no,warehouse_id,count_date,status,notes,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4::date,'DRAFT',$5,${e.map((_, i) => `$${i + 6}`).join(",")}) RETURNING id::int`,
      [
        organizationId,
        no,
        input.warehouseId,
        input.countDate,
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
    const opts = await this.options(organizationId);
    for (const item of opts.items) {
      const counted =
        input.lines.find((line) => line.itemId === item.id)?.countedQuantity ??
        null;
      await this.db.query(
        `INSERT INTO stock_count_line(organization_id,stock_count_id,item_id,expected_quantity,counted_quantity,${e.map(([k]) => k).join(",")}) VALUES($1,$2,$3,$4,$5,${e.map((_, i) => `$${i + 6}`).join(",")})`,
        [
          organizationId,
          id,
          item.id,
          byItem.get(item.id) ?? 0,
          counted,
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
      `UPDATE stock_count SET warehouse_id=$3,count_date=$4::date,notes=$5,status=$6,${e.map(([k], i) => `${k}=$${i + 7}`).join(",")} WHERE organization_id=$1 AND id=$2 AND status!='COMPLETED'`,
      [
        organizationId,
        id,
        input.warehouseId,
        input.countDate,
        input.notes ?? "",
        status,
        ...e.map(([, v]) => v),
      ],
    );
    for (const line of input.lines)
      await this.db.query(
        "UPDATE stock_count_line SET counted_quantity=$4 WHERE organization_id=$1 AND stock_count_id=$2 AND item_id=$3",
        [organizationId, id, line.itemId, line.countedQuantity],
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
        count.countNo,
        "Stocktake adjustment",
        changes.map((line) => ({
          itemId: line.itemId,
          warehouseId: count.warehouseId,
          quantity: line.variance!,
        })),
        stamp,
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
