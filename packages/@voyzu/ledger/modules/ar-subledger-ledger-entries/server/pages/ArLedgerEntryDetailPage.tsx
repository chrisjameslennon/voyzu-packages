import { internalApi } from "@voyzu/capability/internal-api";
import { getSourceDocument } from "../../../../internal-api/source-document";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { ArLedgerEntryDocumentReport } from "../../client/index";
import { ArLedgerEntryDocumentReportTemplate } from "../../client/templates/ArLedgerEntryDocumentReportTemplate";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { getArLedgerEntryDocumentReport, getArSubledgerEntry } from "../lib/ar-subledger-ledger-entries.service";

export async function ArLedgerEntryDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const enquiry = context.routeDefinition.path.includes("ledger-entry-enquiry");
  const fallbackHref = enquiry ? "/ledger/subledgers/ar/ledger-entry-enquiry" : undefined;
  const returnSource = enquiry ? "arLedgerEntryEnquiry" as const : undefined;
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getArSubledgerEntry(company.id, code);
  if (!entry) notFound();
  const source = await getSourceDocument(company.organizationId, entry.documentTypeCode, entry.documentId);
  if (source.status === "found") entry.documentSnapshot = source.document.document;
  const party = internalApi.has("@erp/ar-counterparties")
    ? await internalApi.call("@core/party", "get", { code: entry.counterpartyCode }) : null;
  const counterparty = party ? await internalApi.callOptional("@erp/ar-counterparties", "get", { organization_id: company.organizationId, party_id: party.party_id }) : null;
  const counterpartyHref = counterparty ? "/finance/subledgers/ar/counterparties/" + encodeURIComponent(counterparty.code) : undefined;
  const report = await getArLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  if (context.routeDefinition.unframed) {
    return (
      <ArLedgerEntryDocumentReportTemplate
        report={report}
        generatedAt={new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    );
  }
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <ArLedgerEntryDocumentReport
      counterpartyHref={counterpartyHref}
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      fallbackHref={fallbackHref}
      returnSource={returnSource}
    />
  );
}

