import { internalApi } from "@voyzu/capability/internal-api";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { normalizeDetailBackSource } from "../../../common/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ArInvoiceReport } from "../../client/index";
import { ArInvoiceReportTemplate } from "../../client/templates/ArInvoiceReportTemplate";
import { getArInvoiceStatement } from "../lib/ar-invoice-statement.service";

export async function ArInvoiceDetailPage({ context }: PageProps) {
  if (!internalApi.has("@erp/ledger-documents")) return <IntegrationUnavailablePage pageTitle="Accounting document" packageName="Ledger" message="Install the Ledger package to view the accounting records for this document." icon="account_balance" />;
  const { documentId } = pageStringParameters(context.pathParams);
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const statement = await getArInvoiceStatement(company, documentId);
  if (!statement) notFound();
  if (context.routeDefinition.unframed) {
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
  const searchParams = pageStringParameters(context.queryParams);
  return (
    <ArInvoiceReport
      statement={statement}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
