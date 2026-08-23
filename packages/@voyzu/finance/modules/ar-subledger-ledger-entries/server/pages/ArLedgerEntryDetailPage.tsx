import "server-only";

import { notFound } from "next/navigation";

import { ArLedgerEntryDocumentReport } from "../../client";
import { ArLedgerEntryDocumentReportTemplate } from "../../client/templates/ArLedgerEntryDocumentReportTemplate";
import { normalizeDetailBackSource } from "@voyzu/finance/common/server";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { getArLedgerEntryDocumentReport, getArSubledgerEntry } from "../lib/ar-subledger-ledger-entries.service";

export async function ArLedgerEntryDetailPage({
  code,
  surface,
  fallbackHref,
  returnSource,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
  fallbackHref?: string;
  returnSource?: "arLedgerEntry" | "arLedgerEntryEnquiry";
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getArSubledgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const report = await getArLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  if (surface?.unframed) {
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
  const searchParams = surface?.searchParams ?? {};
  return (
    <ArLedgerEntryDocumentReport
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
      fallbackHref={fallbackHref}
      returnSource={returnSource}
    />
  );
}

