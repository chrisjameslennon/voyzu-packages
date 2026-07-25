import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import type { ApBillCancellationRequestDto } from "@voyzu/types/modules/financial-document-processing-engine";
import { processApDocument } from "@voyzu/modules/financial-document-processing-engine/core/ap_processing/ap-processing.service";
import { skipExistingSampleDocument } from "./sample-document";
import { SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

interface BillCancellationSeed {
  counterpartyCode: string;
  documentId: string;
  documentMemo: string;
  sourceBillDocumentId: string;
  cancellationDate: string;
}

const CANCELLATIONS: BillCancellationSeed[] = [
  {
    counterpartyCode: "SAMP-SUPP-004",
    documentId: "SAMP-AP-WD-001",
    documentMemo: "Withdraw SAMP-BILL-005",
    sourceBillDocumentId: "SAMP-BILL-005",
    cancellationDate: "2026-05-10",
  },
];

function buildRequest(cancellation: BillCancellationSeed, config: SampleCompanyConfig): ApBillCancellationRequestDto {
  return {
    document_type: "AP_BILL_CANCELLATION",
    company_code: config.companyCode,
    ap_counterparty_code: cancellation.counterpartyCode,
    document_id: cancellation.documentId,
    memo: cancellation.documentMemo,
    source_bill: { document_id: cancellation.sourceBillDocumentId },
    cancellation_date: cancellation.cancellationDate,
  };
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const cancellation of CANCELLATIONS) {
    if (await skipExistingSampleDocument(config.companyCode, cancellation.documentId)) continue;
    const request = buildRequest(cancellation, config);
    const response = await processApDocument("AP_BILL_CANCELLATION", request);
    const detailed = response.detailed_document as { source_bill_document_id: string; gross_amount: number };
    const taxDescriptions = [...new Set((response.tax_ledger_details ?? []).map((detail) => detail.description))]
      .filter(Boolean)
      .join(", ");

    console.log(
      `posted ${request.document_id} - withdrew ${detailed.source_bill_document_id} ` +
      `gross ${config.currencyCode} ${detailed.gross_amount} journal ${response.posting_details.journal_header.code}` +
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
