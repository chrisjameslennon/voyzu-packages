import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { ArReceiptRequestDto } from "@voyzu/types/modules/financial-document-processing-engine";
import { processArReceipt } from "@voyzu/modules/financial-document-processing-engine/ar_receipt/lib/ar-receipt.service";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeBankText, SAMPLE_POSTING_COMPANIES, standardGross, type SampleCompanyConfig } from "./sample-company-config";

interface AllocatedReceipt {
  kind: "allocated";
  counterpartyCode: string;
  documentId: string;
  paymentDate: string;
  allocations: Array<{
    invoiceDocumentIdToAllocate: string;
    allocationAmount: number;
  }>;
  documentMemo: string;
}

interface UnappliedReceipt {
  kind: "unapplied";
  counterpartyCode: string;
  documentId: string;
  paymentDate: string;
  receiptAmount: number;
  documentMemo: string;
}

type ReceiptSeed = AllocatedReceipt | UnappliedReceipt;

const BANK_DETAILS_BY_DOCUMENT_ID: Record<string, { txId: string; txCode?: string | null; txRef?: string | null; txDetails?: string | null; paymentRef?: string | null }> = {
  "SAMP-PAY-001": { txId: "ASB202605020001", txCode: "CR", txRef: "INV001 ACME DESIGN", txDetails: "Acme Design Partners online payment", paymentRef: "INV-001" },
  "SAMP-PAY-002": { txId: "ASB202605050014", txCode: "CR", txRef: "KIWI FIN MAY", txDetails: "Kiwi Financial Services part payment", paymentRef: "SAMP-INV-003" },
  "SAMP-PAY-003": { txId: "ASB202605070009", txCode: "CR", txRef: "GLOBAL TRADE ADV", txDetails: "Customer advance received", paymentRef: null },
  "SAMP-PAY-004": { txId: "ASB202605060022", txCode: "CR", txRef: "KIWI FIN BULK", txDetails: "Bulk receipt for May invoices", paymentRef: "INV-003 INV-004" },
  "SAMP-PAY-005": { txId: "ASB202605090006", txCode: null, txRef: "KIWI FIN", txDetails: "Customer receipt with overpayment", paymentRef: "SAMP-INV-003" },
};

const RECEIPTS: ReceiptSeed[] = [
  {
    kind: "allocated",
    counterpartyCode: "SAMP-CUST-001",
    documentId: "SAMP-PAY-001",
    paymentDate: "2026-05-02",
    allocations: [
      { invoiceDocumentIdToAllocate: "SAMP-INV-001", allocationAmount: 7475 },
    ],
    documentMemo: "Full settlement SAMP-INV-001",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-CUST-003",
    documentId: "SAMP-PAY-002",
    paymentDate: "2026-05-05",
    allocations: [
      { invoiceDocumentIdToAllocate: "SAMP-INV-003", allocationAmount: 1000 },
    ],
    documentMemo: "Part payment SAMP-INV-003",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-CUST-003",
    documentId: "SAMP-PAY-004",
    paymentDate: "2026-05-06",
    allocations: [
      { invoiceDocumentIdToAllocate: "SAMP-INV-003", allocationAmount: 1250 },
      { invoiceDocumentIdToAllocate: "SAMP-INV-004", allocationAmount: 1437.5 },
    ],
    documentMemo: "Applied to multiple invoices",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-CUST-003",
    documentId: "SAMP-PAY-005",
    paymentDate: "2026-05-09",
    allocations: [
      { invoiceDocumentIdToAllocate: "SAMP-INV-003", allocationAmount: 1500 },
    ],
    documentMemo: "Overpayment SAMP-INV-003",
  },
  {
    kind: "unapplied",
    counterpartyCode: "SAMP-CUST-002",
    documentId: "SAMP-PAY-003",
    paymentDate: "2026-05-07",
    receiptAmount: 500,
    documentMemo: "Customer advance",
  },
];

function allocationAmount(amount: number, targetDocumentId: string, config: SampleCompanyConfig): number {
  if (config.companyCode !== "SAMP-CA") return amount;
  if (targetDocumentId === "SAMP-INV-001") return standardGross(6500, config);
  if (targetDocumentId === "SAMP-INV-004") return standardGross(1250, config);
  return amount;
}

function buildRequest(receipt: ReceiptSeed, config: SampleCompanyConfig): ArReceiptRequestDto {
  const bankDetails = BANK_DETAILS_BY_DOCUMENT_ID[receipt.documentId];
  const common = {
    document_type: "AR_RECEIPT" as const,
    company_code: config.companyCode,
    ar_counterparty_code: receipt.counterpartyCode,
    document_id: receipt.documentId,
    payment_date: receipt.paymentDate,
    memo: receipt.documentMemo,
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: bankDetails.txId.replace("ASB", config.bankTxPrefix),
      tx_code: bankDetails.txCode,
      tx_ref: localizeBankText(bankDetails.txRef, config),
      tx_details: localizeBankText(bankDetails.txDetails, config),
      payment_ref: bankDetails.paymentRef,
    },
  };

  if (receipt.kind === "allocated") {
    return {
      ...common,
      allocations: receipt.allocations.map((allocation) => ({
        document_id: allocation.invoiceDocumentIdToAllocate,
        amount: allocationAmount(allocation.allocationAmount, allocation.invoiceDocumentIdToAllocate, config),
      })),
    };
  }

  return {
    ...common,
    receipt_amount: receipt.receiptAmount,
  };
}

function describeTarget(receipt: ReceiptSeed): string {
  return receipt.kind === "allocated"
    ? `against ${receipt.allocations.map((allocation) => allocation.invoiceDocumentIdToAllocate).join(", ")}`
    : "unapplied (no allocation)";
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const receipt of RECEIPTS) {
    if (await skipExistingSampleDocument(config.companyCode, receipt.documentId)) continue;
    const response = await processArReceipt(buildRequest(receipt, config));
    const { detailed_document, posting_details } = response;

    console.log(
      `posted ${config.companyCode} ${receipt.documentId} - receipt ${config.currencyCode} ${detailed_document.receipt_amount} ` +
      `(applied ${detailed_document.applied_amount} + unapplied ${detailed_document.unapplied_amount}) ` +
      `${describeTarget(receipt)} → journal ${posting_details.journal_header.code}`,
    );
  }
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postForCompany(company);
  }

  await getPool().end();
}

main();
