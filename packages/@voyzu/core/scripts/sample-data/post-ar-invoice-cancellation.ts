import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import type { ArInvoiceCancellationRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine";
import { processArInvoiceCancellation } from "@voyzu/core/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

interface InvoiceCancellationSeed {
  counterpartyCode: string;
  documentId: string;
  documentMemo: string;
  sourceInvoiceDocumentId: string;
  cancellationDate: string;
}

const CANCELLATIONS: InvoiceCancellationSeed[] = [
  {
    counterpartyCode: "SAMP-CUST-004",
    documentId: "SAMP-WD-001",
    documentMemo: "Withdraw SAMP-INV-005",
    sourceInvoiceDocumentId: "SAMP-INV-005",
    cancellationDate: "2026-05-10",
  },
];

function buildRequest(cancellation: InvoiceCancellationSeed, config: SampleCompanyConfig): ArInvoiceCancellationRequestDto {
  return {
    document_type: "AR_INVOICE_CANCELLATION",
    company_code: config.companyCode,
    ar_counterparty_code: cancellation.counterpartyCode,
    document_id: cancellation.documentId,
    document_memo: cancellation.documentMemo,
    source_invoice: { document_id: cancellation.sourceInvoiceDocumentId },
    cancellation_date: cancellation.cancellationDate,
  };
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const cancellation of CANCELLATIONS) {
    if (await skipExistingSampleDocument(config.companyCode, cancellation.documentId)) continue;
    const request = buildRequest(cancellation, config);
    const response = await processArInvoiceCancellation(request);
    const { detailed_document, posting_details, tax_ledger_details } = response;
    const taxDescriptions = [...new Set(tax_ledger_details.map((detail) => detail.description))]
      .filter(Boolean)
      .join(", ");

    console.log(
      `posted ${request.document_id} - withdrew ${detailed_document.source_invoice_document_id} ` +
      `gross ${config.currencyCode} ${detailed_document.gross_amount} journal ${posting_details.journal_header.code}` +
      (taxDescriptions ? ` tax ${taxDescriptions}` : ""),
    );
  }
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postForCompany(company);
  }

  const { getPool } = await import("@voyzu/capability/db");
  await getPool().end();
}

main();
