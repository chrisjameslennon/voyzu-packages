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
