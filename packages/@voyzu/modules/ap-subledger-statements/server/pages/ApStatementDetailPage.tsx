import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/modules/common/server";
import { getSelectedCompany } from "@voyzu/modules/journals/server";

import { ApStatementDetail } from "../../client";
import { getApCounterpartyStatement } from "../lib/ap-subledger-statement.service";

export async function ApStatementDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getApCounterpartyStatement(company, decodeURIComponent(code));
  if (!statement) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ApStatementDetail
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
