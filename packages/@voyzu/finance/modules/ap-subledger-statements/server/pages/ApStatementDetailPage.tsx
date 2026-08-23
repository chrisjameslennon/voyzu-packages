import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/finance/common/server";
import { getSelectedCompany } from "@voyzu/finance/journals/server";

import { ApStatementDetail } from "../../client";
import { ApCounterpartyStatementReportTemplate } from "../../client/templates/ApCounterpartyStatementReportTemplate";
import { getApCounterpartyStatement } from "../lib/ap-subledger-statement.service";

export async function ApStatementDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getApCounterpartyStatement(company, decodeURIComponent(code));
  if (!statement) notFound();
  if (surface?.unframed) {
    return <ApCounterpartyStatementReportTemplate statement={statement} generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }
  const searchParams = surface?.searchParams ?? {};
  return (
    <ApStatementDetail
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
