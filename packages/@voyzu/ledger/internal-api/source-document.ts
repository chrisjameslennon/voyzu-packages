import { internalApi } from "@voyzu/capability/internal-api";
export async function getSourceDocument(organization_id: number, document_type: string, code: string) {
 if (!internalApi.has("@erp/finance-documents")) return { status: "unavailable" as const };
 const document = await internalApi.callOptional("@erp/finance-documents", "get", { organization_id, document_type, code });
 return document ? { status: "found" as const, document } : { status: "missing" as const };
}
