"use server";

import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { seedSampleProducts } from "../../../../scripts/sample-data";

export async function loadSampleData() {
  try {
    const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
    if (!selectedOrganization) return { error: "Select an organization before adding sample data." };
    await seedSampleProducts(selectedOrganization.organization_id);
    revalidatePath("/commercial");
    revalidatePath("/commercial/products");
    revalidatePath("/commercial/products/pricing-categories");
    revalidatePath("/commercial/products/manage-lists");
    revalidatePath("/commercial/products/option-lists");
    revalidatePath("/commercial/products/product-categories");
    return { message: "Sample products, lists and categories are ready. Matching records have been updated." };
  } catch (error) {
    console.error("Failed to load Commercial sample data", error);
    return { error: "Sample data could not be added. Please try again." };
  }
}
