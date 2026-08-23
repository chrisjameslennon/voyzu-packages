import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import type { ArReceiptApplicationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine";
import { processArReceiptApplication } from "@voyzu/finance/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

interface ReceiptApplicationSeed {
  counterpartyCode: string;
  documentId: string;
  applicationDate: string;
  documentMemo: string;
  sourceReceiptDocumentId: string;
  targetInvoiceDocumentId: string;
  amount: number;
}

const APPLICATIONS: ReceiptApplicationSeed[] = [
  {
    counterpartyCode: "SAMP-CUST-002",
    documentId: "SAMP-APP-001",
    applicationDate: "2026-05-08",
    documentMemo: "Apply customer advance",
    sourceReceiptDocumentId: "SAMP-PAY-003",
    targetInvoiceDocumentId: "SAMP-INV-002",
    amount: 250,
  },
];

function buildRequest(application: ReceiptApplicationSeed, config: SampleCompanyConfig): ArReceiptApplicationRequestDto {
  return {
    document_type: "AR_RECEIPT_APPLICATION",
    company_code: config.companyCode,
    ar_counterparty_code: application.counterpartyCode,
    document_id: application.documentId,
    document_memo: application.documentMemo,
    application_date: application.applicationDate,
    applications: [
      {
        source_receipt: { document_id: application.sourceReceiptDocumentId },
        target_invoice: { document_id: application.targetInvoiceDocumentId },
        amount: application.amount,
      },
    ],
  };
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const application of APPLICATIONS) {
    if (await skipExistingSampleDocument(config.companyCode, application.documentId)) continue;
    const request = buildRequest(application, config);
    const response = await processArReceiptApplication(request);
    const { detailed_document, posting_details } = response;
    const line = detailed_document.applications[0];

    console.log(
      `posted ${config.companyCode} ${request.document_id} - applied ${config.currencyCode} ${detailed_document.total_application_amount} ` +
      `from ${line.source_receipt_document_id} ` +
      `to ${line.target_invoice_document_id} ` +
      `(source remaining ${line.source_receipt_open_amount_after}, invoice remaining ${line.target_invoice_open_amount_after}) ` +
      `journal ${posting_details.journal_header.code}`,
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
