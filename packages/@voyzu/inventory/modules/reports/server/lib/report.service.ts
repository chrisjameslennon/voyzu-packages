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
export async function getInventoryReport(
  organizationId: number,
  key: InventoryReportKey,
): Promise<InventoryReport> {
  if (key === "items") {
    const rows = await listItems(organizationId);
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
  if (key === "stock-reservations") {
    const result = await getDb().query(
      `SELECT reservation.id,item.sku,item.name item_name,warehouse.name warehouse,reservation.quantity::float8,reservation.reference,reservation.status,reservation.reserved_at FROM inventory_reservation reservation JOIN item ON item.organization_id=reservation.organization_id AND item.id=reservation.item_id JOIN warehouse ON warehouse.organization_id=reservation.organization_id AND warehouse.id=reservation.warehouse_id WHERE reservation.organization_id=$1 ORDER BY reservation.reserved_at DESC`,
      [organizationId],
    );
    return {
      title: "Stock Reservations",
      headers: [
        "Date",
        "SKU",
        "Item Name",
        "Warehouse",
        "Quantity",
        "Reference",
        "Status",
      ],
      rows: result.rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        cells: [
          d(String(r.reserved_at)),
          String(r.sku),
          String(r.item_name),
          String(r.warehouse),
          n(Number(r.quantity)),
          String(r.reference ?? "—"),
          String(r.status),
        ],
      })),
    };
  }
  if (key === "stocktake-variance") {
    const counts = await listStockCounts(organizationId);
    return {
      title: "Stocktake Variance",
      headers: [
        "Count No.",
        "Warehouse",
        "Count Date",
        "Items",
        "Adjustments",
        "Status",
      ],
      rows: counts.map((r) => ({
        id: String(r.id),
        cells: [
          r.countNo,
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
      "Date",
      "Type",
      "SKU",
      "Item Name",
      "Warehouse",
      "Qty Change",
      "Source",
      "Reference",
    ],
    rows: filtered.map((r) => ({
      id: String(r.id),
      cells: [
        d(r.date),
        r.type,
        r.sku,
        r.itemName,
        r.warehouse,
        r.quantityChange === null ? "—" : n(r.quantityChange),
        r.source ?? "—",
        r.sourceId ?? r.reference ?? "—",
      ],
    })),
  };
}
