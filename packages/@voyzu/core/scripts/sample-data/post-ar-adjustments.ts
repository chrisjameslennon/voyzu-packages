import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { processArAdjustment } from "@voyzu/core/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeBankText, localizeTaxRule, SAMPLE_POSTING_COMPANIES, standardGross, type SampleCompanyConfig } from "./sample-company-config";

async function postOpeningBalance(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-OB-001")) return;
  const response = await processArAdjustment("AR_OPENING_BALANCE", {
    document_type: "AR_OPENING_BALANCE",
    company_code: config.companyCode,
    ar_counterparty_code: "SAMP-CUST-001",
    document_id: "SAMP-OB-001",
    memo: "Opening AR balance",
    opening_balance_date: "2026-04-01",
    items: [
      {
        line_id: 1,
        external_reference: "LEGACY-AR-001",
        description: "Legacy opening invoice",
        original_invoice_date: "2026-03-20",
        due_date: "2026-04-20",
        amount: 460,
      },
    ],
  });

  console.log(
    `posted ${config.companyCode} SAMP-OB-001 - opening AR ${config.currencyCode} ${response.detailed_document.document_type === "AR_OPENING_BALANCE" ? response.detailed_document.total_amount : 0} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postCreditNoteAppliedToInvoice(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-CN-001")) return;
  const grossAmount = standardGross(200, config);
  const response = await processArAdjustment("AR_CREDIT_NOTE", {
    document_type: "AR_CREDIT_NOTE",
    company_code: config.companyCode,
    ar_counterparty_code: "SAMP-CUST-002",
    document_id: "SAMP-CN-001",
    memo: "Credit note applied to invoice",
    credit_note_date: "2026-05-17",
    revenue_posting_code: "400000",
    lines: [
      { line_id: 1, description: "Service credit", quantity: 1, net_unit_price: 200, tax_rule: localizeTaxRule("NZ_STANDARD", config) },
    ],
    allocations: [
      { document_id: "SAMP-INV-006", amount: grossAmount },
    ],
  });

  console.log(
    `posted ${config.companyCode} SAMP-CN-001 - credit note ${config.currencyCode} ${response.detailed_document.document_type === "AR_CREDIT_NOTE" ? response.detailed_document.gross_amount : 0} ` +
    `applied to SAMP-INV-006 journal ${response.posting_details.journal_header.code}`,
  );
}

async function postCreditNoteForRefund(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-CN-002")) return;
  const response = await processArAdjustment("AR_CREDIT_NOTE", {
    document_type: "AR_CREDIT_NOTE",
    company_code: config.companyCode,
    ar_counterparty_code: "SAMP-CUST-005",
    document_id: "SAMP-CN-002",
    memo: "Unapplied credit for refund",
    credit_note_date: "2026-05-18",
    revenue_posting_code: "400000",
    lines: [
      { line_id: 1, description: "Refundable customer credit", net_line_total: 100, tax_rule: localizeTaxRule("NZ_STANDARD", config) },
    ],
  });

  console.log(
    `posted ${config.companyCode} SAMP-CN-002 - unapplied credit ${config.currencyCode} ${response.detailed_document.document_type === "AR_CREDIT_NOTE" ? response.detailed_document.unapplied_amount : 0} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postRefund(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-REF-001")) return;
  const response = await processArAdjustment("AR_REFUND", {
    document_type: "AR_REFUND",
    company_code: config.companyCode,
    ar_counterparty_code: "SAMP-CUST-005",
    document_id: "SAMP-REF-001",
    memo: "Refund unapplied credit",
    refund_date: "2026-05-19",
    refund_amount: standardGross(100, config),
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: `${config.bankTxPrefix}202605190018`,
      tx_code: "DR",
      tx_ref: "NORTH SHORE REFUND",
      tx_details: localizeBankText("Customer refund processed by direct credit", config),
      payment_ref: null,
    },
  });

  console.log(
    `posted ${config.companyCode} SAMP-REF-001 - refunded ${config.currencyCode} ${response.detailed_document.document_type === "AR_REFUND" ? response.detailed_document.refund_amount : 0} ` +
    `against unapplied balance journal ${response.posting_details.journal_header.code}`,
  );
}

async function postWriteOff(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-WO-001")) return;
  const response = await processArAdjustment("AR_WRITE_OFF", {
    document_type: "AR_WRITE_OFF",
    company_code: config.companyCode,
    ar_counterparty_code: "SAMP-CUST-005",
    document_id: "SAMP-WO-001",
    memo: "Partial write-off",
    write_off_date: "2026-05-20",
    applications: [
      { target_invoice: { document_id: "SAMP-INV-007" }, amount: 50 },
    ],
  });

  console.log(
    `posted ${config.companyCode} SAMP-WO-001 - wrote off ${config.currencyCode} ${response.detailed_document.document_type === "AR_WRITE_OFF" ? response.detailed_document.total_write_off_amount : 0} ` +
    `against SAMP-INV-007 journal ${response.posting_details.journal_header.code}`,
  );
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postOpeningBalance(company);
    await postCreditNoteAppliedToInvoice(company);
    await postCreditNoteForRefund(company);
    await postRefund(company);
    await postWriteOff(company);
  }
  await getPool().end();
}

main();
