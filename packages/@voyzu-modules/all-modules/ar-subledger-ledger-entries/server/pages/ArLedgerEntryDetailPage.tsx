import "server-only";

import { notFound } from "next/navigation";

import { ArLedgerEntryDocumentReport } from "../../client";
import { normalizeDetailBackSource } from "@voyzu-modules/all-modules/common/server";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";
import { getArLedgerEntryDocumentReport, getArSubledgerEntry } from "../lib/ar-subledger-ledger-entries.service";

export async function ArLedgerEntryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getArSubledgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const report = await getArLedgerEntryDocumentReport(company, entry);
  if (!report) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ArLedgerEntryDocumentReport
      entry={entry}
      report={report}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}

