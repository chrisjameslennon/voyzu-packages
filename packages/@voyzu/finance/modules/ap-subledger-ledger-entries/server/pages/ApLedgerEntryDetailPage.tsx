import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { ApLedgerEntryDetail } from "../../client/index";
import { ApLedgerEntryDocumentReportTemplate } from "../../../ap-subledger-bills/client/templates/ApLedgerEntryDocumentReportTemplate";
import { getApLedgerEntryDocumentReport } from "../../../ap-subledger-bills/server/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { getApSubledgerEntry } from "../lib/ap-subledger-ledger-entries.service";

export async function ApLedgerEntryDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const enquiry = context.routeDefinition.path.includes("ledger-entry-enquiry");
  const fallbackHref = enquiry ? "/finance/subledgers/ap/ledger-entry-enquiry" : undefined;
  const returnSource = enquiry ? "apLedgerEntryEnquiry" as const : undefined;
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getApSubledgerEntry(company.id, code);
  if (!entry) notFound();
  const report = await getApLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  if (context.routeDefinition.unframed) {
    return (
      <ApLedgerEntryDocumentReportTemplate
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
    <ApLedgerEntryDetail
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      fallbackHref={fallbackHref}
      returnSource={returnSource}
    />
  );
}
