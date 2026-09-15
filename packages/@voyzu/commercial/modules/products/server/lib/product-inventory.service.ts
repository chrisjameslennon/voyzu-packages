import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
const storage = globalThis as typeof globalThis & { commercialInventoryLinks?: Map<number, Map<string, Record<string, number>>> };
const links = storage.commercialInventoryLinks ??= new Map();
export function getInventoryLinks(organizationId: number, code: string): Record<string, number> {
  return { ...links.get(organizationId)?.get(code) };
}
export function saveInventoryLinks(organizationId: number, code: string, values: Record<string, number>) {
  if (!links.has(organizationId)) links.set(organizationId, new Map());
  links.get(organizationId)!.set(code, { ...values });
}
export async function loadInventoryItems(organizationId: number) {
  return internalApi.callOptional("@erp/inventory-item", "byOrganization", { organization_id: organizationId });
}
