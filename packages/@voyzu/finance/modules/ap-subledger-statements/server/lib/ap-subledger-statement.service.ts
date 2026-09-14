import { internalApi } from "@voyzu/capability/internal-api";
import type { OrganizationResponseDto } from "@voyzu/types/business-objects/organization";
export async function listApCounterpartySummaries(organization_id: number) { return await internalApi.callOptional("@erp/ledger-documents", "listApStatementSummaries", { organization_id }) ?? []; }
export async function getApCounterpartyStatement(company: OrganizationResponseDto, code: string) { return internalApi.callOptional("@erp/ledger-documents", "getApStatement", { organization_id: company.id, code }); }
