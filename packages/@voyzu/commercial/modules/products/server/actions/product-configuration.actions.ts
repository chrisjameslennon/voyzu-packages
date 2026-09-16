"use server";
import { internalApi } from "@voyzu/capability/internal-api";
import { revalidatePath } from "next/cache";
import { Check } from "typebox/value";
import { ProductConfigurationInputDto, configurationMeta, type ProductConfigurationKind } from "../../types/product-configuration.dto";
import { saveProductConfiguration, transitionProductConfiguration, getProductConfiguration } from "../lib/product-configuration.service";
async function context(kind: ProductConfigurationKind) { if (!Object.hasOwn(configurationMeta, kind)) throw new Error("Invalid list type."); const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {}); if (!selectedOrganization) throw new Error("Select an organization first."); return selectedOrganization.organization_id; }
function refresh(kind: ProductConfigurationKind, codes: string[]) { revalidatePath(configurationMeta[kind].href); revalidatePath("/commercial/products"); revalidatePath("/commercial/products/[code]", "page"); codes.forEach((code) => revalidatePath(configurationMeta[kind].href + "/" + encodeURIComponent(code))); }
export async function saveConfigurationAction(kind: ProductConfigurationKind, input: unknown, existingCode?: string) {
 try { const id = await context(kind); if (kind === "lists" && !existingCode) throw new Error("Creating product lists is not supported."); if (!Check(ProductConfigurationInputDto, input)) throw new Error("Supply a valid code, name and values."); saveProductConfiguration(id, kind, input, existingCode); const code = input.code.trim().toUpperCase(); refresh(kind, [code]); return { record: await getProductConfiguration(id, kind, code) }; } catch (error) { return { error: error instanceof Error ? error.message : "Unable to save." }; }
}
export async function transitionConfigurationAction(kind: ProductConfigurationKind, codes: string[], operation: "activate" | "deactivate" | "delete") {
 try { const id = await context(kind); if (!Array.isArray(codes) || !codes.every((code) => typeof code === "string") || !["activate", "deactivate", "delete"].includes(operation)) throw new Error("Invalid request."); transitionProductConfiguration(id, kind, codes, operation); refresh(kind, codes); return { success: true, record: operation !== "delete" && codes.length === 1 ? await getProductConfiguration(id, kind, codes[0]) : null }; } catch (error) { return { error: error instanceof Error ? error.message : "Unable to update." }; }
}
