import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { processApDocument } from "@voyzu-modules/all-modules/financial-document-processing-engine/core/ap_processing/ap-processing.service";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeBankText, localizeTaxRule, SAMPLE_POSTING_COMPANIES, standardGross, type SampleCompanyConfig } from "./sample-company-config";

async function postOpeningBalance(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-AP-OB-001")) return;
  const response = await processApDocument("AP_OPENING_BALANCE", {
    document_type: "AP_OPENING_BALANCE",
    company_code: config.companyCode,
    ap_counterparty_code: "SAMP-SUPP-001",
    document_id: "SAMP-AP-OB-001",
    memo: "Opening AP balance",
    opening_balance_date: "2026-04-01",
    items: [
      {
        line_id: 1,
        external_reference: "LEGACY-AP-001",
        description: "Legacy opening bill",
        gross_amount: 460,
      },
    ],
  });
  const detailed = response.detailed_document as { total_amount: number };

  console.log(
    `posted ${config.companyCode} SAMP-AP-OB-001 - opening AP ${config.currencyCode} ${detailed.total_amount} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postCreditNoteAppliedToBill(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-AP-CN-001")) return;
  const grossAmount = standardGross(200, config);
  const response = await processApDocument("AP_CREDIT_NOTE", {
    document_type: "AP_CREDIT_NOTE",
    company_code: config.companyCode,
    ap_counterparty_code: "SAMP-SUPP-002",
    document_id: "SAMP-AP-CN-001",
    supplier_credit_note_number: "SUPP-CN-001",
    memo: "Credit note applied to bill",
    credit_note_date: "2026-05-17",
    purchase_posting_code: "699000",
    lines: [
      { line_id: 1, description: "Service credit", net_amount: 200, tax_rule: localizeTaxRule("NZ_STANDARD", config), gross_amount: grossAmount },
    ],
    allocations: [
      { document_id: "SAMP-BILL-006", amount: grossAmount },
    ],
  });
  const detailed = response.detailed_document as { gross_amount: number };

  console.log(
    `posted ${config.companyCode} SAMP-AP-CN-001 - credit note ${config.currencyCode} ${detailed.gross_amount} ` +
    `applied to SAMP-BILL-006 journal ${response.posting_details.journal_header.code}`,
  );
}

async function postCreditNoteForRefund(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-AP-CN-002")) return;
  const grossAmount = standardGross(100, config);
  const response = await processApDocument("AP_CREDIT_NOTE", {
    document_type: "AP_CREDIT_NOTE",
    company_code: config.companyCode,
    ap_counterparty_code: "SAMP-SUPP-005",
    document_id: "SAMP-AP-CN-002",
    supplier_credit_note_number: "SUPP-CN-002",
    memo: "Unapplied credit for refund",
    credit_note_date: "2026-05-18",
    purchase_posting_code: "699000",
    lines: [
      { line_id: 1, description: "Refundable supplier credit", net_amount: 100, tax_rule: localizeTaxRule("NZ_STANDARD", config), gross_amount: grossAmount },
    ],
  });
  const detailed = response.detailed_document as { unapplied_amount: number };

  console.log(
    `posted ${config.companyCode} SAMP-AP-CN-002 - unapplied credit ${config.currencyCode} ${detailed.unapplied_amount} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postRefund(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-AP-REF-001")) return;
  const response = await processApDocument("AP_REFUND", {
    document_type: "AP_REFUND",
    company_code: config.companyCode,
    ap_counterparty_code: "SAMP-SUPP-005",
    document_id: "SAMP-AP-REF-001",
    memo: "Refund unapplied credit",
    refund_date: "2026-05-19",
    refund_amount: standardGross(100, config),
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: `${config.bankTxPrefix}202605190027`,
      tx_code: "CR",
      tx_ref: "NORTH SHORE REFUND",
      tx_details: localizeBankText("Supplier refund received", config),
      payment_ref: null,
    },
  });
  const detailed = response.detailed_document as { refund_amount: number };

  console.log(
    `posted ${config.companyCode} SAMP-AP-REF-001 - refunded ${config.currencyCode} ${detailed.refund_amount} ` +
    `against unapplied balance journal ${response.posting_details.journal_header.code}`,
  );
}

async function postWriteOff(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-AP-WO-001")) return;
  const response = await processApDocument("AP_WRITE_OFF", {
    document_type: "AP_WRITE_OFF",
    company_code: config.companyCode,
    ap_counterparty_code: "SAMP-SUPP-005",
    document_id: "SAMP-AP-WO-001",
    memo: "Partial write-off",
    write_off_date: "2026-05-20",
    applications: [
      { target_bill: { document_id: "SAMP-BILL-007" }, amount: 50 },
    ],
  });
  const detailed = response.detailed_document as { total_write_off_amount: number };

  console.log(
    `posted ${config.companyCode} SAMP-AP-WO-001 - wrote off ${config.currencyCode} ${detailed.total_write_off_amount} ` +
    `against SAMP-BILL-007 journal ${response.posting_details.journal_header.code}`,
  );
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postOpeningBalance(company);
    await postCreditNoteAppliedToBill(company);
    await postCreditNoteForRefund(company);
    await postRefund(company);
    await postWriteOff(company);
  }
  await getPool().end();
}

main();
