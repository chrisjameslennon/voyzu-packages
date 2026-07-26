import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu-modules/core/common/server";
import { listApSubledgerEntries } from "@voyzu-modules/core/ap-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";

import { ApBillReport } from "../../client";
import { getApLedgerEntryDocumentReport } from "../lib/ap-bill-report.service";

export async function ApBillDetailPage({
  documentId,
  surface,
}: {
  documentId?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entries = await listApSubledgerEntries(company.id);
  const entry = entries.find((candidate) => candidate.documentId === decodeURIComponent(documentId));
  if (!entry) notFound();
  const report = await getApLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ApBillReport
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
