import type { FinanceInventoryActivity } from "../types/index";

export interface InventoryTransactionProjectionLine {
  id: number;
  itemId: number;
  sku: string;
  itemName: string;
  warehouseId: number;
  warehouse: string;
  quantityChange: number;
  reasonCode: string | null;
}

export interface InventoryTransactionProjectionLink {
  documentType: string;
  documentId: number;
  documentCode: string;
  creationDate: string;
  href: string | null;
}

export interface InventoryTransactionProjection {
  id: number;
  code: string;
  date: string;
  type: string;
  reference: string | null;
  notes: string;
  linkedDocuments: InventoryTransactionProjectionLink[];
  lines: InventoryTransactionProjectionLine[];
  audit: FinanceInventoryActivity["audit"];
}

export interface InventoryTransactionProjectionOrganization {
  code: string;
  name: string;
  countryCode: string;
  country?: { name: string } | null;
  baseCurrencyCode: string;
}
