import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { processTaxDocument } from "@voyzu/finance/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeBankText, SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

async function postTaxPayment(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-TAX-PAY-001")) return;
  const response = await processTaxDocument("TAX_PAYMENT", {
    document_type: "TAX_PAYMENT",
    company_code: config.companyCode,
    tax_authority_code: config.taxAuthorityCode,
    document_id: "SAMP-TAX-PAY-001",
    memo: "Sample tax payment",
    payment_date: "2026-05-22",
    payment_amount: 500,
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: `${config.bankTxPrefix}202605220031`,
      tx_code: "DR",
      tx_ref: `${config.taxAuthorityCode} TAX PAYMENT`,
      tx_details: localizeBankText(`Sample tax payment to ${config.taxAuthorityCode}`, config),
      payment_ref: "SAMP-TAX-PAY-001",
    },
  });

  console.log(
    `posted ${config.companyCode} SAMP-TAX-PAY-001 - tax payment ${config.currencyCode} ${response.detailed_document.payment_amount ?? 0} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postTaxRefund(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-TAX-REF-001")) return;
  const response = await processTaxDocument("TAX_REFUND", {
    document_type: "TAX_REFUND",
    company_code: config.companyCode,
    tax_authority_code: config.taxAuthorityCode,
    document_id: "SAMP-TAX-REF-001",
    memo: "Sample tax refund",
    refund_date: "2026-05-23",
    refund_amount: 300,
    bank_cash_details: {
      code: "BANK_OPERATING",
      tx_id: `${config.bankTxPrefix}202605230014`,
      tx_code: "CR",
      tx_ref: `${config.taxAuthorityCode} TAX REFUND`,
      tx_details: localizeBankText(`Sample tax refund from ${config.taxAuthorityCode}`, config),
      payment_ref: "SAMP-TAX-REF-001",
    },
  });

  console.log(
    `posted ${config.companyCode} SAMP-TAX-REF-001 - tax refund ${config.currencyCode} ${response.detailed_document.refund_amount ?? 0} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function postTaxAdjustment(config: SampleCompanyConfig) {
  if (await skipExistingSampleDocument(config.companyCode, "SAMP-TAX-ADJ-001")) return;
  const response = await processTaxDocument("TAX_ADJUSTMENT", {
    document_type: "TAX_ADJUSTMENT",
    company_code: config.companyCode,
    tax_authority_code: config.taxAuthorityCode,
    document_id: "SAMP-TAX-ADJ-001",
    memo: "Sample tax adjustment",
    adjustment_date: "2026-05-24",
    tax_movement_code: "TAX_ON_SALES",
    adjustment_effect: "INCREASES_TAX_PAYABLE",
    adjustment_amount: 100,
  });

  console.log(
    `posted ${config.companyCode} SAMP-TAX-ADJ-001 - tax adjustment ${config.currencyCode} ${response.detailed_document.adjustment_amount ?? 0} ` +
    `journal ${response.posting_details.journal_header.code}`,
  );
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postTaxPayment(company);
    await postTaxRefund(company);
    await postTaxAdjustment(company);
  }
  await getPool().end();
}

main();
