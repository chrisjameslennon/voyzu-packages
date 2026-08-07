import "server-only";

import { notFound } from "next/navigation";

import { ArCounterpartyDetail } from "../../client";
import { ArCounterpartyReportTemplate } from "../../client/templates/ArCounterpartyReportTemplate";
import { getSelectedCompany } from "@voyzu/core/journals/server";
import { getArCounterparty } from "../lib/ar-subledger-counterparty.service";

export async function ArCounterpartyDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { unframed?: boolean };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const counterparty = await getArCounterparty(company.id, decodeURIComponent(code));
  if (!counterparty) notFound();
  if (surface?.unframed) {
    return (
      <ArCounterpartyReportTemplate
        company={company}
        counterparty={counterparty}
        generatedAt={new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    );
  }
  return <ArCounterpartyDetail company={company} counterparty={counterparty} />;
}

