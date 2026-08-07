import "server-only";

import { notFound } from "next/navigation";

import { ApLedgerEntryDetail } from "../../client";
import { ApLedgerEntryDocumentReportTemplate } from "../../../ap-subledger-bills/client/templates/ApLedgerEntryDocumentReportTemplate";
import { getApLedgerEntryDocumentReport } from "@voyzu/core/ap-subledger-bills/server";
import { normalizeDetailBackSource } from "@voyzu/core/common/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";
import { getApSubledgerEntry } from "../lib/ap-subledger-ledger-entries.service";

export async function ApLedgerEntryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getApSubledgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const report = await getApLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  if (surface?.unframed) {
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
  const searchParams = surface?.searchParams ?? {};
  return (
    <ApLedgerEntryDetail
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
