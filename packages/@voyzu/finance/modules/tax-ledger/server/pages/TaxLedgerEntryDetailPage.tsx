import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { TaxLedgerEntryDetail } from "../../client/index";
import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { getTaxSubledgerEntry } from "../lib/tax-ledger.service";

export async function TaxLedgerEntryDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const entry = await getTaxSubledgerEntry(company.id, code);
  if (!entry) notFound();
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <TaxLedgerEntryDetail
      entry={entry}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
