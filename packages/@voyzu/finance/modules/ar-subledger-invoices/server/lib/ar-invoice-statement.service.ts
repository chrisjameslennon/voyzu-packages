import { internalApi } from "@voyzu/capability/internal-api";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
export async function getArInvoiceStatement(company: OrganizationResponseDto, code: string) { return internalApi.callOptional("@erp/ledger-documents", "getInvoice", { organization_id: company.id, code }); }
