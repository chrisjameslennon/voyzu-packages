import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu-modules/core/common/server";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";

import { ArInvoiceReport } from "../../client";
import { getArInvoiceStatement } from "../lib/ar-invoice-statement.service";

export async function ArInvoiceDetailPage({
  documentId,
  surface,
}: {
  documentId?: string;
  surface?: { searchParams?: Record<string, string> };
}) {
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArInvoiceStatement(company, decodeURIComponent(documentId));
  if (!statement) notFound();
  const searchParams = surface?.searchParams ?? {};
  return (
    <ArInvoiceReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
