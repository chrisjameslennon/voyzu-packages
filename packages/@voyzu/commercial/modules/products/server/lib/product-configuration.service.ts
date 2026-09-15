import "server-only";
import type { ProductConfigurationKind, ProductConfigurationRowDto } from "../../types/product-configuration.dto";
import { listProducts } from "./product.service";

const memory = globalThis as typeof globalThis & {
  commercialProductConfiguration?: Map<number, Map<ProductConfigurationKind, Map<string, ProductConfigurationRowDto>>>;
};
const store = memory.commercialProductConfiguration ??= new Map<number, Map<ProductConfigurationKind, Map<string, ProductConfigurationRowDto>>>();

export function upsertProductConfiguration(organizationId: number, kind: ProductConfigurationKind, input: Omit<ProductConfigurationRowDto, "id" | "count">) {
  let organization = store.get(organizationId);
  if (!organization) { organization = new Map(); store.set(organizationId, organization); }
  let records = organization.get(kind);
  if (!records) { records = new Map(); organization.set(kind, records); }
  const existing = records.get(input.code);
  const id = existing?.id ?? Math.max(0, ...Array.from(records.values(), (row) => row.id)) + 1;
  records.set(input.code, { ...input, values: [...input.values], id, count: input.values.length });
}

export async function listProductConfiguration(organizationId: number, kind: ProductConfigurationKind): Promise<ProductConfigurationRowDto[]> {
  const products = kind === "categories" ? await listProducts(organizationId) : [];
  return Array.from(store.get(organizationId)?.get(kind)?.values() ?? [], (row) => ({
    ...row,
    values: [...row.values],
    count: kind === "categories" ? products.filter((product) => product.category === row.name).length : row.values.length,
  })).sort((a, b) => a.id - b.id);
}
