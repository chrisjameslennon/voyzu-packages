"use server";
import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { customerConfigurationMeta, type CustomerConfigurationKind } from "../../types/customer-configuration.dto";
import { getCustomerConfiguration, saveCustomerConfiguration, transitionCustomerConfiguration } from "../lib/customer-configuration.service";
async function organization() { const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {}); if (!selectedOrganization) throw new Error("Select an organization first."); return selectedOrganization.organization_id; }
function refresh(kind: CustomerConfigurationKind) { const path = customerConfigurationMeta[kind].href; revalidatePath(path); revalidatePath(path + "/[code]", "page"); revalidatePath("/commercial/customers"); revalidatePath("/commercial/customers/[code]", "page"); }
export async function saveCustomerConfigurationAction(kind: CustomerConfigurationKind, input: unknown, existingCode?: string) {
  try { const record = saveCustomerConfiguration(await organization(), kind, input, existingCode); refresh(kind); return { record }; } catch (error) { return { error: error instanceof Error ? error.message : "Unable to save." }; }
}
export async function transitionCustomerConfigurationAction(kind: CustomerConfigurationKind, codes: string[], operation: "activate" | "deactivate" | "delete") {
  try { const id = await organization(); transitionCustomerConfiguration(id, kind, codes, operation); refresh(kind); return { record: codes.length === 1 ? getCustomerConfiguration(id, kind, codes[0]) : null }; } catch (error) { return { error: error instanceof Error ? error.message : "Unable to update." }; }
}
