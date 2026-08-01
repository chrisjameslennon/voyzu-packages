import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { ApBillRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine";
import { processApBill } from "@voyzu/core/financial-document-processing-engine/ap_bill/lib/ap-bill.service";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeCounterpartyName, localizeTaxRule, SAMPLE_POSTING_COMPANIES, standardGross, type SampleCompanyConfig } from "./sample-company-config";

const BILLS: Array<{
  counterpartyCode: string;
  counterpartyName: string;
  documentId?: string;
  billDate: string;
  dimensions?: ApBillRequestDto["dimensions"];
  lines: ApBillRequestDto["lines"];
}> = [
  {
    counterpartyCode: "SAMP-SUPP-001",
    counterpartyName: "Acme Design Partners",
    documentId: "SAMP-BILL-001",
    billDate: "2026-04-15",
    lines: [
      { line_id: 1, description: "Website redesign", net_amount: 5000, tax_rule: "NZ_STANDARD", gross_amount: 5750 },
      { line_id: 2, description: "SEO audit", net_amount: 1500, tax_rule: "NZ_STANDARD", gross_amount: 1725 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-002",
    counterpartyName: "Global Trade NZ Ltd",
    documentId: "SAMP-BILL-002",
    billDate: "2026-04-22",
    lines: [
      { line_id: 1, description: "Export consulting", net_amount: 3500, tax_rule: "NZ_ZERO_RATED", gross_amount: 3500 },
      { line_id: 2, description: "Market research report", net_amount: 1200, tax_rule: "NZ_STANDARD", gross_amount: 1380 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-003",
    counterpartyName: "Kiwi Financial Services",
    documentId: "SAMP-BILL-003",
    billDate: "2026-05-01",
    lines: [
      { line_id: 1, description: "Accounting software licence", net_amount: 2400, tax_rule: "NZ_STANDARD", gross_amount: 2760 },
      { line_id: 2, description: "Financial advisory (exempt)", net_amount: 800, tax_rule: "NZ_EXEMPT", gross_amount: 800 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-003",
    counterpartyName: "Kiwi Financial Services",
    documentId: "SAMP-BILL-004",
    billDate: "2026-05-03",
    lines: [
      { line_id: 1, description: "Implementation support", net_amount: 1250, tax_rule: "NZ_STANDARD", gross_amount: 1437.5 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-004",
    counterpartyName: "Harbour Retail Group",
    documentId: "SAMP-BILL-005",
    billDate: "2026-05-09",
    lines: [
      { line_id: 1, description: "Monthly platform subscription", net_amount: 900, tax_rule: "NZ_STANDARD", gross_amount: 1035 },
      { line_id: 2, description: "Onboarding support", net_amount: 450, tax_rule: "NZ_STANDARD", gross_amount: 517.5 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-005",
    counterpartyName: "North Shore Wholesale",
    documentId: "SAMP-BILL-008",
    billDate: "2026-05-12",
    dimensions: null,
    lines: [
      { line_id: 1, description: "General setup", net_amount: 100, tax_rule: "NZ_STANDARD", gross_amount: 115 },
      { line_id: 2, description: "Direct campaign", net_amount: 200, tax_rule: "NZ_STANDARD", gross_amount: 230, dimensions: { SALES_CHANNEL: "Direct" } },
      { line_id: 3, description: "Online campaign", net_amount: 400, tax_rule: "NZ_STANDARD", gross_amount: 460, dimensions: { SALES_CHANNEL: "Online" } },
      { line_id: 4, description: "Wholesale campaign", net_amount: 800, tax_rule: "NZ_STANDARD", gross_amount: 920, dimensions: { SALES_CHANNEL: "Wholesale" } },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-002",
    counterpartyName: "Global Trade NZ Ltd",
    documentId: "SAMP-BILL-006",
    billDate: "2026-05-14",
    lines: [
      { line_id: 1, description: "Credit note target services", net_amount: 600, tax_rule: "NZ_STANDARD", gross_amount: 690 },
    ],
  },
  {
    counterpartyCode: "SAMP-SUPP-005",
    counterpartyName: "North Shore Wholesale",
    documentId: "SAMP-BILL-007",
    billDate: "2026-05-16",
    dimensions: null,
    lines: [
      { line_id: 1, description: "Write-off target balance", net_amount: 300, tax_rule: "NZ_STANDARD", gross_amount: 345 },
    ],
  },
];

async function postForCompany(config: SampleCompanyConfig) {
  const onlyIndex = process.argv.findIndex((arg) => arg === "--only");
  const onlyDocumentId = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;
  const bills = onlyDocumentId ? BILLS.filter((bill) => bill.documentId === onlyDocumentId) : BILLS;

  if (onlyIndex >= 0 && !onlyDocumentId) {
    throw new Error("--only requires a document id");
  }
  if (onlyDocumentId && bills.length === 0) {
    throw new Error(`No AP bill sample data found for ${onlyDocumentId}`);
  }

  for (const bill of bills) {
    if (await skipExistingSampleDocument(config.companyCode, bill.documentId)) continue;
    const response = await processApBill({
      document_type: "AP_BILL",
      company_code: config.companyCode,
      ap_counterparty_code: null,
      ap_counterparty: {
        code: bill.counterpartyCode,
        name: localizeCounterpartyName(bill.counterpartyName, config),
        status: "ACTIVE",
        country_code: config.countryCode,
        state_or_province_code: config.stateOrProvinceCode,
      },
      ...(bill.documentId ? { document_id: bill.documentId } : {}),
      supplier_invoice_number: bill.documentId ? `SUPP-${bill.documentId}` : `SUPP-${bill.counterpartyCode}-${bill.billDate.replaceAll("-", "")}`,
      bill_date: bill.billDate,
      dimensions: bill.dimensions === undefined ? { SALES_CHANNEL: "Direct" } : bill.dimensions,
      lines: bill.lines.map((line) => ({
        ...line,
        tax_rule: localizeTaxRule(line.tax_rule, config),
        gross_amount: line.tax_rule === "NZ_STANDARD" ? standardGross(line.net_amount, config) : line.gross_amount,
      })),
    });

    const { detailed_document, posting_details, tax_ledger_details } = response;
    const taxDescriptions = [...new Set(tax_ledger_details.map((detail) => detail.description))]
      .filter(Boolean)
      .join(", ");

    console.log(
      `posted ${config.companyCode} ${detailed_document.document_id} supplier ${localizeCounterpartyName(bill.counterpartyName, config)} ` +
      `gross ${config.currencyCode} ${detailed_document.gross_amount} ` +
      `(net ${detailed_document.net_amount} + tax ${detailed_document.tax_amount}) ` +
      `journal ${posting_details.journal_header.code}` +
      (taxDescriptions ? ` tax ${taxDescriptions}` : ""),
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
