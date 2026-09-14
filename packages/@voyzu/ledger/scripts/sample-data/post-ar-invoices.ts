import { FinanceSampleDataRepo } from "../db/sample-data.repo";
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { ArInvoiceRequestDto } from "../../modules/financial-document-processing-engine/types/index";
import { processArInvoice } from "../../modules/financial-document-processing-engine/server/index";
import { skipExistingSampleDocument } from "./sample-document";
import { localizeCounterpartyName, localizeTaxRule, SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

const HISTORICAL_INVOICE_DATE = "2025-05-15";

const MONTH_CODES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const INVOICES: Array<{
  counterpartyCode: string;
  counterpartyName: string;
  documentId?: string;
  invoiceDate: string;
  dimensions?: ArInvoiceRequestDto["dimensions"];
  lines: ArInvoiceRequestDto["lines"];
}> = [
    {
      counterpartyCode: "SAMP-CUST-001",
      counterpartyName: "Acme Design Partners",
      documentId: "SAMP-INV-001",
      invoiceDate: "2026-04-15",
      lines: [
        { line_id: 1, description: "Website redesign", quantity: 1, net_unit_price: 5000, tax_rule: "NZ_STANDARD" },
        { line_id: 2, description: "SEO audit", quantity: 2, net_unit_price: 750, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-002",
      counterpartyName: "Global Trade NZ Ltd",
      documentId: "SAMP-INV-002",
      invoiceDate: "2026-04-22",
      lines: [
        { line_id: 1, description: "Export consulting", net_line_total: 3500, tax_rule: "NZ_ZERO_RATED" },
        { line_id: 2, description: "Market research report", quantity: 1, net_unit_price: 1200, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-001",
      counterpartyName: "Acme Design Partners",
      documentId: "SAMP-INV-009",
      invoiceDate: "2025-05-15",
      lines: [
        { line_id: 1, description: "May 2025 sample invoice", net_line_total: 1000, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-003",
      counterpartyName: "Kiwi Financial Services",
      documentId: "SAMP-INV-003",
      invoiceDate: "2026-05-01",
      lines: [
        { line_id: 1, description: "Accounting software licence", quantity: 12, net_unit_price: 200, tax_rule: "NZ_STANDARD" },
        { line_id: 2, description: "Financial advisory (exempt)", net_line_total: 800, tax_rule: "NZ_EXEMPT" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-003",
      counterpartyName: "Kiwi Financial Services",
      documentId: "SAMP-INV-004",
      invoiceDate: "2026-05-03",
      lines: [
        { line_id: 1, description: "Implementation support", quantity: 5, net_unit_price: 250, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-004",
      counterpartyName: "Harbour Retail Group",
      documentId: "SAMP-INV-005",
      invoiceDate: "2026-05-09",
      lines: [
        { line_id: 1, description: "Monthly platform subscription", quantity: 1, net_unit_price: 900, tax_rule: "NZ_STANDARD" },
        { line_id: 2, description: "Onboarding support", quantity: 3, net_unit_price: 150, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-005",
      counterpartyName: "North Shore Wholesale",
      documentId: "SAMP-INV-008",
      invoiceDate: "2026-05-12",
      dimensions: null,
      lines: [
        { line_id: 1, description: "General setup", net_line_total: 100, tax_rule: "NZ_STANDARD" },
        { line_id: 2, description: "Direct campaign", net_line_total: 200, tax_rule: "NZ_STANDARD", dimensions: { SALES_CHANNEL: "Direct" } },
        { line_id: 3, description: "Online campaign", net_line_total: 400, tax_rule: "NZ_STANDARD", dimensions: { SALES_CHANNEL: "Online" } },
        { line_id: 4, description: "Wholesale campaign", net_line_total: 800, tax_rule: "NZ_STANDARD", dimensions: { SALES_CHANNEL: "Wholesale" } },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-002",
      counterpartyName: "Global Trade NZ Ltd",
      documentId: "SAMP-INV-006",
      invoiceDate: "2026-05-14",
      lines: [
        { line_id: 1, description: "Credit note target services", quantity: 1, net_unit_price: 600, tax_rule: "NZ_STANDARD" },
      ],
    },
    {
      counterpartyCode: "SAMP-CUST-005",
      counterpartyName: "North Shore Wholesale",
      documentId: "SAMP-INV-007",
      invoiceDate: "2026-05-16",
      dimensions: null,
      lines: [
        { line_id: 1, description: "Write-off target balance", quantity: 1, net_unit_price: 300, tax_rule: "NZ_STANDARD" },
      ],
    },
  ];

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function ensureOpenFiscalPeriodFor(companyCode: string, date: string): Promise<void> {
  const pool = getPool();
  const { rows } = await new FinanceSampleDataRepo(pool).findFiscalYear(companyCode, date);
  const year = rows[0];
  if (!year) throw new Error(`No fiscal year found for ${companyCode} on ${date}`);

  await new FinanceSampleDataRepo(pool).openFiscalYear(year.fiscal_year_id);

  const fyStart = new Date(`${year.start_date}T00:00:00`);
  const fyEnd = new Date(`${year.end_date}T00:00:00`);
  let current = new Date(fyStart.getFullYear(), fyStart.getMonth(), 1);

  while (current <= fyEnd) {
    const monthIndex = current.getMonth();
    const calendarYear = current.getFullYear();
    const code = MONTH_CODES[monthIndex];
    const name = MONTH_NAMES[monthIndex];
    const startDate = localDateString(new Date(calendarYear, monthIndex, 1));
    const endDate = localDateString(new Date(calendarYear, monthIndex + 1, 0));
    const updated = await new FinanceSampleDataRepo(pool).updateOpenFiscalPeriod(year.fiscal_year_id, code, startDate, endDate);

    if (updated.rowCount === 0) {
      await new FinanceSampleDataRepo(pool).insertOpenFiscalPeriod(year.finance_organization_id, year.fiscal_year_id, code, name, startDate, endDate);
    }
    current = new Date(calendarYear, monthIndex + 1, 1);
  }
}

async function postForCompany(config: SampleCompanyConfig) {
  await ensureOpenFiscalPeriodFor(config.companyCode, HISTORICAL_INVOICE_DATE);
  const onlyIndex = process.argv.findIndex((arg) => arg === "--only");
  const onlyDocumentId = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;
  const invoices = onlyDocumentId ? INVOICES.filter((inv) => inv.documentId === onlyDocumentId) : INVOICES;

  if (onlyIndex >= 0 && !onlyDocumentId) {
    throw new Error("--only requires a document id");
  }
  if (onlyDocumentId && invoices.length === 0) {
    throw new Error(`No AR invoice sample data found for ${onlyDocumentId}`);
  }

  for (const inv of invoices) {
    if (await skipExistingSampleDocument(config.companyCode, inv.documentId)) continue;
    const request: ArInvoiceRequestDto = {
      document_type: "AR_INVOICE",
      company_code: config.companyCode,
      ar_counterparty_code: null,
      ar_counterparty: {
        code: inv.counterpartyCode,
        name: localizeCounterpartyName(inv.counterpartyName, config),
        status: "ACTIVE",
        country_code: config.countryCode,
        state_or_province_code: config.stateOrProvinceCode,
      },
      ...(inv.documentId ? { document_id: inv.documentId } : {}),
      invoice_date: inv.invoiceDate,
      dimensions: inv.dimensions === undefined ? { SALES_CHANNEL: "Direct" } : inv.dimensions,
      lines: inv.lines.map((line) => ({ ...line, tax_rule: localizeTaxRule(line.tax_rule, config) })),
    };

    const response = await processArInvoice(request);
    const { detailed_document, posting_details, tax_ledger_details } = response;
    const taxDescriptions = [...new Set(tax_ledger_details.map((detail) => detail.description))]
      .filter(Boolean)
      .join(", ");

    console.log(
      `posted ${config.companyCode} ${detailed_document.document_id} - gross ${config.currencyCode} ${detailed_document.gross_amount} ` +
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
