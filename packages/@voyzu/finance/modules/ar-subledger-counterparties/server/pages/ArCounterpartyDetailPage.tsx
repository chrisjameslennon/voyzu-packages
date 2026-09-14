import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { ArCounterpartyDetail } from "../../client/index";
import { ArCounterpartyReportTemplate } from "../../client/templates/ArCounterpartyReportTemplate";
import { getSelectedCompany } from "../../../journals/server/index";
import { getArCounterparty } from "../lib/ar-subledger-counterparty.service";

export async function ArCounterpartyDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const counterparty = await getArCounterparty(company.id, code);
  if (!counterparty) notFound();
  if (context.routeDefinition.unframed) {
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

