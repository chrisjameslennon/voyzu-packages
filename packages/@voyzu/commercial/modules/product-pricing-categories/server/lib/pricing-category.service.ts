import "server-only";
import type { PricingCategory, PricingCategoryInput } from "../../types/pricing-category.dto";
import { productPricingCategoryCounts } from "../../../products/server/lib/product.service";
const memory = globalThis as typeof globalThis & { commercialPricingCategories?: Map<number, Map<string, PricingCategory>> };
const store = memory.commercialPricingCategories ??= new Map<number, Map<string, PricingCategory>>();
export function listPricingCategories(organizationId: number): PricingCategory[] {
  const counts = productPricingCategoryCounts(organizationId);
  return Array.from(store.get(organizationId)?.values() ?? [], (row) => ({ ...row, count: counts[row.code] ?? 0 })).sort((a, b) => a.code.localeCompare(b.code));
}
export function savePricingCategory(organizationId: number, input: PricingCategoryInput, existingCode?: string): void {
  let records = store.get(organizationId);
  if (!records) { records = new Map(); store.set(organizationId, records); }
  const code = input.code.trim().toUpperCase(), name = input.name.trim();
  const current = existingCode ? records.get(existingCode) : undefined;
  if (existingCode && !current) throw new Error("Pricing category was not found.");
  if (current && code !== current.code) throw new Error("The pricing category code cannot be changed.");
  if (!current && records.has(code)) throw new Error("A pricing category with this code already exists.");
  if (Array.from(records.values()).some((row) => row.code !== code && row.name.toLowerCase() === name.toLowerCase())) throw new Error("A pricing category with this name already exists.");
  records.set(code, { id: current?.id ?? Math.max(0, ...Array.from(records.values(), (row) => row.id)) + 1, code, name, createdAt: current?.createdAt ?? Date.now(), updatedAt: current ? Date.now() : undefined, count: 0, status: current?.status ?? "ACTIVE" });
}
export function seedPricingCategory(organizationId: number, input: PricingCategoryInput) {
  savePricingCategory(organizationId, input, store.get(organizationId)?.has(input.code) ? input.code : undefined);
  store.get(organizationId)!.get(input.code)!.status = "ACTIVE";
}
export function transitionPricingCategories(organizationId: number, codes: string[], operation: "activate" | "deactivate" | "delete") {
  const records = store.get(organizationId);
  const rows = listPricingCategories(organizationId).filter((row) => codes.includes(row.code));
  if (!codes.length || rows.length !== new Set(codes).size) throw new Error("Select existing pricing categories.");
  if (operation === "delete" && rows.some((row) => row.count > 0)) throw new Error("Pricing categories assigned to products cannot be deleted. Reassign their products first.");
  for (const row of rows) {
    if (operation === "delete") records!.delete(row.code);
    else { const record = records!.get(row.code)!; record.status = operation === "activate" ? "ACTIVE" : "INACTIVE"; record.updatedAt = Date.now(); }
  }
}
