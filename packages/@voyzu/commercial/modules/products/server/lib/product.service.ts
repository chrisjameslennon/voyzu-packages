import { createEmptyRichTextDocument, parseRichTextDocument, readRichTextDocument } from "@voyzu/ui-components/rich-text-editor/document";
import "server-only";
import { loadInventoryItems, getInventoryLinks, saveInventoryLinks } from "./product-inventory.service";

import type { ProductListRowDto } from "../../types/product-list.dto";
import type { ProductDetail, ProductEditDto } from "../../types/product-detail.dto";
import { combinationKey, variantMatchesOptions } from "../../domain/product-variants";

// Prototype storage is process-local, scoped by organization, and starts empty.
type PrototypeProduct = Omit<ProductListRowDto, "numberOfVariants" | "itemSku"> & {
  manufacturer: string;
  detail?: ProductEditDto;
  createdAt: number;
  updatedAt?: number;
  defaultVariant: { id: number; sku: string; basePrice?: number | null; status: ProductListRowDto["status"] };
};
const prototypeGlobal = globalThis as typeof globalThis & {
  commercialPrototypeProducts?: Map<number, Map<number, PrototypeProduct>>;
};
const productsByOrganization: Map<number, Map<number, PrototypeProduct>> =
  prototypeGlobal.commercialPrototypeProducts ??= new Map<number, Map<number, PrototypeProduct>>();

export async function upsertSampleProduct(
  organizationId: number,
  input: Omit<ProductListRowDto, "id" | "numberOfVariants" | "itemSku"> & { manufacturer: string; sampleDetails?: Pick<ProductEditDto, "shortDescription" | "description" | "customFields"> },
): Promise<void> {
  let products = productsByOrganization.get(organizationId);
  if (!products) {
    products = new Map();
    productsByOrganization.set(organizationId, products);
  }
  const existing = Array.from(products.values()).find((product) => product.code === input.code);
  const id = existing?.id ?? Math.max(0, ...products.keys()) + 1;
  const product = input;
  saveInventoryLinks(organizationId, input.code, {});
  products.set(id, {
    ...product,
    id,
    createdAt: existing?.createdAt ?? Date.now(),
    defaultVariant: { id: existing?.defaultVariant.id ?? id, sku: product.code, basePrice: product.basePrice, status: product.status },
    detail: {
      useVariants: false,
      variantPricing: "BASE_PRICE",
      name: product.name, type: product.type, category: product.category, brand: product.brand,
      manufacturer: product.manufacturer, salesUnit: product.salesUnit, status: product.status,
      shortDescription: input.sampleDetails?.shortDescription ?? "", description: input.sampleDetails?.description ?? createEmptyRichTextDocument(), images: [], options: [],
      variants: [{ id: String(existing?.defaultVariant.id ?? id), sku: product.code, basePrice: product.basePrice, status: product.status, options: {}, imagePath: "" }],
      basePrice: product.basePrice, pricingCategoryCode: product.pricingCategoryCode, customFields: input.sampleDetails?.customFields ?? [],
    },
  });
}

export async function listProducts(organizationId: number): Promise<ProductListRowDto[]> {
  const products = productsByOrganization.get(organizationId);
  if (!products) return [];
  const items = await loadInventoryItems(organizationId);
  return (await Promise.all(Array.from(products.values(), async (product) => ({
    id: product.id, code: product.code, name: product.name, type: product.type,
    category: product.category, brand: product.brand, salesUnit: product.salesUnit, basePrice: (await getProduct(organizationId, product.code))!.basePrice,
    pricingCategoryCode: product.detail ? product.detail.pricingCategoryCode ?? null : product.pricingCategoryCode ?? null,
    itemSku: [...new Set(Object.entries(getInventoryLinks(organizationId, product.code)).filter(([id]) => product.detail?.useVariants ? product.detail.variants.some((v) => v.id === id && Object.keys(v.options).length > 0) : id === (product.detail?.variants.find((v) => !Object.keys(v.options).length)?.id ?? String(product.defaultVariant.id))).map(([, itemId]) => items?.find((item) => item.id === itemId)?.sku).filter(Boolean))].join(", ") || null,
    status: product.status, numberOfVariants: product.detail?.useVariants ? product.detail.variants.filter((variant) => Object.keys(variant.options).length > 0).length : 1,
  }))))
    .sort((left, right) => left.code.localeCompare(right.code));
}

export function getActiveProductMetrics(organizationId: number, since: number, until: number) {
  const products = Array.from(productsByOrganization.get(organizationId)?.values() ?? []);
  const active = products.filter((product) => product.status === "ACTIVE");
  return { total: active.length, change: active.filter((product) => product.createdAt >= since && product.createdAt < until).length };
}

export async function getProduct(organizationId: number, code: string): Promise<ProductDetail | null> {
  const product = Array.from(productsByOrganization.get(organizationId)?.values() ?? []).find((row) => row.code === code);
  if (!product) return null;
  // Normalize the earlier prototype's pricing shape while its process remains alive.
  const previous = product.detail as (ProductEditDto & { prices?: { price: number }[]; priceListCode?: string | null }) | undefined;
  const legacyVariant = product.defaultVariant as typeof product.defaultVariant & { price?: number };
  const basePrice = previous?.basePrice ?? previous?.prices?.[0]?.price ?? product.basePrice ?? legacyVariant.price ?? 0;
  const { prices: _legacyPrices, priceListCode: _legacyPriceListCode, ...previousDetail } = previous ?? {};
  const detail: ProductEditDto = previous ? { ...previousDetail, basePrice } as ProductEditDto : {
    useVariants: false, variantPricing: "BASE_PRICE",
    name: product.name, type: product.type, category: product.category, brand: product.brand,
    manufacturer: product.manufacturer ?? "", salesUnit: product.salesUnit, status: product.status,
    shortDescription: "", description: createEmptyRichTextDocument(), images: [], options: [],
    variants: [{ id: String(product.defaultVariant.id), sku: product.defaultVariant.sku, status: product.defaultVariant.status, options: {}, imagePath: "" }],
    basePrice, pricingCategoryCode: product.pricingCategoryCode ?? null, customFields: [],
  };
  const previousDescription: unknown = detail.description;
  detail.description = typeof previousDescription === "string"
    ? { type: "doc", content: previousDescription.split(/\r?\n/).map((text) => ({ type: "paragraph", ...(text ? { content: [{ type: "text", text }] } : {}) })) }
    : parseRichTextDocument(previousDescription ?? createEmptyRichTextDocument());
  return structuredClone({ ...detail, pricingCategoryCode: detail.pricingCategoryCode ?? null, variantPricing: detail.variantPricing ?? "BASE_PRICE", variants: detail.variants.map((variant) => ({ ...variant, basePrice: variant.basePrice ?? basePrice })), useVariants: detail.useVariants ?? detail.options.length > 0, id: product.id, code: product.code, createdAt: product.createdAt, updatedAt: product.updatedAt });
}

export async function saveProduct(organizationId: number, code: string, input: ProductEditDto): Promise<ProductDetail> {
  const current = await getProduct(organizationId, code);
  if (!current) throw new Error("Product was not found.");
  const description = readRichTextDocument(input.description);
  if (description.textContent.length > 20000) throw new Error("Description must be 20000 characters or less.");
  input = { ...input, description: parseRichTextDocument(input.description) };
  if (input.pricingCategoryCode && input.pricingCategoryCode !== current.pricingCategoryCode) {
    const { listPricingCategories } = await import("../../../product-pricing-categories/server/lib/pricing-category.service");
    if (!listPricingCategories(organizationId).some((row) => row.code === input.pricingCategoryCode && row.status === "ACTIVE")) throw new Error("Select an active pricing category.");
  }
  const hasTwoDecimals = (value: number) => Number.isFinite(value) && Math.abs(value * 100 - Math.round(value * 100)) < 1e-8;
  if (!hasTwoDecimals(input.basePrice) || input.variants.some((variant) => variant.basePrice != null && !hasTwoDecimals(variant.basePrice))) throw new Error("Prices must have no more than two decimal places.");
  const effectiveOptions = input.useVariants ? input.options : [];
  if (input.useVariants && (!input.options.length || input.variants.filter((variant) => variant.status === "ACTIVE" && variantMatchesOptions(variant, input.options)).length < 2)) throw new Error("A product must have at least two variants when Use Variants is enabled.");
  if (!input.useVariants && !input.variants.some((variant) => Object.keys(variant.options).length === 0)) {
    input = { ...input, variants: [...input.variants, { id: crypto.randomUUID(), sku: code + "-DEFAULT", status: "ACTIVE", options: {}, imagePath: "" }] };
  }
  const unique = (values: string[]) => new Set(values).size === values.length;
  if (!unique(input.options.map((option) => option.id)) || !unique(input.options.map((option) => option.name.trim().toLowerCase()))) throw new Error("Option names must be unique.");
  if (!unique(input.variants.map((variant) => variant.id)) || !unique(input.variants.map((variant) => variant.sku.trim().toUpperCase()))) throw new Error("Variant IDs and SKUs must be unique.");
  if (!unique(input.variants.map((variant) => combinationKey(variant.options)))) throw new Error("Each option combination can have only one variant.");
  if (input.images.length && input.images.filter((image) => image.primary).length !== 1) throw new Error("Choose one primary image.");
  const { listProductConfiguration } = await import("./product-configuration.service");
  const sharedLists = await listProductConfiguration(organizationId, "optionLists");
  const lists = await listProductConfiguration(organizationId, "lists");
  const categories = await listProductConfiguration(organizationId, "categories");
  if (input.category && input.category !== current.category && !categories.some((row) => row.status === "ACTIVE" && row.name === input.category)) throw new Error("Select an active product category.");
  for (const [field, listCode] of [["brand", "BRAND"], ["manufacturer", "MANUFACTURER"], ["salesUnit", "SALES-UNIT"]] as const) {
    if (input[field] && input[field] !== current[field] && !lists.some((row) => row.code === listCode && row.status === "ACTIVE" && row.values.includes(input[field]!))) throw new Error("Select an available " + field + " value.");
  }
  if (!unique(input.customFields.map((field) => field.name.trim().toLowerCase()))) throw new Error("Custom field names must be unique.");
  for (const option of input.options) {
    if (option.sourceListCode) {
      const list = sharedLists.find((row) => row.code === option.sourceListCode && row.status === "ACTIVE");
      if (!list || option.values.some((value) => !list.values.includes(value))) throw new Error("Select values from an available shared option list.");
    }
  }
  const variants = input.variants.map((variant) => {
    const previous = current.variants.find((row) => row.id === variant.id);
    if (previous && combinationKey(previous.options) !== combinationKey(variant.options)) throw new Error("An existing variant's option combination cannot be changed. Generate a new variant instead.");
    if (!previous && !variantMatchesOptions(variant, effectiveOptions) && input.useVariants) throw new Error("New variants must use the product's configured options.");
    return { ...variant, status: variantMatchesOptions(variant, effectiveOptions) ? (!input.useVariants ? input.status : variant.status) : "INACTIVE" as const };
  });
  const record = productsByOrganization.get(organizationId)!.get(current.id)!;
  const detail = structuredClone({ ...input, name: input.name.trim(), variants });
  productsByOrganization.get(organizationId)!.set(current.id, { ...record, name: detail.name, type: detail.type, category: detail.category, brand: detail.brand, manufacturer: detail.manufacturer, salesUnit: detail.salesUnit, basePrice: detail.basePrice, status: detail.status, detail, updatedAt: Date.now() });
  return (await getProduct(organizationId, code))!;
}

export async function transitionProduct(organizationId: number, code: string, operation: "activate" | "deactivate" | "delete") {
  const current = await getProduct(organizationId, code);
  if (!current) throw new Error("Product was not found.");
  const records = productsByOrganization.get(organizationId)!;
  if (operation === "delete") { records.delete(current.id); saveInventoryLinks(organizationId, code, {}); return; }
  const record = records.get(current.id)!;
  const status = operation === "activate" ? "ACTIVE" : "INACTIVE";
  records.set(current.id, { ...record, status, updatedAt: Date.now(), detail: record.detail ? { ...record.detail, status } : undefined });
}

export function productPricingCategoryCounts(organizationId: number): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of productsByOrganization.get(organizationId)?.values() ?? []) {
    const code = product.detail ? product.detail.pricingCategoryCode : product.pricingCategoryCode;
    if (code) counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}

export function adjustProductBasePrices(organizationId: number, input: { codes: string[]; direction: "increase" | "decrease"; method: "percentage" | "amount"; value: number }, expected?: string) {
  const records = productsByOrganization.get(organizationId);
  const changes = Array.from(records?.values() ?? []).filter((product) => input.codes.includes((product.detail ? product.detail.pricingCategoryCode : product.pricingCategoryCode) ?? "")).map((product) => {
    const before = product.detail?.basePrice ?? product.basePrice;
    const delta = input.method === "percentage" ? before * input.value / 100 : input.value;
    const after = Math.round((before + (input.direction === "increase" ? delta : -delta) + Number.EPSILON) * 100) / 100;
    if (!Number.isFinite(after) || after < 0) throw new Error("This adjustment would produce a negative or invalid price. Reduce the adjustment amount.");
    return { product, before, after };
  });
  if (!changes.length) throw new Error("The selected pricing categories have no products.");
  const signature = JSON.stringify({ input, changes: changes.map(({ product, before, after }) => [product.id, product.code, before, after]) });
  if (expected !== undefined) {
    if (signature !== expected) throw new Error("Product pricing has changed. Cancel and review the adjustment again.");
    for (const { product, after } of changes) records!.set(product.id, { ...product, basePrice: after, detail: product.detail ? { ...product.detail, basePrice: after } : undefined, updatedAt: Date.now() });
  }
  return { count: changes.length, signature };
}

export async function createProduct(organizationId: number, input: { code: string; name: string; type: ProductEditDto["type"] }) {
 const code = input.code.trim().toUpperCase();
 if (["pricing-categories", "product-categories", "manage-lists", "option-lists", "options"].includes(code.toLowerCase())) throw new Error("This product code is reserved. Choose another code.");
 if (Array.from(productsByOrganization.get(organizationId)?.values() ?? []).some((row) => row.code.toUpperCase() === code)) throw new Error("A product with this code already exists.");
 await upsertSampleProduct(organizationId, { code, name: input.name.trim(), type: input.type, basePrice: 0, pricingCategoryCode: null, category: null, brand: null, manufacturer: "", salesUnit: null, status: "ACTIVE" });
 return (await getProduct(organizationId, code))!;
}
export function productConfigurationReferences(organizationId: number) {
 return Array.from(productsByOrganization.get(organizationId)?.values() ?? [], (row) => ({ id: row.id, code: row.code, name: row.name, category: row.category, brand: row.brand, manufacturer: row.manufacturer, salesUnit: row.salesUnit, options: row.detail?.options ?? [] }));
}
export function renameProductCategory(organizationId: number, oldName: string, name: string) {
 for (const row of productsByOrganization.get(organizationId)?.values() ?? []) if (row.category === oldName) {
   row.category = name; if (row.detail) row.detail.category = name; row.updatedAt = Date.now();
 }
}

export async function changeProductsCategory(organizationId: number, codes: string[], kind: "category" | "pricingCategory", categoryCode: string) {
  const { listProductConfiguration } = await import("./product-configuration.service");
  const { listPricingCategories } = await import("../../../product-pricing-categories/server/lib/pricing-category.service");
  const categories = kind === "category" ? await listProductConfiguration(organizationId, "categories") : listPricingCategories(organizationId);
  const category = categories.find((row) => row.code === categoryCode && row.status === "ACTIVE");
  if (!category) throw new Error("Select an active category.");
  const records = productsByOrganization.get(organizationId);
  const selected = [...new Set(codes)].map((code) => [...(records?.values() ?? [])].find((row) => row.code === code));
  if (selected.some((row) => !row)) throw new Error("A selected product no longer exists.");
  const updatedAt = Date.now();
  for (const row of selected) {
    if (!row) continue;
    if (kind === "category") { row.category = category.name; if (row.detail) row.detail.category = category.name; }
    else { row.pricingCategoryCode = category.code; if (row.detail) row.detail.pricingCategoryCode = category.code; }
    row.updatedAt = updatedAt;
  }
}

export async function createProductsFromInventory(organizationId: number, itemIds: number[]): Promise<string[]> {
  const items = await loadInventoryItems(organizationId);
  if (!items) throw new Error("Inventory is not available.");
  const selected = [...new Set(itemIds)].map((id) => {
    const item = items.find((row) => row.id === id && row.status === "ACTIVE");
    if (!item) throw new Error("Select active inventory items belonging to this organization.");
    return { ...item, code: item.sku.toUpperCase().replace(/[^A-Z0-9_-]/g, "-").replace(/^[^A-Z0-9]+/, "").slice(0, 50) };
  });
  const codes = new Set(Array.from(productsByOrganization.get(organizationId)?.values() ?? [], (row) => row.code.toUpperCase()));
  for (const item of selected) {
    if (!item.code || !item.name.trim() || item.name.trim().length > 200 || ["PRICING-CATEGORIES", "PRODUCT-CATEGORIES", "MANAGE-LISTS", "OPTION-LISTS", "OPTIONS"].includes(item.code)) throw new Error("Inventory item " + item.sku + " cannot be used as a product code or name.");
    if (codes.has(item.code)) throw new Error("Product code " + item.code + " already exists or is repeated in this selection. Deselect the conflicting item.");
    codes.add(item.code);
  }
  // All validation precedes these synchronous in-memory writes.
  const writes = selected.map((item) => {
    const write = upsertSampleProduct(organizationId, { code: item.code, name: item.name.trim(), type: "Physical", basePrice: 0, pricingCategoryCode: null, category: null, brand: null, manufacturer: "", salesUnit: item.unit, status: "ACTIVE" });
    const product = Array.from(productsByOrganization.get(organizationId)!.values()).find((row) => row.code === item.code)!;
    saveInventoryLinks(organizationId, item.code, { [String(product.defaultVariant.id)]: item.id });
    return write;
  });
  await Promise.all(writes);
  return selected.map((item) => item.code);
}
