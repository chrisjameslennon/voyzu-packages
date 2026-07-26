import "server-only";

import { notFound } from "next/navigation";

import { ApLedgerEntryDetail } from "../../client";
import { normalizeDetailBackSource } from "@voyzu-modules/all-modules/common/server";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";
import { getApSubledgerEntry } from "../lib/ap-subledger-ledger-entries.service";

export async function ApLedgerEntryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getApSubledgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ApLedgerEntryDetail
      entry={entry}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
