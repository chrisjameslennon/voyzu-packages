import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/core/common/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";

import { ArCounterpartyStatementReport } from "../../client";
import { ArCounterpartyStatementReportTemplate } from "../../client/templates/ArCounterpartyStatementReportTemplate";
import { getArCounterpartyStatement } from "../lib/ar-subledger-statement.service";

export async function ArStatementDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArCounterpartyStatement(company, decodeURIComponent(code));
  if (!statement) notFound();
  if (surface?.unframed) {
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
  const searchParams = surface?.searchParams ?? {};
  return (
    <ArCounterpartyStatementReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
