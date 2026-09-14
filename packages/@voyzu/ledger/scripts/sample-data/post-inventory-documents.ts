import { FinanceSampleDataRepo } from "../db/sample-data.repo";
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import type { ApBillRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import type { ArInvoiceRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import type { InventoryAdjustmentRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import type { InventoryIssueRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import type { InventoryReceiptRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import { getPool } from "@voyzu/capability/db";
import { processApBill, processArInvoice } from "../../modules/financial-document-processing-engine/server/index";
import {
  processInventoryAdjustment,
  processInventoryIssue,
  processInventoryReceipt,
} from "../../modules/financial-document-processing-engine/server/index";

const COMPANY_CODE = "TESTCO";
const INVENTORY_ITEM_BILL_ID = "SAMP-BILL-ITEM-001";
const INVENTORY_ITEM_INVOICE_ID = "SAMP-INV-ITEM-001";
const STANDALONE_RECEIPT_ID = "SAMP-INV-DIR-REC";
const STANDALONE_ADJUSTMENT_ID = "SAMP-INV-DIR-ADJ";
const STANDALONE_ISSUE_ID = "SAMP-INV-DIR-ISS";

const SAMPLE_DOCUMENT_IDS = [
  "SAMPINVREC001",
  "SAMPINVIMP001",
  "SAMPINVADJ001",
  "SAMPINVISS001",
  "SAMP-INV-IMP-001",
  "SAMP-INV-ADJ-001",
  "SAMP-INV-ISS-001",
  INVENTORY_ITEM_BILL_ID,
  INVENTORY_ITEM_INVOICE_ID,
  STANDALONE_RECEIPT_ID,
  STANDALONE_ADJUSTMENT_ID,
  STANDALONE_ISSUE_ID,
];

async function cleanupInventoryScenario(): Promise<void> {
  const pool = getPool();
  const directJournalIds = await new FinanceSampleDataRepo(pool).findDocumentJournals(COMPANY_CODE, SAMPLE_DOCUMENT_IDS);
  const generatedInventoryJournalIds = await new FinanceSampleDataRepo(pool).findGeneratedInventoryJournals(COMPANY_CODE, SAMPLE_DOCUMENT_IDS);
  const ids = [...new Set([
    ...directJournalIds.rows.map((row) => Number(row.id)),
    ...generatedInventoryJournalIds.rows.map((row) => Number(row.id)),
  ])];

  if (ids.length) {
    await new FinanceSampleDataRepo(pool).disableTriggers();
    try {
      await new FinanceSampleDataRepo(pool).deleteInventoryLinesForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteInventoryHeadersForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteTaxHeadersForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteArHeadersForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteApHeadersForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteDimensionsForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteLinesForJournals(ids);
      await new FinanceSampleDataRepo(pool).deleteJournals(ids);
    } finally {
      await new FinanceSampleDataRepo(pool).enableTriggers();
    }
  }
}

async function postInventoryApBill(): Promise<void> {
  const request: ApBillRequestDto = {
    document_type: "AP_BILL",
    company_code: COMPANY_CODE,
    ap_counterparty: {
      code: "SAMP-SUPP-INV",
      name: "Inventory Supply Co",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: INVENTORY_ITEM_BILL_ID,
    supplier_invoice_number: "SUPP-SAMP-BILL-ITEM-001",
    bill_date: "2026-05-01",
    posting_date: "2026-05-01",
    dimensions: { SALES_CHANNEL: "Wholesale" },
    lines: [
      {
        line_id: 1,
        description: "Standard Widget inventory purchase",
        quantity: 100,
        net_amount: 5000,
        tax_rule: "NZ_STANDARD",
        gross_amount: 5750,
        inventory_item_code: "SKU-WID-001",
      },
    ],
  };
  const response = await processApBill(request);
  console.log(`posted ${response.detailed_document.document_id} - inventory AP bill journal ${response.posting_details.journal_header.code}`);
}

async function postInventoryArInvoice(): Promise<void> {
  const request: ArInvoiceRequestDto = {
    document_type: "AR_INVOICE",
    company_code: COMPANY_CODE,
    ar_counterparty: {
      code: "SAMP-CUST-INV",
      name: "Inventory Customer Ltd",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: INVENTORY_ITEM_INVOICE_ID,
    invoice_date: "2026-05-04",
    posting_date: "2026-05-04",
    dimensions: { SALES_CHANNEL: "Wholesale" },
    lines: [
      {
        line_id: 1,
        description: "Standard Widget inventory sale",
        quantity: 20,
        net_unit_price: 80,
        inventory_item_code: "SKU-WID-001",
        tax_rule: "NZ_STANDARD",
      },
    ],
  };
  const response = await processArInvoice(request);
  console.log(`posted ${response.detailed_document.document_id} - inventory AR invoice journal ${response.posting_details.journal_header.code}`);
}

async function postStandaloneInventoryDocuments(): Promise<void> {
  const receipt: InventoryReceiptRequestDto = {
    document_type: "INVENTORY_RECEIPT",
    company_code: COMPANY_CODE,
    document_id: STANDALONE_RECEIPT_ID,
    memo: "Direct inventory receipt",
    receipt_date: "2026-05-06",
    posting_date: "2026-05-06",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: "SKU-SPR-001",
        description: "Replacement Gear Set direct receipt",
        quantity_delta: 50,
        gl_account_code: "405000",
        valuation_method: "SUPPLIED_UNIT_BOOK_VALUE",
        unit_book_value: 25,
      },
    ],
  };
  const receiptResponse = await processInventoryReceipt(receipt);
  console.log(`posted ${receiptResponse.detailed_document.document_id} - standalone inventory receipt`);

  const adjustment: InventoryAdjustmentRequestDto = {
    document_type: "INVENTORY_ADJUSTMENT",
    company_code: COMPANY_CODE,
    document_id: STANDALONE_ADJUSTMENT_ID,
    memo: "Direct stocktake",
    adjustment_date: "2026-05-07",
    posting_date: "2026-05-07",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: "SKU-SPR-001",
        description: "Stocktake write-off",
        adjustment_type: "QUANTITY_ADJUSTMENT",
        quantity_delta: -5,
        reason_code: "STOCKTAKE_VARIANCE",
        gl_account_code: "505000",
      },
      {
        line_id: 2,
        inventory_item_code: "SKU-SPR-001",
        description: "Value correction",
        adjustment_type: "VALUE_ADJUSTMENT",
        book_value_delta: 75,
        reason_code: "VALUE_CORRECTION",
        gl_account_code: "405000",
      },
    ],
  };
  const adjustmentResponse = await processInventoryAdjustment(adjustment);
  console.log(`posted ${adjustmentResponse.detailed_document.document_id} - standalone inventory adjustment`);

  const issue: InventoryIssueRequestDto = {
    document_type: "INVENTORY_ISSUE",
    company_code: COMPANY_CODE,
    document_id: STANDALONE_ISSUE_ID,
    memo: "Direct internal issue",
    issue_date: "2026-05-08",
    posting_date: "2026-05-08",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: "SKU-SPR-001",
        description: "Replacement Gear Set internal repair issue",
        quantity_delta: -10,
        gl_account_code: "613000",
        issue_purpose: "CONSUMED",
      },
    ],
  };
  const issueResponse = await processInventoryIssue(issue);
  console.log(`posted ${issueResponse.detailed_document.document_id} - standalone inventory issue`);
}

async function main() {
  console.log("Posting sample inventory documents...");
  await cleanupInventoryScenario();
  await postInventoryApBill();
  await postInventoryArInvoice();
  await postStandaloneInventoryDocuments();
  console.log("Sample inventory documents posted.");
  await getPool().end();
}

main().catch(async (err) => {
  console.error("Sample inventory document posting failed:", err);
  await getPool().end();
  process.exitCode = 1;
});
