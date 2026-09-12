import "server-only";

import { notFound } from "next/navigation";

import { TaxLedgerEntryDetail } from "../../client/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { getTaxSubledgerEntry } from "../lib/tax-ledger.service";

export async function TaxLedgerEntryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getTaxSubledgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <TaxLedgerEntryDetail
      entry={entry}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
