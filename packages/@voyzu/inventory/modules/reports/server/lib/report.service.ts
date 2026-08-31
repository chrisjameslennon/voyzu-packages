import { getDb } from "@voyzu/capability/db";
import type {
  InventoryReport,
  InventoryReportKey,
} from "../../types/report.types";
import { listConfiguration } from "../../../configuration/server/lib/configuration.service";
import { listItems } from "../../../items/server/lib/item.service";
import {
  listStockActivity,
  listStockCounts,
  listStockPositions,
} from "../../../stock/server/lib/stock.service";
const n = (value: number) => String(value);
const d = (value: string) => new Date(value).toLocaleDateString("en-NZ");

type CustomFieldDefinition = {
  id: number;
  name: string;
  dataType: string;
};

function customFieldValue(
  definition: CustomFieldDefinition,
  values: Array<Record<string, unknown>>,
): string {
  if (!values.length) return "—";
  if (definition.dataType === "TEXT")
    return String(values[0]?.text_value ?? "—");
  if (definition.dataType === "NUMBER")
    return values[0]?.number_value == null
      ? "—"
      : String(values[0].number_value);
  if (definition.dataType === "DATE")
    return values[0]?.date_value == null
      ? "—"
      : d(String(values[0].date_value));
  if (definition.dataType === "BOOLEAN")
    return values[0]?.boolean_value == null
      ? "—"
      : values[0].boolean_value
        ? "Yes"
        : "No";
  const selected = values
    .map((value) => value.option_value)
    .filter((value): value is string => typeof value === "string");
  return selected.length ? selected.join(", ") : "—";
}

async function itemCustomFields(
  organizationId: number,
  itemIds: number[],
): Promise<Map<number, Array<{ label: string; value: string }>>> {
  const db = getDb();
  const [{ rows: definitionRows }, { rows: valueRows }] = await Promise.all([
    db.query(
      `SELECT id::int, name, data_type
       FROM inv_custom_field
       WHERE organization_id = $1 AND applies_to = 'ITEM' AND status = 'ACTIVE'
       ORDER BY name`,
      [organizationId],
    ),
    db.query(
      `SELECT field_value.record_id::int, field_value.custom_field_id::int,
              field_value.text_value, field_value.number_value, field_value.date_value,
              field_value.boolean_value, option_value.value AS option_value
       FROM inv_custom_field_value field_value
       JOIN inv_custom_field field
         ON field.organization_id = field_value.organization_id
        AND field.id = field_value.custom_field_id
       LEFT JOIN inv_option_list_value option_value
         ON option_value.organization_id = field_value.organization_id
        AND option_value.id = field_value.option_list_value_id
       WHERE field_value.organization_id = $1
         AND field.applies_to = 'ITEM'
         AND field.status = 'ACTIVE'
       ORDER BY field_value.record_id, field.name, field_value.id`,
      [organizationId],
    ),
  ]);
  const definitions = (definitionRows as Record<string, unknown>[]).map(
    (row): CustomFieldDefinition => ({
      id: Number(row.id),
      name: String(row.name),
      dataType: String(row.data_type),
    }),
  );
  const valuesByItemAndField = new Map<string, Array<Record<string, unknown>>>();
  for (const row of valueRows as Record<string, unknown>[]) {
    const key = `${Number(row.record_id)}:${Number(row.custom_field_id)}`;
    const values = valuesByItemAndField.get(key) ?? [];
    values.push(row);
    valuesByItemAndField.set(key, values);
  }
  return new Map(
    itemIds.map((itemId) => [
      itemId,
      definitions.map((definition) => ({
        label: definition.name,
        value: customFieldValue(
          definition,
          valuesByItemAndField.get(`${itemId}:${definition.id}`) ?? [],
        ),
      })),
    ]),
  );
}
export async function getInventoryReport(
  organizationId: number,
  key: InventoryReportKey,
): Promise<InventoryReport> {
  if (key === "items") {
    const rows = await listItems(organizationId);
    const customFields = await itemCustomFields(
      organizationId,
      rows.map(({ id }) => id),
    );
    return {
      title: "Items",
      headers: [
        "SKU",
        "Item Name",
        "Category",
        "Type",
        "Unit",
        "Quantity Tracked",
        "Status",
      ],
      rows: rows.map((r) => ({
        id: String(r.id),
        inactive: r.status === "INACTIVE",
        details: customFields.get(r.id) ?? [],
        cells: [
          r.sku,
          r.name,
          r.category ?? "—",
          r.itemType === "ASSEMBLY" ? "Assembly" : "Item",
          r.unit ?? "—",
          r.quantityTracked ? "Yes" : "No",
          r.status,
        ],
      })),
    };
  }
  if (key === "item-categories") {
    const rows = await listConfiguration(organizationId, "category");
    return {
      title: "Item Categories",
      headers: ["Code", "Category Name", "Description", "Items", "Status"],
      rows: rows.map((r) => ({
        id: String(r.id),
        cells: [r.code ?? "", r.name, r.description, n(r.count), r.status],
      })),
    };
  }
  const positions = await listStockPositions(organizationId);
  if (key === "stock-on-hand" || key === "stock-availability")
    return {
      title: key === "stock-on-hand" ? "Stock on Hand" : "Stock Availability",
      headers: [
        "SKU",
        "Item Name",
        "Warehouse",
        "On Hand",
        ...(key === "stock-availability" ? ["Reserved", "Available"] : []),
      ],
      rows: positions.map((r) => ({
        id: String(r.id),
        cells: [
          r.sku,
          r.itemName,
          r.warehouseName,
          n(r.onHand),
          ...(key === "stock-availability"
            ? [n(r.reserved), n(r.available)]
            : []),
        ],
      })),
    };
  if (key === "stock-reservation-activity") {
    const result = await getDb().query(
      `SELECT line.id,reservation.code,item.sku,item.name item_name,warehouse.name warehouse,line.quantity_change::float8,reservation.reference,reservation.reserved_at,reservation.source_business_object,CASE WHEN reservation.source_business_object='STOCK_COUNT' THEN (SELECT count.code FROM stock_count count WHERE count.organization_id=reservation.organization_id AND count.id=reservation.source_id) ELSE NULL END source_code FROM inventory_reservation reservation JOIN inventory_reservation_line line ON line.organization_id=reservation.organization_id AND line.inventory_reservation_id=reservation.id JOIN item ON item.organization_id=line.organization_id AND item.id=line.item_id JOIN warehouse ON warehouse.organization_id=line.organization_id AND warehouse.id=line.warehouse_id WHERE reservation.organization_id=$1 ORDER BY reservation.creation_date DESC,reservation.id DESC,line.id`,
      [organizationId],
    );
    return {
      title: "Stock Reservation Activity",
      headers: [
        "Date",
        "Reservation Code",
        "SKU",
        "Item Name",
        "Warehouse",
        "Quantity Change",
        "Reference",
        "Source",
        "Source Code",
      ],
      rows: result.rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        cells: [
          d(String(r.reserved_at)),
          String(r.code),
          String(r.sku),
          String(r.item_name),
          String(r.warehouse),
          n(Number(r.quantity_change)),
          String(r.reference ?? "—"),
          String(r.source_business_object ?? "—"),
          String(r.source_code ?? "—"),
        ],
      })),
    };
  }
  if (key === "stocktake-variance") {
    const counts = await listStockCounts(organizationId);
    return {
      title: "Stocktake Variance",
      headers: [
        "Code",
        "Warehouse",
        "Count Date",
        "Items",
        "Adjustments",
        "Status",
      ],
      rows: counts.map((r) => ({
        id: String(r.id),
        cells: [
          r.code,
          r.warehouse,
          d(r.countDate),
          n(r.items),
          n(r.adjustments),
          r.status.replace("_", " "),
        ],
      })),
    };
  }
  const activity = await listStockActivity(organizationId);
  const filtered =
    key === "stock-transfers"
      ? activity.filter((r) => r.type === "TRANSFER")
      : key === "quantity-adjustments"
        ? activity.filter((r) => r.type === "ADJUSTMENT")
        : activity;
  return {
    title:
      key === "stock-transfers"
        ? "Stock Transfers"
        : key === "quantity-adjustments"
          ? "Quantity Adjustments"
          : "Stock Activity",
    headers: [
      "Code",
      "Date",
      "Type",
      "Lines",
      "Reference",
      "Source",
      "Source Code",
    ],
    rows: filtered.map((r) => ({
      id: String(r.id),
      cells: [
        r.code,
        d(r.date),
        r.type,
        n(r.lineCount),
        r.reference ?? "—",
        r.source ?? "—",
        r.sourceCode ?? "—",
      ],
    })),
  };
}
