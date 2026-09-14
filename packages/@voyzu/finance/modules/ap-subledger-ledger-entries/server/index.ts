import { internalApi } from "@voyzu/capability/internal-api";
export async function listApSubledgerEntries(organization_id: number) { return await internalApi.callOptional("@erp/ledger-documents", "listApEntries", { organization_id }) ?? []; }
