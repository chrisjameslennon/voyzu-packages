import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import type { ApPaymentApplicationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine";
import { processApDocument } from "@voyzu-modules/core/financial-document-processing-engine/core/ap_processing/ap-processing.service";
import { skipExistingSampleDocument } from "./sample-document";
import { SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

interface PaymentApplicationSeed {
  counterpartyCode: string;
  documentId: string;
  applicationDate: string;
  documentMemo: string;
  sourcePaymentDocumentId: string;
  targetBillDocumentId: string;
  amount: number;
}

const APPLICATIONS: PaymentApplicationSeed[] = [
  {
    counterpartyCode: "SAMP-SUPP-002",
    documentId: "SAMP-AP-APP-001",
    applicationDate: "2026-05-08",
    documentMemo: "Apply supplier advance",
    sourcePaymentDocumentId: "SAMP-AP-PAY-003",
    targetBillDocumentId: "SAMP-BILL-002",
    amount: 250,
  },
];

function buildRequest(application: PaymentApplicationSeed, config: SampleCompanyConfig): ApPaymentApplicationRequestDto {
  return {
    document_type: "AP_PAYMENT_APPLICATION",
    company_code: config.companyCode,
    ap_counterparty_code: application.counterpartyCode,
    document_id: application.documentId,
    memo: application.documentMemo,
    application_date: application.applicationDate,
    applications: [
      {
        source_payment: { document_id: application.sourcePaymentDocumentId },
        target_bill: { document_id: application.targetBillDocumentId },
        amount: application.amount,
      },
    ],
  };
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const application of APPLICATIONS) {
    if (await skipExistingSampleDocument(config.companyCode, application.documentId)) continue;
    const request = buildRequest(application, config);
    const response = await processApDocument("AP_PAYMENT_APPLICATION", request);
    const detailed = response.detailed_document as {
      total_application_amount: number;
      applications: Array<{ source_payment_document_id: string; target_bill_document_id: string }>;
    };
    const line = detailed.applications[0];

    console.log(
      `posted ${config.companyCode} ${request.document_id} - applied ${config.currencyCode} ${detailed.total_application_amount} ` +
      `from ${line.source_payment_document_id} to ${line.target_bill_document_id} ` +
      `journal ${response.posting_details.journal_header.code}`,
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
