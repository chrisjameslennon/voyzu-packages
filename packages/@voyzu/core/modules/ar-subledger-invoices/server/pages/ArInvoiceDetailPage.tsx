import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "@voyzu/core/common/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";

import { ArInvoiceReport } from "../../client";
import { ArInvoiceReportTemplate } from "../../client/templates/ArInvoiceReportTemplate";
import { getArInvoiceStatement } from "../lib/ar-invoice-statement.service";

export async function ArInvoiceDetailPage({
  documentId,
  surface,
}: {
  documentId?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArInvoiceStatement(company, decodeURIComponent(documentId));
  if (!statement) notFound();
  if (surface?.unframed) {
    return (
      <ArInvoiceReportTemplate
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
    <ArInvoiceReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
