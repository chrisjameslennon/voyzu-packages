import "server-only";

import { notFound } from "next/navigation";

import { ArCounterpartyDetail } from "../../client";
import { getSelectedCompany } from "@voyzu/core/journals/server";
import { getArCounterparty } from "../lib/ar-subledger-counterparty.service";

export async function ArCounterpartyDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const counterparty = await getArCounterparty(company.id, decodeURIComponent(code));
  if (!counterparty) notFound();
  return <ArCounterpartyDetail counterparty={counterparty} />;
}

