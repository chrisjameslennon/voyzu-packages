import "server-only";

import { notFound } from "next/navigation";

import { InventoryLedgerEntryDetail } from "../../client";
import { normalizeDetailBackSource } from "@voyzu-modules/all-modules/common/server";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";
import { getInventoryLedgerEntry } from "../lib/inventory-ledger.service";

export async function InventoryLedgerEntryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getInventoryLedgerEntry(company.id, decodeURIComponent(code));
  if (!entry) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <InventoryLedgerEntryDetail
      entry={entry}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
