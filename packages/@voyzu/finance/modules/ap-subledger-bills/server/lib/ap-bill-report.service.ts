import { internalApi } from "@voyzu/capability/internal-api";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
import type { ApSubledgerEntryResponseDto } from "../../../ap-subledger-ledger-entries/types/ap-subledger-entry.response.dto";
export async function getApLedgerEntryDocumentReport(company: OrganizationResponseDto, entry: ApSubledgerEntryResponseDto) { return internalApi.callOptional("@erp/ledger-documents", "getBill", { organization_id: company.id, code: entry.documentId }); }
