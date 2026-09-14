import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ApStatementDetail } from "../../client/index";
import { ApCounterpartyStatementReportTemplate } from "../../client/templates/ApCounterpartyStatementReportTemplate";
import { getApCounterpartyStatement } from "../lib/ap-subledger-statement.service";

export async function ApStatementDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getApCounterpartyStatement(company, code);
  if (!statement) notFound();
  if (context.routeDefinition.unframed) {
    return <ApCounterpartyStatementReportTemplate statement={statement} generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <ApStatementDetail
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
