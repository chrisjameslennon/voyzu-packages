import "server-only";
import { Check } from "typebox/value";
import { CustomerConfigurationInputDto, type CustomerConfiguration, type CustomerConfigurationKind, customerConfigurationMeta } from "../../types/customer-configuration.dto";
import { listCustomers } from "./customer.service";
const memory = globalThis as typeof globalThis & { commercialCustomerConfiguration?: Map<number, Map<CustomerConfigurationKind, Map<string, CustomerConfiguration>>>; commercialCustomerConfigurationId?: number };
const store = memory.commercialCustomerConfiguration ??= new Map();
function assertKind(kind: CustomerConfigurationKind) { if (!Object.hasOwn(customerConfigurationMeta, kind)) throw new Error("Invalid customer configuration."); }
export function listCustomerConfiguration(organizationId: number, kind: CustomerConfigurationKind): CustomerConfiguration[] {
  assertKind(kind);
  const customers = listCustomers(organizationId);
  return [...store.get(organizationId)?.get(kind)?.values() ?? []].map((row) => {
    const usedBy = customers.filter((customer) => (kind === "categories" ? customer.categoryCode : customer.priceListCode) === row.code).map(({ id, code, name }) => ({ id, code, name }));
    const { discountPercentage, ...current } = row as CustomerConfiguration & { discountPercentage?: number };
    return structuredClone({ ...current, direction: row.direction ?? "decrease", method: row.method ?? "percentage", value: row.value ?? discountPercentage ?? 0, usedBy, count: usedBy.length });
  }).sort((a, b) => a.code.localeCompare(b.code));
}
export function getCustomerConfiguration(organizationId: number, kind: CustomerConfigurationKind, code: string) {
  return listCustomerConfiguration(organizationId, kind).find((row) => row.code === code) ?? null;
}
export function saveCustomerConfiguration(organizationId: number, kind: CustomerConfigurationKind, input: unknown, existingCode?: string) {
  assertKind(kind);
  if (!Check(CustomerConfigurationInputDto, input)) throw new Error("Supply a valid code, name and description.");
  if (Math.abs(input.value * 100 - Math.round(input.value * 100)) > 0.000001) throw new Error("Adjustment must have no more than two decimal places.");
  if (kind === "priceLists" && input.direction === "decrease" && input.method === "percentage" && input.value > 100) throw new Error("Percentage decreases cannot exceed 100%.");
  const value = { ...input, value: kind === "categories" ? 0 : input.value, code: input.code.trim().toUpperCase(), name: input.name.trim(), description: input.description.trim() };
  if (!value.name) throw new Error("Supply a name.");
  let organization = store.get(organizationId);
  let records = organization?.get(kind);
  const current = existingCode ? records?.get(existingCode) : undefined;
  if (existingCode && !current) throw new Error("The record no longer exists.");
  if (current && value.code !== current.code) throw new Error("Code cannot be changed.");
  if (!current && records?.has(value.code)) throw new Error("This code already exists.");
  if ([...records?.values() ?? []].some((row) => row.code !== current?.code && row.name.toLowerCase() === value.name.toLowerCase())) throw new Error("This name already exists.");
  if (!organization) { organization = new Map(); store.set(organizationId, organization); }
  if (!records) { records = new Map(); organization.set(kind, records); }
  records.set(value.code, { ...value, id: current?.id ?? (memory.commercialCustomerConfigurationId = (memory.commercialCustomerConfigurationId ?? 0) + 1), status: current?.status ?? "ACTIVE", createdAt: current?.createdAt ?? Date.now(), updatedAt: current ? Date.now() : undefined, count: 0, usedBy: [] });
  return getCustomerConfiguration(organizationId, kind, value.code)!;
}
export function transitionCustomerConfiguration(organizationId: number, kind: CustomerConfigurationKind, codes: string[], operation: "activate" | "deactivate" | "delete") {
  assertKind(kind);
  if (!Array.isArray(codes) || !codes.length || !codes.every((code) => typeof code === "string") || !["activate", "deactivate", "delete"].includes(operation)) throw new Error("Select records and a valid action.");
  const rows = codes.map((code) => getCustomerConfiguration(organizationId, kind, code));
  if (rows.some((row) => !row)) throw new Error("A selected record no longer exists.");
  if (operation !== "activate" && rows.some((row) => row!.count > 0)) throw new Error("This record is linked to customers. Update those customers first.");
  const records = store.get(organizationId)!.get(kind)!;
  for (const code of new Set(codes)) {
    if (operation === "delete") records.delete(code);
    else { const row = records.get(code)!; row.status = operation === "activate" ? "ACTIVE" : "INACTIVE"; row.updatedAt = Date.now(); }
  }
}
