import "server-only";
import type { ProductConfigurationKind, ProductConfigurationRowDto } from "../../types/product-configuration.dto";
import { productConfigurationReferences, renameProductCategory } from "./product.service";

const memory = globalThis as typeof globalThis & {
  commercialProductConfiguration?: Map<number, Map<ProductConfigurationKind, Map<string, ProductConfigurationRowDto>>>;
};
const store = memory.commercialProductConfiguration ??= new Map<number, Map<ProductConfigurationKind, Map<string, ProductConfigurationRowDto>>>();

export function upsertProductConfiguration(organizationId: number, kind: ProductConfigurationKind, input: Omit<ProductConfigurationRowDto, "id" | "count">) {
  if (kind === "lists" && !["BRAND", "MANUFACTURER", "SALES-UNIT"].includes(input.code)) throw new Error("Only the built-in product lists are supported.");
  let organization = store.get(organizationId);
  if (!organization) { organization = new Map(); store.set(organizationId, organization); }
  let records = organization.get(kind);
  if (!records) { records = new Map(); organization.set(kind, records); }
  const existing = records.get(input.code);
  const id = existing?.id ?? Math.max(0, ...Array.from(records.values(), (row) => row.id)) + 1;
  records.set(input.code, { ...input, values: [...input.values], id, count: input.values.length, createdAt: existing?.createdAt ?? Date.now(), updatedAt: existing ? Date.now() : undefined });
}

export async function listProductConfiguration(organizationId: number, kind: ProductConfigurationKind): Promise<ProductConfigurationRowDto[]> {
  const products = productConfigurationReferences(organizationId);
  return Array.from(store.get(organizationId)?.get(kind)?.values() ?? [], (row) => ({
    ...row,
    values: [...row.values],
    count: kind === "categories" ? products.filter((product) => product.category === row.name).length : row.values.length,
  })).sort((a, b) => a.id - b.id);
}

export function configurationUsage(organizationId: number, kind: ProductConfigurationKind, code: string, value?: string) {
 const row = store.get(organizationId)?.get(kind)?.get(code);
 if (!row) return [];
 const field = code === "BRAND" ? "brand" : code === "MANUFACTURER" ? "manufacturer" : code === "SALES-UNIT" ? "salesUnit" : null;
 return productConfigurationReferences(organizationId).filter((product) => kind === "categories" ? product.category === row.name : kind === "optionLists" ? product.options.some((option) => option.sourceListCode === code && (value === undefined || option.values.includes(value))) : field ? (value === undefined ? row.values.includes(product[field] ?? "") : product[field] === value) : false).map(({ id, code, name }) => ({ id, code, name }));
}
export async function getProductConfiguration(organizationId: number, kind: ProductConfigurationKind, code: string) {
 const record = (await listProductConfiguration(organizationId, kind)).find((row) => row.code === code);
 return record ? { ...record, usedBy: configurationUsage(organizationId, kind, code), valueUsage: Object.fromEntries(record.values.map((value) => [value, configurationUsage(organizationId, kind, code, value).length])) } : null;
}
export function saveProductConfiguration(organizationId: number, kind: ProductConfigurationKind, input: { code: string; name: string; description: string; values: string[] }, existingCode?: string) {
 if (kind === "lists" && !existingCode) throw new Error("Creating product lists is not supported. Edit an existing list instead.");
 const code = input.code.trim().toUpperCase(), name = input.name.trim(), values = input.values.map((value) => value.trim());
 const records = store.get(organizationId)?.get(kind); const current = existingCode ? records?.get(existingCode) : undefined;
 if (existingCode && !current) throw new Error("The record no longer exists.");
 if (current && code !== current.code) throw new Error("The code cannot be changed.");
 if (!current && records?.has(code)) throw new Error("A record with this code already exists.");
 if (Array.from(records?.values() ?? []).some((row) => row.code !== code && row.name.toLowerCase() === name.toLowerCase())) throw new Error("A record with this name already exists.");
 if (new Set(values.map((value) => value.toLowerCase())).size !== values.length) throw new Error("Values must be unique.");
 if (current && current.values.some((value) => !values.includes(value) && configurationUsage(organizationId, kind, code, value).length)) throw new Error("A value used by products cannot be removed or renamed. Update those products first.");
 if (current && kind === "categories" && current.name !== name) renameProductCategory(organizationId, current.name, name);
 upsertProductConfiguration(organizationId, kind, { code, name, description: input.description.trim(), values: kind === "categories" ? [] : values, status: current?.status ?? "ACTIVE" });
}
export function transitionProductConfiguration(organizationId: number, kind: ProductConfigurationKind, codes: string[], operation: "activate" | "deactivate" | "delete") {
 const records = store.get(organizationId)?.get(kind);
 if (!codes.length || codes.some((code) => !records?.has(code))) throw new Error("Select existing records.");
 if (operation !== "activate" && codes.some((code) => configurationUsage(organizationId, kind, code).length > 0)) throw new Error("Records used by products cannot be deactivated or deleted. Update those products first.");
 if (operation !== "activate" && kind === "lists" && codes.some((code) => ["BRAND", "MANUFACTURER", "SALES-UNIT"].includes(code))) throw new Error("Brand, Manufacturer and Sales Unit are required product lists.");
 for (const code of codes) { if (operation === "delete") records!.delete(code); else { const row = records!.get(code)!; row.status = operation === "activate" ? "ACTIVE" : "INACTIVE"; row.updatedAt = Date.now(); } }
}
