"use server";

import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { seedSampleProducts, seedSampleCustomers } from "../../../../scripts/sample-data";

export async function loadSampleData() {
  try {
    const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
    if (!selectedOrganization) return { error: "Select an organization before adding sample data." };
    await seedSampleProducts(selectedOrganization.organization_id);
    seedSampleCustomers(selectedOrganization.organization_id);
    revalidatePath("/commercial/customers");
    for (const path of ["customer-categories", "price-lists"]) { revalidatePath("/commercial/customers/" + path); revalidatePath("/commercial/customers/" + path + "/[code]", "page"); }
    revalidatePath("/commercial/customers/[code]", "page");
    revalidatePath("/commercial");
    revalidatePath("/commercial/products");
    revalidatePath("/commercial/products/pricing-categories");
    revalidatePath("/commercial/products/manage-lists");
    revalidatePath("/commercial/products/option-lists");
    revalidatePath("/commercial/products/product-categories");
    revalidatePath("/commercial/products/[code]", "page");
    revalidatePath("/commercial/products/product-categories/[code]", "page");
    revalidatePath("/commercial/products/manage-lists/[code]", "page");
    revalidatePath("/commercial/products/option-lists/[code]", "page");
    return { message: "Sample products, customers, lists and categories are ready. Matching records have been updated." };
  } catch (error) {
    console.error("Failed to load Commercial sample data", error);
    return { error: "Sample data could not be added. Please try again." };
  }
}
