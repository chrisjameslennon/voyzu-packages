import { InventoryReportRepo } from "../db/report.repo";
import { getDb } from "@voyzu/capability/db";
import type {
  InventoryReport,
  InventoryReportKey,
} from "../../types/report.types";
import { listConfiguration } from "../../../configuration/server/lib/configuration.service";
import { listItems } from "../../../items/server/lib/item.service";
import {
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

async function recordCustomFields(
  organizationId: number,
  appliesTo: "ITEM" | "RECEIPT" | "ISSUE",
  recordIds: number[],
): Promise<Map<number, Array<{ label: string; value: string }>>> {
  const db = getDb();
  const [{ rows: definitionRows }, { rows: valueRows }] = await Promise.all([
    new InventoryReportRepo(db).listCustomFieldDefinitions(organizationId, appliesTo),
    new InventoryReportRepo(db).listCustomFieldValues(organizationId, appliesTo, recordIds),
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
    recordIds.map((recordId) => [
      recordId,
      definitions.map((definition) => ({
        label: definition.name,
        value: customFieldValue(
          definition,
          valuesByItemAndField.get(`${recordId}:${definition.id}`) ?? [],
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
    const customFields = await recordCustomFields(
      organizationId,
      "ITEM",
      rows.map(({ id }) => id),
    );
    return {
      title: "Items",
      headers: [
        "SKU",
        "Item Name",
        "Category",
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
        inactive: r.status === "INACTIVE",
        cells: [r.code ?? "", r.name, r.description, n(r.count), r.status],
      })),
    };
  }
  if (key === "financial-activity") {
    const result = await new InventoryReportRepo(getDb()).listFinancialActivity(organizationId);
    return {
      title: "Financial Activity",
      headers: [
        "Code",
        "Date",
        "Movement",
        "Reason Code",
        "Item Code",
        "Item Name",
        "Warehouse",
        "Quantity Change",
        "Status",
      ],
      rows: result.rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        date: new Date(String(r.date)).toISOString().slice(0, 10),
        cells: [
          String(r.code),
          d(String(r.date)),
          String(r.movement_type),
          String(r.reason_code),
          String(r.item_code),
          String(r.item_name),
          String(r.warehouse),
          n(Number(r.quantity_change)),
          String(r.status),
        ],
      })),
    };
  }
  const positions = await listStockPositions(organizationId);
  if (key === "stock-on-hand" || key === "stock-availability") {
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
        inactive: r.itemStatus === "INACTIVE",
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
  }
  if (key === "stock-reservation-activity") {
    const result = await new InventoryReportRepo(getDb()).listReservationActivity(organizationId);
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
      ],
      rows: result.rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        date: new Date(String(r.reserved_at)).toISOString().slice(0, 10),
        cells: [
          d(String(r.reserved_at)),
          String(r.code),
          String(r.item_code),
          String(r.item_name),
          String(r.warehouse),
          n(Number(r.quantity_change)),
          String(r.reference ?? "—"),
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
        "Reference",
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
          r.reference || "—",
          r.warehouse,
          d(r.countDate),
          n(r.items),
          n(r.adjustments),
          r.status.replace("_", " "),
        ],
      })),
    };
  }
  const activityResult = await new InventoryReportRepo(getDb()).listStockActivity(organizationId);
  const activity = activityResult.rows as Record<string, unknown>[];
  const filtered =
    key === "stock-issuances"
      ? activity.filter((r) => r.type === "ISSUE")
      : key === "stock-receipts"
        ? activity.filter((r) => r.type === "RECEIPT")
        : key === "stock-transfers"
          ? activity.filter((r) => r.type === "TRANSFER")
          : key === "quantity-adjustments"
            ? activity.filter((r) => r.type === "ADJUSTMENT")
            : activity;
  const transactionCustomFields =
    key === "stock-issuances" || key === "stock-receipts"
      ? await recordCustomFields(
          organizationId,
          key === "stock-issuances" ? "ISSUE" : "RECEIPT",
          [...new Set(filtered.map((row) => Number(row.transaction_id)))],
        )
      : null;
  return {
    title:
      key === "stock-issuances"
        ? "Stock Issuances"
        : key === "stock-receipts"
          ? "Stock Receipts"
          : key === "stock-transfers"
            ? "Stock Transfers"
            : key === "quantity-adjustments"
              ? "Quantity Adjustments"
              : "Stock Activity",
    headers: [
      "Code",
      "Date",
      "Type",
      "Item Code",
      "Item Name",
      "Warehouse",
      "Quantity Change",
      "Reference",
    ],
    rows: filtered.map((r) => ({
      id: String(r.id),
      date: new Date(String(r.date)).toISOString().slice(0, 10),
      details:
        transactionCustomFields?.get(Number(r.transaction_id)) ?? undefined,
      cells: [
        String(r.code),
        d(String(r.date)),
        String(r.type),
        String(r.item_code),
        String(r.item_name),
        String(r.warehouse),
        n(Number(r.quantity_change)),
        String(r.reference ?? "—"),
      ],
    })),
  };
}
