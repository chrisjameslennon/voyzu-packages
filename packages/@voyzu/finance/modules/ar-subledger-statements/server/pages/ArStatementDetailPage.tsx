import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ArCounterpartyStatementReport } from "../../client/index";
import { ArCounterpartyStatementReportTemplate } from "../../client/templates/ArCounterpartyStatementReportTemplate";
import { getArCounterpartyStatement } from "../lib/ar-subledger-statement.service";

export async function ArStatementDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArCounterpartyStatement(company, code);
  if (!statement) notFound();
  if (context.routeDefinition.unframed) {
    return (
      <ArCounterpartyStatementReportTemplate
        statement={statement}
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
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <ArCounterpartyStatementReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
