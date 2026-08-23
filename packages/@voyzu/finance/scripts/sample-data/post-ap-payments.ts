import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { ApPaymentRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine";
import { processApDocument } from "@voyzu/finance/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeBankText, SAMPLE_POSTING_COMPANIES, standardGross, type SampleCompanyConfig } from "./sample-company-config";

interface AllocatedPayment {
  kind: "allocated";
  counterpartyCode: string;
  documentId: string;
  paymentDate: string;
  allocations: Array<{
    billDocumentIdToAllocate: string;
    allocationAmount: number;
  }>;
  documentMemo: string;
}

interface UnappliedPayment {
  kind: "unapplied";
  counterpartyCode: string;
  documentId: string;
  paymentDate: string;
  paymentAmount: number;
  documentMemo: string;
}

type PaymentSeed = AllocatedPayment | UnappliedPayment;

const BANK_DETAILS_BY_DOCUMENT_ID: Record<string, { txId: string; txCode?: string | null; txRef?: string | null; txDetails?: string | null; paymentRef?: string | null }> = {
  "SAMP-AP-PAY-001": { txId: "ASB202605020037", txCode: "DD", txRef: "ACME DESIGN", txDetails: "Supplier batch payment", paymentRef: "SAMP-BILL-001" },
  "SAMP-AP-PAY-002": { txId: "ASB202605050041", txCode: "DD", txRef: "KIWI FIN", txDetails: "Part payment to supplier", paymentRef: "SAMP-BILL-003" },
  "SAMP-AP-PAY-003": { txId: "ASB202605070028", txCode: "DD", txRef: "GLOBAL TRADE ADV", txDetails: "Supplier advance payment", paymentRef: null },
  "SAMP-AP-PAY-004": { txId: "ASB202605060033", txCode: "DD", txRef: "KIWI FIN BULK", txDetails: "Bulk payment for May bills", paymentRef: "BILL-003 BILL-004" },
  "SAMP-AP-PAY-005": { txId: "ASB202605090019", txCode: null, txRef: "KIWI FIN", txDetails: "Supplier payment with overpayment", paymentRef: "SAMP-BILL-003" },
};

const PAYMENTS: PaymentSeed[] = [
  {
    kind: "allocated",
    counterpartyCode: "SAMP-SUPP-001",
    documentId: "SAMP-AP-PAY-001",
    paymentDate: "2026-05-02",
    allocations: [
      { billDocumentIdToAllocate: "SAMP-BILL-001", allocationAmount: 7475 },
    ],
    documentMemo: "Full settlement SAMP-BILL-001",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-SUPP-003",
    documentId: "SAMP-AP-PAY-002",
    paymentDate: "2026-05-05",
    allocations: [
      { billDocumentIdToAllocate: "SAMP-BILL-003", allocationAmount: 1000 },
    ],
    documentMemo: "Part payment SAMP-BILL-003",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-SUPP-003",
    documentId: "SAMP-AP-PAY-004",
    paymentDate: "2026-05-06",
    allocations: [
      { billDocumentIdToAllocate: "SAMP-BILL-003", allocationAmount: 1250 },
      { billDocumentIdToAllocate: "SAMP-BILL-004", allocationAmount: 1437.5 },
    ],
    documentMemo: "Applied to multiple bills",
  },
  {
    kind: "allocated",
    counterpartyCode: "SAMP-SUPP-003",
    documentId: "SAMP-AP-PAY-005",
    paymentDate: "2026-05-09",
    allocations: [
      { billDocumentIdToAllocate: "SAMP-BILL-003", allocationAmount: 1500 },
    ],
    documentMemo: "Overpayment SAMP-BILL-003",
  },
  {
    kind: "unapplied",
    counterpartyCode: "SAMP-SUPP-002",
    documentId: "SAMP-AP-PAY-003",
    paymentDate: "2026-05-07",
    paymentAmount: 500,
    documentMemo: "Supplier advance payment",
  },
];

function allocationAmount(amount: number, targetDocumentId: string, config: SampleCompanyConfig): number {
  if (config.companyCode !== "SAMP-CA") return amount;
  if (targetDocumentId === "SAMP-BILL-001") return standardGross(6500, config);
  if (targetDocumentId === "SAMP-BILL-004") return standardGross(1250, config);
  return amount;
}

function buildRequest(payment: PaymentSeed, config: SampleCompanyConfig): ApPaymentRequestDto {
  const bankDetails = BANK_DETAILS_BY_DOCUMENT_ID[payment.documentId];
  const common = {
    document_type: "AP_PAYMENT" as const,
    company_code: config.companyCode,
    ap_counterparty_code: payment.counterpartyCode,
    document_id: payment.documentId,
    payment_date: payment.paymentDate,
    memo: payment.documentMemo,
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: bankDetails.txId.replace("ASB", config.bankTxPrefix),
      tx_code: bankDetails.txCode,
      tx_ref: localizeBankText(bankDetails.txRef, config),
      tx_details: localizeBankText(bankDetails.txDetails, config),
      payment_ref: bankDetails.paymentRef,
    },
  };

  if (payment.kind === "allocated") {
    return {
      ...common,
      allocations: payment.allocations.map((allocation) => ({
        document_id: allocation.billDocumentIdToAllocate,
        amount: allocationAmount(allocation.allocationAmount, allocation.billDocumentIdToAllocate, config),
      })),
    };
  }

  return {
    ...common,
    payment_amount: payment.paymentAmount,
  };
}

function describeTarget(payment: PaymentSeed): string {
  return payment.kind === "allocated"
    ? `against ${payment.allocations.map((allocation) => allocation.billDocumentIdToAllocate).join(", ")}`
    : "unapplied (no allocation)";
}

async function postForCompany(config: SampleCompanyConfig) {
  for (const payment of PAYMENTS) {
    if (await skipExistingSampleDocument(config.companyCode, payment.documentId)) continue;
    const response = await processApDocument("AP_PAYMENT", buildRequest(payment, config));
    const detailed = response.detailed_document as { payment_amount: number; applied_amount: number; unapplied_amount: number };

    console.log(
      `posted ${config.companyCode} ${payment.documentId} - payment ${config.currencyCode} ${detailed.payment_amount} ` +
      `(applied ${detailed.applied_amount} + unapplied ${detailed.unapplied_amount}) ` +
      `${describeTarget(payment)} journal ${response.posting_details.journal_header.code}`,
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
