"use server";

import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { Check } from "typebox/value";
import { ProductEditDto } from "../../types/product-detail.dto";
import { getProduct, saveProduct, transitionProduct } from "../lib/product.service";

const fields = {
  details: ["name", "type", "category", "brand", "manufacturer", "salesUnit", "shortDescription", "description"],
  images: ["images"],
  variants: ["variantPricing", "useVariants", "options", "variants"],
  pricing: ["basePrice", "pricingCategoryCode"],
  custom: ["customFields"],
} as const;

function refreshProduct(code: string) {
  revalidatePath("/commercial/products");
  revalidatePath("/commercial/products/" + encodeURIComponent(code));
  revalidatePath("/commercial");
}
export async function saveProductAction(code: string, tab: keyof typeof fields, input: unknown) {
  if (typeof code !== "string" || !Object.hasOwn(fields, tab) || !input || typeof input !== "object") return { error: "Invalid product request." };
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) return { error: "Select an organization before saving." };
  try {
    const current = await getProduct(selectedOrganization.organization_id, code);
    if (!current) return { error: "Product was not found." };
    const { id: _id, code: _code, createdAt: _createdAt, updatedAt: _updatedAt, ...existing } = current;
    const patch = Object.fromEntries(fields[tab].map((key) => [key, (input as Record<string, unknown>)[key]]));
    const merged = { ...existing, ...patch };
    if (!Check(ProductEditDto, merged)) return { error: "Check the fields on this tab. Required values must be supplied and prices must be non-negative." };
    const product = await saveProduct(selectedOrganization.organization_id, code, merged);
    refreshProduct(code);
    return { product };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The product could not be saved." };
  }
}
export async function transitionProductAction(code: string, operation: "activate" | "deactivate" | "delete") {
  if (typeof code !== "string" || !["activate", "deactivate", "delete"].includes(operation)) return { error: "Invalid operation." };
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) return { error: "Select an organization first." };
  try {
    await transitionProduct(selectedOrganization.organization_id, code, operation);
    refreshProduct(code);
    return { product: await getProduct(selectedOrganization.organization_id, code) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The operation could not be completed." };
  }
}

export async function saveProductInventoryAction(code: string, links: Record<string, number>) {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) return { error: "Select an organization before saving." };
  try {
    const { loadInventoryItems, saveInventoryLinks, getInventoryLinks } = await import("../lib/product-inventory.service");
    const organizationId = selectedOrganization.organization_id;
    const product = await getProduct(organizationId, code);
    if (!product) return { error: "Product was not found." };
    const items = await loadInventoryItems(organizationId);
    if (!items) return { error: "Inventory is not available." };
    const existingLinks = getInventoryLinks(organizationId, code);
    if (!links || typeof links !== "object" || Array.isArray(links) || Object.entries(links).some(([variantId, itemId]) => !product.variants.some((variant) => variant.id === variantId) || !items.some((item) => item.id === itemId && (item.status === "ACTIVE" || existingLinks[variantId] === itemId)))) return { error: "Save the variants first and select active inventory items belonging to this organization." };
    saveInventoryLinks(organizationId, code, links);
    refreshProduct(code);
    return { links };
  } catch (error) { return { error: error instanceof Error ? error.message : "Inventory links could not be saved." }; }
}

export async function createProductAction(input: unknown, inventoryItemId?: number) {
 try {
  const { ProductCreateDto } = await import("../../types/product-detail.dto");
  if (!Check(ProductCreateDto, input)) throw new Error("Supply a valid product code, name and type.");
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) throw new Error("Select an organization first.");
  const { loadInventoryItems, saveInventoryLinks } = await import("../lib/product-inventory.service");
  if (inventoryItemId !== undefined) {
    if (!Number.isSafeInteger(inventoryItemId) || inventoryItemId <= 0) throw new Error("Select an inventory item.");
    const items = await loadInventoryItems(selectedOrganization.organization_id);
    if (!items?.some((item) => item.id === inventoryItemId && item.status === "ACTIVE")) throw new Error("Select an active inventory item belonging to this organization.");
  }
  const { createProduct } = await import("../lib/product.service");
  const product = await createProduct(selectedOrganization.organization_id, input);
  if (inventoryItemId !== undefined) saveInventoryLinks(selectedOrganization.organization_id, product.code, { [product.variants[0].id]: inventoryItemId });
  refreshProduct(product.code); return { product };
 } catch (error) { return { error: error instanceof Error ? error.message : "Unable to create product." }; }
}
export async function transitionProductsAction(codes: string[], operation: "activate" | "deactivate" | "delete") {
 try {
  if (!Array.isArray(codes) || !codes.length || !codes.every((code) => typeof code === "string") || !["activate", "deactivate", "delete"].includes(operation)) throw new Error("Invalid product selection.");
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) throw new Error("Select an organization first.");
  const id = selectedOrganization.organization_id;
  if ((await Promise.all(codes.map((code) => getProduct(id, code)))).some((product) => !product)) throw new Error("A selected product no longer exists.");
  for (const code of new Set(codes)) { await transitionProduct(id, code, operation); refreshProduct(code); }
  return { success: true };
 } catch (error) { return { error: error instanceof Error ? error.message : "Unable to update products." }; }
}

export async function changeProductsCategoryAction(codes: string[], kind: "category" | "pricingCategory", categoryCode: string) {
  try {
    if (!Array.isArray(codes) || !codes.length || !codes.every((code) => typeof code === "string" && code.length > 0) || !["category", "pricingCategory"].includes(kind) || typeof categoryCode !== "string" || !categoryCode) throw new Error("Select products and a category.");
    const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
    if (!selectedOrganization) throw new Error("Select an organization first.");
    const { changeProductsCategory } = await import("../lib/product.service");
    await changeProductsCategory(selectedOrganization.organization_id, codes, kind, categoryCode);
    for (const code of new Set(codes)) refreshProduct(code);
    revalidatePath("/commercial/products/product-categories");
    revalidatePath("/commercial/products/product-categories/[code]", "page");
    revalidatePath("/commercial/products/pricing-categories");
    revalidatePath("/commercial/products/pricing-categories/[code]", "page");
    return { success: true };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to update products." }; }
}

export async function productCreationInventoryItemsAction() {
  try {
    const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
    if (!selectedOrganization) throw new Error("Select an organization first.");
    const { loadInventoryItems } = await import("../lib/product-inventory.service");
    const items = await loadInventoryItems(selectedOrganization.organization_id);
    if (!items) throw new Error("Inventory is not available.");
    const availability = await internalApi.call("@erp/inventory-item", "availabilityByOrganization", { organization_id: selectedOrganization.organization_id });
    return { items: items.filter((item) => item.status === "ACTIVE").map((item) => ({ ...item, unitsOnHand: availability.filter((stock) => stock.itemId === item.id).reduce((total, stock) => total + stock.onHand, 0) })) };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to load inventory items." }; }
}

export async function createProductsFromInventoryAction(itemIds: number[]) {
  try {
    if (!Array.isArray(itemIds) || !itemIds.length || !itemIds.every((id) => Number.isSafeInteger(id) && id > 0)) throw new Error("Select inventory items.");
    const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
    if (!selectedOrganization) throw new Error("Select an organization first.");
    const { createProductsFromInventory } = await import("../lib/product.service");
    const codes = await createProductsFromInventory(selectedOrganization.organization_id, itemIds);
    for (const code of codes) refreshProduct(code);
    return { count: codes.length };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to create products." }; }
}
