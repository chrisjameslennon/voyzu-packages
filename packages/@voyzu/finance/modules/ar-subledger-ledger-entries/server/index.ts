import { internalApi } from "@voyzu/capability/internal-api";
export async function listArSubledgerEntries(organization_id: number) { return await internalApi.callOptional("@erp/ledger-documents", "listArEntries", { organization_id }) ?? []; }
