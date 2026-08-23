import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/finance/common/server";
import { listApSubledgerEntries } from "@voyzu/finance/ap-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu/finance/journals/server";

import { ApBillReport } from "../../client";
import { ApLedgerEntryDocumentReportTemplate } from "../../client/templates/ApLedgerEntryDocumentReportTemplate";
import { getApLedgerEntryDocumentReport } from "../lib/ap-bill-report.service";

export async function ApBillDetailPage({
  documentId,
  surface,
}: {
  documentId?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entries = await listApSubledgerEntries(company.id);
  const entry = entries.find((candidate) => candidate.documentId === decodeURIComponent(documentId));
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
    <ApBillReport
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
