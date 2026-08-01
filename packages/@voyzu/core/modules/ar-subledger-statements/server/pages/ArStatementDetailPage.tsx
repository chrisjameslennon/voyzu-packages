import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/core/common/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";

import { ArCounterpartyStatementReport } from "../../client";
import { getArCounterpartyStatement } from "../lib/ar-subledger-statement.service";

export async function ArStatementDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArCounterpartyStatement(company, decodeURIComponent(code));
  if (!statement) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ArCounterpartyStatementReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
