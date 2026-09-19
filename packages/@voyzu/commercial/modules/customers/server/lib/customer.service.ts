import "server-only";
import { getCustomerConfiguration } from "./customer-configuration.service";
import { Check } from "typebox/value";
import { CustomerInputDto, emptyAddress, synchronizeCustomerAddresses, type Customer, type CustomerInput } from "../../types/customer.dto";
const memory = globalThis as typeof globalThis & { commercialPrototypeCustomers?: Map<number, Map<string, Customer>>; commercialCustomerNextId?: number };
const store = memory.commercialPrototypeCustomers ??= new Map();
function normalizeCustomer(row: Customer): Customer {
  // Preserve addresses from prototypes created before postal/shipping replaced primary.
  const legacy = row.addresses as Array<Omit<Customer["addresses"][number], "address_type"> & { address_type: string }>;
  const postal = legacy.find((address) => address.address_type === "POSTAL") ?? legacy.find((address) => address.address_type === "PRIMARY") ?? emptyAddress("POSTAL");
  const shipping = legacy.find((address) => address.address_type === "SHIPPING") ?? emptyAddress("SHIPPING");
  return { ...row, ...synchronizeCustomerAddresses({ ...row, categoryCode: row.categoryCode ?? null, priceListCode: row.priceListCode ?? null, usePostalAddressForShipping: row.usePostalAddressForShipping ?? false, addresses: [{ ...postal, address_type: "POSTAL" }, { ...shipping, address_type: "SHIPPING" }] }) };
}
export function listCustomers(organizationId: number): Customer[] {
  return structuredClone([...store.get(organizationId)?.values() ?? []].map(normalizeCustomer).sort((a, b) => a.code.localeCompare(b.code)));
}
export function getCustomer(organizationId: number, code: string): Customer | null {
  const row = store.get(organizationId)?.get(code);
  return row ? structuredClone(normalizeCustomer(row)) : null;
}
export function saveCustomer(organizationId: number, input: unknown, existingCode?: string): Customer {
  if (!Check(CustomerInputDto, input)) throw new Error("Supply a valid customer code, name and address fields.");
  const value: CustomerInput = { ...input, code: input.code.trim().toUpperCase(), name: input.name.trim(), primaryContactName: input.primaryContactName.trim(), email: input.email.trim(), notes: input.notes.trim(), addresses: input.addresses.map((address) => ({ ...address, address_line_1: address.address_line_1.trim(), address_line_2: address.address_line_2.trim(), city: address.city.trim(), region_or_state: address.region_or_state.trim(), postal_code: address.postal_code.trim() })) };
  if (!value.name) throw new Error("Supply a customer name.");
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) throw new Error("Supply a valid email address.");
  if (new Set(value.addresses.map((address) => address.address_type)).size !== value.addresses.length) throw new Error("Each address type can only appear once.");
  let records = store.get(organizationId);
  const current = existingCode ? records?.get(existingCode) : undefined;
  if (existingCode && !current) throw new Error("Customer no longer exists.");
  if (current && current.code !== value.code) throw new Error("Customer code cannot be changed.");
  if (!current && records?.has(value.code)) throw new Error("A customer with this code already exists.");
  if (["PRICE-LISTS", "PRICING", "CUSTOMER-CATEGORIES", "PRICING-CATEGORIES"].includes(value.code)) throw new Error("Choose a different customer code.");
  for (const [field, kind] of [["categoryCode", "categories"], ["priceListCode", "priceLists"]] as const) {
    if (value[field] && value[field] !== current?.[field] && getCustomerConfiguration(organizationId, kind, value[field])?.status !== "ACTIVE") throw new Error("Select an active " + (kind === "categories" ? "customer category." : "customer price list."));
  }
  const customer: Customer = { ...synchronizeCustomerAddresses(value), id: current?.id ?? (memory.commercialCustomerNextId = (memory.commercialCustomerNextId ?? 0) + 1), status: current?.status ?? "ACTIVE", createdAt: current?.createdAt ?? Date.now(), updatedAt: current ? Date.now() : undefined };
  if (!records) { records = new Map(); store.set(organizationId, records); }
  records.set(customer.code, customer);
  return structuredClone(customer);
}
export function transitionCustomers(organizationId: number, codes: string[], operation: "activate" | "deactivate" | "delete") {
  if (!Array.isArray(codes) || !codes.length || !codes.every((code) => typeof code === "string") || !["activate", "deactivate", "delete"].includes(operation)) throw new Error("Select customers and a valid action.");
  const records = store.get(organizationId);
  if (codes.some((code) => !records?.has(code))) throw new Error("A selected customer no longer exists.");
  for (const code of new Set(codes)) {
    if (operation === "delete") records!.delete(code);
    else { const customer = records!.get(code)!; customer.status = operation === "activate" ? "ACTIVE" : "INACTIVE"; customer.updatedAt = Date.now(); }
  }
}

export function changeCustomersCategory(organizationId: number, codes: string[], kind: "category" | "priceList", targetCode: string) {
  if (!Array.isArray(codes) || !codes.length || !codes.every((code) => typeof code === "string" && code.length > 0) || !["category", "priceList"].includes(kind) || typeof targetCode !== "string" || !targetCode) throw new Error("Select customers and a valid category or price list.");
  const target = getCustomerConfiguration(organizationId, kind === "category" ? "categories" : "priceLists", targetCode);
  if (!target || target.status !== "ACTIVE") throw new Error("Select an active " + (kind === "category" ? "customer category." : "customer price list."));
  const records = store.get(organizationId);
  const selected = [...new Set(codes)].map((code) => records?.get(code));
  if (selected.some((customer) => !customer)) throw new Error("A selected customer no longer exists.");
  const updatedAt = Date.now();
  for (const customer of selected) {
    if (!customer) continue;
    if (kind === "category") customer.categoryCode = targetCode;
    else customer.priceListCode = targetCode;
    customer.updatedAt = updatedAt;
  }
}
