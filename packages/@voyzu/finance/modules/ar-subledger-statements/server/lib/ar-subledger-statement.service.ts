import { internalApi } from "@voyzu/capability/internal-api";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
export async function listArCounterpartySummaries(organization_id: number) { return await internalApi.callOptional("@erp/ledger-documents", "listArStatementSummaries", { organization_id }) ?? []; }
export async function getArCounterpartyStatement(company: OrganizationResponseDto, code: string) { return internalApi.callOptional("@erp/ledger-documents", "getArStatement", { organization_id: company.id, code }); }
