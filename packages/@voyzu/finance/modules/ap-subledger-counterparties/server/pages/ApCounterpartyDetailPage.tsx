import "server-only";

import { notFound } from "next/navigation";

import { ApCounterpartyDetail } from "../../client";
import { ApCounterpartyReportTemplate } from "../../client/templates/ApCounterpartyReportTemplate";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { getApCounterparty } from "../lib/ap-subledger-counterparty.service";

export async function ApCounterpartyDetailPage({ code, surface }: { code?: string; surface?: { unframed?: boolean } }) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const counterparty = await getApCounterparty(company.id, decodeURIComponent(code));
  if (!counterparty) notFound();
  if (surface?.unframed) {
    return <ApCounterpartyReportTemplate company={company} counterparty={counterparty} generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }
  return <ApCounterpartyDetail company={company} counterparty={counterparty} />;
}
