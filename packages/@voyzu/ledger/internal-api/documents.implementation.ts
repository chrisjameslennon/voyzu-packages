import { getAccessibleOrganization } from "./organization-access";
import { getTaxSubledgerEntry } from "../modules/tax-ledger/server/lib/tax-ledger.service";
import { getInventoryLedgerEntry } from "../modules/inventory-ledger/server/lib/inventory-ledger.service";
import { internalApi } from "@voyzu/capability/internal-api";
import { BusinessRuleError } from "@voyzu/capability/errors";
import { findCompanySettingsScope } from "../modules/organization-finance/server/lib/settings-scope";
import { getJournal } from "../modules/journals/server/lib/journal.service";
import { listArSubledgerEntries, getArSubledgerEntry, getArLedgerEntryDocumentReport } from "../modules/ar-subledger-ledger-entries/server/lib/ar-subledger-ledger-entries.service";
import { listApSubledgerEntries, getApSubledgerEntry } from "../modules/ap-subledger-ledger-entries/server/lib/ap-subledger-ledger-entries.service";
import { getApLedgerEntryDocumentReport } from "../modules/ap-subledger-bills/server/lib/ap-bill-report.service";
import { getArInvoiceStatement } from "../modules/ar-subledger-invoices/server/lib/ar-invoice-statement.service";
import { listArCounterpartySummaries, getArCounterpartyStatement } from "../modules/ar-subledger-statements/server/lib/ar-subledger-statement.service";
import { listApCounterpartySummaries, getApCounterpartyStatement } from "../modules/ap-subledger-statements/server/lib/ap-subledger-statement.service";
type Scope = { organization_id: number };
type Get = Scope & { code: string };
async function company({ organization_id }: Scope) {
 const organization = await getAccessibleOrganization({ organization_id });
 const scope = await findCompanySettingsScope(organization_id);
 if (!scope) throw new BusinessRuleError("Organization has no accounting entity");
 const { organization_id: _organizationId, ...fields } = organization;
 return { ...fields, id: scope.companyId };
}
function publicOrganization<T extends { company: { id: number } }>(document: T | null, organization_id: number): T | null {
 return document ? { ...document, company: { ...document.company, id: organization_id } } : null;
}
export const documentMethods = {
 getTaxEntry: async (input: Get) => getTaxSubledgerEntry((await company(input)).id, input.code),
 getInventoryEntry: async (input: Get) => getInventoryLedgerEntry((await company(input)).id, input.code),
 getJournal: async (input: Get) => getJournal((await company(input)).id, input.code),
 getArEntry: async (input: Get) => getArSubledgerEntry((await company(input)).id, input.code),
 getApEntry: async (input: Get) => getApSubledgerEntry((await company(input)).id, input.code),
 listArEntries: async (input: Scope) => listArSubledgerEntries((await company(input)).id),
 listApEntries: async (input: Scope) => listApSubledgerEntries((await company(input)).id),
 listArStatementSummaries: async (input: Scope) => listArCounterpartySummaries((await company(input)).id),
 listApStatementSummaries: async (input: Scope) => listApCounterpartySummaries((await company(input)).id),
 getArStatement: async (input: Get) => publicOrganization(await getArCounterpartyStatement(await company(input), input.code), input.organization_id),
 getApStatement: async (input: Get) => publicOrganization(await getApCounterpartyStatement(await company(input), input.code), input.organization_id),
 getInvoice: async (input: Get) => publicOrganization(await getArInvoiceStatement(await company(input), input.code), input.organization_id),
 async getBill(input: Get) {
  const scope = await company(input);
  const entries = await listApSubledgerEntries(scope.id);
  const entry = entries.find(item => item.documentId === input.code && item.documentTypeCode === "AP_BILL");
  return entry ? publicOrganization(await getApLedgerEntryDocumentReport(scope, entry), input.organization_id) : null;
 },
 async getArDocument(input: Get) {
  const scope = await company(input); const entry = await getArSubledgerEntry(scope.id, input.code);
  return entry ? publicOrganization(await getArLedgerEntryDocumentReport(scope, entry), input.organization_id) : null;
 },
 async getApDocument(input: Get) {
  const scope = await company(input); const entry = await getApSubledgerEntry(scope.id, input.code);
  return entry ? publicOrganization(await getApLedgerEntryDocumentReport(scope, entry), input.organization_id) : null;
 },
};
