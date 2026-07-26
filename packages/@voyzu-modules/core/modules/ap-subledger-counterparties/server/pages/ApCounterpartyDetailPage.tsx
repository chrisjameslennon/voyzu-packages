import "server-only";

import { notFound } from "next/navigation";

import { ApCounterpartyDetail } from "../../client";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";
import { getApCounterparty } from "../lib/ap-subledger-counterparty.service";

export async function ApCounterpartyDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const counterparty = await getApCounterparty(company.id, decodeURIComponent(code));
  if (!counterparty) notFound();
  return <ApCounterpartyDetail counterparty={counterparty} />;
}
