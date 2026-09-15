"use server";
import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { Check } from "typebox/value";
import { PricingCategoryInputDto } from "../../types/pricing-category.dto";
import { listPricingCategories, savePricingCategory, transitionPricingCategories } from "../lib/pricing-category.service";
async function organizationId() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) throw new Error("Select an organization first.");
  return selectedOrganization.organization_id;
}
function refresh() { revalidatePath("/commercial/products/pricing-categories"); revalidatePath("/commercial/products"); }
export async function savePricingCategoryAction(input: unknown, existingCode?: string) {
  try {
    if (!Check(PricingCategoryInputDto, input)) throw new Error("Supply a code and name. Codes may contain letters, numbers, hyphens and underscores.");
    const id = await organizationId(); savePricingCategory(id, input, existingCode); refresh(); revalidatePath("/commercial/products/pricing-categories/" + encodeURIComponent(input.code.toUpperCase())); return { rows: listPricingCategories(id) };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to save pricing category." }; }
}
export async function transitionPricingCategoriesAction(codes: string[], operation: "activate" | "deactivate" | "delete") {
  try {
    if (!Array.isArray(codes) || !codes.every((code) => typeof code === "string") || !["activate", "deactivate", "delete"].includes(operation)) throw new Error("Invalid request.");
    const id = await organizationId(); transitionPricingCategories(id, codes, operation); refresh(); codes.forEach((code) => revalidatePath("/commercial/products/pricing-categories/" + encodeURIComponent(code))); return { rows: listPricingCategories(id) };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to update pricing categories." }; }
}

export async function pricingAdjustmentAction(input: unknown, expected?: string) {
  try {
    const { PricingAdjustmentDto } = await import("../../types/pricing-category.dto");
    if (!Check(PricingAdjustmentDto, input) || (expected !== undefined && typeof expected !== "string")) throw new Error("Select categories and enter a positive adjustment.");
    if (Math.abs(input.value * 100 - Math.round(input.value * 100)) >= 1e-8) throw new Error("Adjustments must have no more than two decimal places.");
    if (input.method === "percentage" && input.direction === "decrease" && input.value > 100) throw new Error("A percentage decrease cannot exceed 100%.");
    const id = await organizationId();
    const categories = listPricingCategories(id).filter((row) => input.codes.includes(row.code));
    if (categories.length !== input.codes.length) throw new Error("One or more pricing categories no longer exist.");
    const { adjustProductBasePrices } = await import("../../../products/server/lib/product.service");
    const result = adjustProductBasePrices(id, input, expected);
    if (expected !== undefined) { refresh(); revalidatePath("/commercial/products/[code]", "page"); }
    return { ...result, names: categories.map((row) => row.name) };
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to adjust pricing." }; }
}
