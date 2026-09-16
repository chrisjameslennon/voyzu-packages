"use server";
import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { getCustomer, saveCustomer, transitionCustomers, changeCustomersCategory } from "../lib/customer.service";
async function organization() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!selectedOrganization) throw new Error("Select an organization first.");
  return selectedOrganization.organization_id;
}
function refresh(codes: string[]) {
  revalidatePath("/commercial/customers");
  for (const path of ["customer-categories", "price-lists"]) { revalidatePath("/commercial/customers/" + path); revalidatePath("/commercial/customers/" + path + "/[code]", "page"); }
  codes.forEach((code) => revalidatePath("/commercial/customers/" + encodeURIComponent(code)));
}
export async function saveCustomerAction(input: unknown, existingCode?: string) {
  try { const customer = saveCustomer(await organization(), input, existingCode); refresh([customer.code]); return { customer }; }
  catch (error) { return { error: error instanceof Error ? error.message : "Unable to save customer." }; }
}
export async function transitionCustomersAction(codes: string[], operation: "activate" | "deactivate" | "delete") {
  try { const id = await organization(); transitionCustomers(id, codes, operation); refresh(codes); return { customer: codes.length === 1 ? getCustomer(id, codes[0]) : null }; }
  catch (error) { return { error: error instanceof Error ? error.message : "Unable to update customers." }; }
}

export async function changeCustomersCategoryAction(codes: string[], kind: "category" | "priceList", targetCode: string) {
  try { changeCustomersCategory(await organization(), codes, kind, targetCode); refresh(codes); return { success: true }; }
  catch (error) { return { error: error instanceof Error ? error.message : "Unable to update customers." }; }
}
