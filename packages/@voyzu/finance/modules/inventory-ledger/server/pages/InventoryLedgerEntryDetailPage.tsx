import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { InventoryLedgerEntryDetail } from "../../client/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { getInventoryLedgerEntry } from "../lib/inventory-ledger.service";

export async function InventoryLedgerEntryDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getInventoryLedgerEntry(company.id, code);
  if (!entry) notFound();
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <InventoryLedgerEntryDetail
      entry={entry}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
