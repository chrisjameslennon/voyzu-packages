import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import { getPool } from "@voyzu/capability/db";
import type { ArInvoiceDataValidationContext } from "@voyzu/core/financial-document-processing-engine/server";
import {
  validateArInvoiceData as validateData,
  validateArInvoiceRequest as validateRequest,
} from "@voyzu/core/financial-document-processing-engine/server";
import { processArInvoice } from "../../../modules/financial-document-processing-engine/operations";

const createdDocumentIds: string[] = [];
const createdCounterpartyCodes: string[] = [];

after(async () => {
  const pool = getPool();
  try {
    if (createdDocumentIds.length) {
      const journalIds = await pool.query<{ id: number }>(
        `SELECT id FROM journal_header WHERE document_id = ANY($1::text[])`,
        [[...createdDocumentIds]],
      );
      const ids = journalIds.rows.map((row) => row.id);
      if (ids.length) {
        await pool.query("ALTER TABLE journal_header DISABLE TRIGGER USER");
        await pool.query("ALTER TABLE journal_line DISABLE TRIGGER USER");
        try {
          await pool.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM ar_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
        } finally {
          await pool.query("ALTER TABLE journal_line ENABLE TRIGGER USER");
          await pool.query("ALTER TABLE journal_header ENABLE TRIGGER USER");
        }
      }
    }
    if (createdCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ar_counterparty WHERE code = ANY($1::text[])`, [[...createdCounterpartyCodes]]);
    }
  } finally {
    await pool.end();
  }
});

function validRequest(overrides: Partial<ArInvoiceRequestDto> = {}): ArInvoiceRequestDto {
  return {
    document_type: "AR_INVOICE",
    company_code: "ACME",
    ar_counterparty_code: "CUST_TEST",
    document_id: "INV-VALIDATION",
    invoice_date: "2026-04-19",
    posting_date: "2026-04-19",
    revenue_posting_code: "400000",
    lines: [
      {
        line_id: 1,
        description: "Validation test line",
        quantity: 1,
        net_unit_price: 100,
        tax_rule: "STANDARD",
      },
    ],
    ...overrides,
  };
}

function validData(): ArInvoiceDataValidationContext {
  return {
    company: {
      id: 1,
      code: "ACME",
      name: "Acme",
      country_code: "NZ",
      base_currency_code: "NZD",
      status: "ACTIVE",
    },
    documentProcessor: {
      code: "AR_INVOICE",
      status: "ACTIVE",
      supports_dimensions: true,
      cash_movement: false,
      supports_items: true,
    },
    counterparty: {
      id: 10,
      company_id: 1,
      code: "CUST_TEST",
      name: "Customer Test",
      status: "ACTIVE",
      country_code: "NZ",
      tax_region_or_province: null,
      country_currency_code: "NZD",
    },
    fiscalPeriod: {
      financial_year_id: 20,
      financial_year_code: "FY-2027",
      financial_year_status: "OPEN",
      financial_period_id: 30,
      financial_period_code: "FY-2027-01",
      financial_period_status: "OPEN",
      period_start_date: "2026-04-01",
      period_end_date: "2026-04-30",
    },
    arControlAccount: {
      control_account_code: "AR_TRADE_RECEIVABLES",
      control_account_name: "Trade Receivables",
      control_account_status: "ACTIVE",
      gl_account_id: 50,
      gl_account_code: "110000",
      gl_account_name: "Accounts Receivable",
      gl_account_status: "ACTIVE",
    },
    taxMovementControlAccount: {
      tax_movement_type_code: "TAX_ON_SALES",
      tax_movement_type_name: "Tax on Sales",
      tax_movement_type_status: "ACTIVE",
      gl_account_id: 60,
      gl_account_code: "220000",
      gl_account_name: "Tax on Sales",
      gl_account_status: "ACTIVE",
    },
    defaultRevenuePostingCode: revenuePostingCode("REVENUE_ACCOUNT"),
    revenuePostingCodesByCode: new Map([["400000", revenuePostingCode("400000")]]),
    itemPostingProfilesByItemCode: new Map(),
    taxRulesByCode: new Map([["STANDARD", taxRule("STANDARD")], ["CALLER_SUPPLIED", taxRule("CALLER_SUPPLIED", "CALLER_SUPPLIED", 0)]]),
    taxComponentsByRuleCode: new Map([["STANDARD", [taxComponent("GST")]]]),
    taxAuthoritiesByCode: new Map([["IRD", taxAuthority("IRD")]]),
    dimensionValuesByDimensionCodeAndName: new Map([["DEPARTMENT\u0000SALES", dimensionValue("DEPARTMENT", "SALES")]]),
  };
}

function revenuePostingCode(code: string) {
  return {
    code,
    document_code: "AR_INVOICE" as const,
    status: "ACTIVE" as const,
    gl_account_id: 80,
    gl_account_code: "400000",
    gl_account_name: "Sales",
    gl_account_type: "REVENUE",
    gl_account_status: "ACTIVE" as const,
  };
}

function taxRule(code: string, calculationMethod: "NO_TAX" | "CONFIGURED_COMPONENTS" | "CALLER_SUPPLIED" = "CONFIGURED_COMPONENTS", componentCount = 1) {
  return {
    id: 90,
    code,
    country_code: "NZ",
    region_code: null,
    name: code,
    invoice_label: code,
    report_label: code,
    calculation_method: calculationMethod,
    component_mode: calculationMethod === "CONFIGURED_COMPONENTS" ? "CONFIGURED" as const : calculationMethod === "CALLER_SUPPLIED" ? "CALLER_SUPPLIED" as const : "NONE" as const,
    component_count: componentCount,
    status: "ACTIVE" as const,
  };
}

function taxComponent(code: string) {
  return {
    id: 100,
    code,
    tax_rule_country_code: "NZ",
    tax_rule_code: "STANDARD",
    tax_authority_code: "IRD",
    tax_authority_id: 110,
    tax_authority_name: "Inland Revenue",
    scheme_code: "GST",
    invoice_label: "GST",
    report_label: "GST",
    rate: 0.15,
    base_amount_type: "LINE_NET_AMOUNT" as const,
    calculation_order: 1,
    status: "ACTIVE" as const,
  };
}

function taxAuthority(code: string) {
  return {
    id: 110,
    code,
    name: "Inland Revenue",
    country_code: "NZ",
    region_code: null,
    jurisdiction_level: "NATIONAL",
    status: "ACTIVE" as const,
  };
}

function dimensionValue(dimensionCode: string, valueName: string) {
  return {
    dimension_id: 120,
    dimension_code: dimensionCode,
    dimension_name: dimensionCode,
    dimension_status: "ACTIVE" as const,
    dimension_value_id: 130,
    dimension_value_name: valueName,
    dimension_value_status: "ACTIVE" as const,
  };
}

function expectValidation(fn: () => void, expectedMessage: string): void {
  assert.throws(
    fn,
    (err: unknown) => err instanceof Error && err.message.includes(expectedMessage),
  );
}

function expectDataValidation(
  expectedMessage: string,
  mutate: (data: ArInvoiceDataValidationContext) => void,
  input: ArInvoiceRequestDto = validRequest(),
): void {
  const data = validData();
  mutate(data);
  expectValidation(() => validateData(input, data), expectedMessage);
}

describe("AR_INVOICE request validation", () => {
  it("rejects unexpected fields", () => {
    expectValidation(
      () => validateRequest({ ...validRequest(), unexpected: true }),
      "$.unexpected is not allowed",
    );
  });

  it("requires tax_components when tax_rule is CALLER_SUPPLIED", () => {
    expectValidation(
      () => validateRequest({
        ...validRequest(),
        lines: [{ ...validRequest().lines[0], tax_rule: "CALLER_SUPPLIED" }],
      }),
      "lines[0].tax_components must contain at least one component when tax_rule is CALLER_SUPPLIED",
    );
  });

  it("rejects invalid date and amount combinations", () => {
    expectValidation(
      () => validateRequest({
        ...validRequest(),
        invoice_date: "2026-02-31",
        lines: [{ ...validRequest().lines[0], net_line_total: 101 }],
      }),
      "invoice_date must be a valid calendar date",
    );
  });
});

describe("AR_INVOICE posting", () => {
  it("posts a simple invoice", async () => {
    const suffix = String(Date.now()).slice(-8);
    const documentId = `INV${suffix}`;
    const counterpartyCode = `CUST${suffix}`;
    createdDocumentIds.push(documentId);
    createdCounterpartyCodes.push(counterpartyCode);

    const response = await processArInvoice({
      document_type: "AR_INVOICE",
      company_code: "ACME",
      ar_counterparty: {
        code: counterpartyCode,
        name: "AR Invoice Happy Path",
        status: "ACTIVE",
        country_code: "NZ",
        state_or_province_code: null,
      },
      document_id: documentId,
      document_memo: "Happy path",
      invoice_date: "2026-04-19",
      posting_date: "2026-04-19",
      revenue_posting_code: "400000",
      lines: [
        {
          line_id: 1,
          description: "Simple invoice line",
          quantity: 2,
          net_unit_price: 100,
          tax_rule: "NZ_STANDARD",
        },
      ],
    });

    assert.equal(response.detailed_document.net_amount, 200);
    assert.equal(response.detailed_document.lines[0].line_description, "Simple invoice line");
    assert.equal(response.detailed_document.tax_amount, 30);
    assert.equal(response.detailed_document.gross_amount, 230);
    assert.equal(response.ar_counterparty_details.code, counterpartyCode);
    assert.equal(response.ar_counterparty_details.id != null, true);
    assert.equal(response.ar_subledger_details.base_currency_amount, 230);
    assert.equal(response.ar_subledger_details.status, "POSTED");
    assert.equal(response.tax_ledger_details.length, 1);
    assert.equal(response.tax_ledger_details[0].base_currency_amount, 30);
    assert.equal(response.posting_details.journal_header.status, "POSTED");
    assert.equal(response.posting_details.journal_header.total_debit_base_amount, 230);
    assert.equal(response.posting_details.journal_header.total_credit_base_amount, 230);
    assert.equal(response.posting_details.journal_lines.length, 3);
  });

  it("generates document id from the AR invoice code when omitted", async () => {
    const suffix = String(Date.now()).slice(-8);
    const counterpartyCode = `CUSTGEN${suffix}`;
    createdCounterpartyCodes.push(counterpartyCode);

    const response = await processArInvoice({
      document_type: "AR_INVOICE",
      company_code: "ACME",
      ar_counterparty: {
        code: counterpartyCode,
        name: "AR Invoice Generated Document Id",
        status: "ACTIVE",
        country_code: "NZ",
        state_or_province_code: null,
      },
      invoice_date: "2026-04-19",
      posting_date: "2026-04-19",
      revenue_posting_code: "400000",
      lines: [
        {
          line_id: 1,
          description: "Generated document id line",
          quantity: 1,
          net_unit_price: 100,
          tax_rule: "NZ_STANDARD",
        },
      ],
    });

    createdDocumentIds.push(response.detailed_document.document_id);

    assert.match(response.ar_subledger_details.code ?? "", /^AR-INV-\d+$/);
    assert.equal(response.detailed_document.document_id, response.ar_subledger_details.code!.replace(/^AR-/, ""));
    assert.equal(response.posting_details.journal_header.document_id, response.detailed_document.document_id);
    assert.equal(response.detailed_document.generated_description, `Customer Invoice ${response.detailed_document.document_id}`);
  });
});

describe("AR_INVOICE data validation", () => {
  it("uses the item posting profile instead of requiring a document default", () => {
    const request = validRequest({
      revenue_posting_code: null,
      lines: [{ line_id: 1, description: "Item sale", quantity: 1, net_unit_price: 100, inventory_item_code: "ITEM-1", tax_rule: "STANDARD" }],
    });
    const data = validData();
    data.defaultRevenuePostingCode = null;
    data.itemPostingProfilesByItemCode.set("ITEM-1", {
      item_code: "ITEM-1", item_type: "INVENTORY", item_status: "ACTIVE",
      profile_code: "RESALE_GOODS", profile_status: "ACTIVE", is_sold: true,
      revenue_gl_account_id: 80, revenue_gl_account_code: "400000", revenue_gl_account_name: "Sales",
      revenue_gl_account_type: "REVENUE", revenue_gl_account_status: "ACTIVE",
    });
    assert.doesNotThrow(() => validateData(request, data));
  });

  it("rejects an item whose posting profile does not permit sales", () => {
    const request = validRequest({
      lines: [{ line_id: 1, description: "Item sale", quantity: 1, net_unit_price: 100, inventory_item_code: "ITEM-1", tax_rule: "STANDARD" }],
    });
    const data = validData();
    data.itemPostingProfilesByItemCode.set("ITEM-1", {
      item_code: "ITEM-1", item_type: "INVENTORY", item_status: "ACTIVE",
      profile_code: "PURCHASE_ONLY", profile_status: "ACTIVE", is_sold: false,
      revenue_gl_account_id: null, revenue_gl_account_code: null, revenue_gl_account_name: null,
      revenue_gl_account_type: null, revenue_gl_account_status: null,
    });
    expectValidation(() => validateData(request, data), "Item posting profile PURCHASE_ONLY does not permit sales");
  });

  it("accepts a fully resolved validation context", () => {
    assert.doesNotThrow(() => validateData(validRequest(), validData()));
  });

  const cases: Array<[string, string, (data: ArInvoiceDataValidationContext) => void, ArInvoiceRequestDto?]> = [
    ["missing company", "Company ACME was not found", (data) => { data.company = null; }],
    ["company code mismatch", "Resolved company OTHER does not match requested company ACME", (data) => { data.company!.code = "OTHER"; }],
    ["inactive company", "Company ACME is not ACTIVE", (data) => { data.company!.status = "INACTIVE"; }],
    ["missing document processor", "AR_INVOICE document processor is not configured", (data) => { data.documentProcessor = null; }],
    ["inactive document processor", "AR_INVOICE document processor is not ACTIVE", (data) => { data.documentProcessor!.status = "INACTIVE"; }],
    ["dimensions unsupported", "AR_INVOICE does not support dimensions", (data) => { data.documentProcessor!.supports_dimensions = false; }, validRequest({ dimensions: { DEPARTMENT: "SALES" } })],
    ["missing counterparty", "AR counterparty CUST_TEST was not found or created", (data) => { data.counterparty = null; }],
    ["counterparty company mismatch", "AR counterparty CUST_TEST does not belong to company ACME", (data) => { data.counterparty!.company_id = 999; }],
    ["counterparty code mismatch", "Resolved AR counterparty OTHER does not match requested counterparty CUST_TEST", (data) => { data.counterparty!.code = "OTHER"; }],
    ["inline counterparty mismatch", "Resolved AR counterparty CUST_TEST does not match inline counterparty INLINE_CUST", () => {}, validRequest({ ar_counterparty_code: null, ar_counterparty: { code: "INLINE_CUST", name: "Inline", status: "ACTIVE", country_code: "NZ" } })],
    ["inactive counterparty", "AR counterparty CUST_TEST is not ACTIVE", (data) => { data.counterparty!.status = "INACTIVE"; }],
    ["missing fiscal period", "No OPEN fiscal period contains posting date 2026-04-19", (data) => { data.fiscalPeriod = null; }],
    ["closed financial year", "Financial year FY-2027 is not OPEN", (data) => { data.fiscalPeriod!.financial_year_status = "CLOSED"; }],
    ["closed financial period", "Financial period FY-2027-01 is not OPEN", (data) => { data.fiscalPeriod!.financial_period_status = "CLOSED"; }],
    ["posting date outside fiscal period", "Posting date 2026-04-19 is outside fiscal period FY-2027-01", (data) => { data.fiscalPeriod!.period_start_date = "2026-05-01"; }],
    ["missing requested revenue posting code", "Revenue posting code 400000 was not found for AR_INVOICE.revenue_posting_code", (data) => { data.revenuePostingCodesByCode.clear(); }],
    ["revenue posting code mismatch", "Resolved revenue posting code OTHER does not match requested code 400000", (data) => { data.revenuePostingCodesByCode.set("400000", revenuePostingCode("OTHER")); }],
    ["inactive revenue posting code", "Revenue posting code 400000 is not ACTIVE", (data) => { data.revenuePostingCodesByCode.get("400000")!.status = "INACTIVE"; }],
    ["non-revenue posting code account", "Revenue posting code 400000 does not resolve to a REVENUE GL account", (data) => { data.revenuePostingCodesByCode.get("400000")!.gl_account_type = "ASSET"; }],
    ["inactive posting code GL account", "Revenue posting code 400000 resolves to an inactive GL account", (data) => { data.revenuePostingCodesByCode.get("400000")!.gl_account_status = "INACTIVE"; }],
    ["missing default revenue posting code", "No active default revenue posting code REVENUE_ACCOUNT is configured for AR_INVOICE.revenue_posting_code", (data) => { data.defaultRevenuePostingCode = null; }, validRequest({ revenue_posting_code: null })],
    ["missing AR control account", "AR_TRADE_RECEIVABLES control account is not configured", (data) => { data.arControlAccount = null; }],
    ["inactive AR control account", "AR_TRADE_RECEIVABLES control account is not ACTIVE", (data) => { data.arControlAccount!.control_account_status = "INACTIVE"; }],
    ["inactive AR control GL account", "AR_TRADE_RECEIVABLES control account resolves to an inactive GL account", (data) => { data.arControlAccount!.gl_account_status = "INACTIVE"; }],
    ["missing tax control account", "TAX_ON_SALES tax control account is not configured", (data) => { data.taxMovementControlAccount = null; }],
    ["inactive Tax control account", "TAX_ON_SALES Tax control account is not ACTIVE", (data) => { data.taxMovementControlAccount!.tax_movement_type_status = "INACTIVE"; }],
    ["inactive tax control GL account", "TAX_ON_SALES Tax control account resolves to an inactive GL account", (data) => { data.taxMovementControlAccount!.gl_account_status = "INACTIVE"; }],
    ["missing dimension value", "lines[0].dimensions.DEPARTMENT value SALES was not found", (data) => { data.dimensionValuesByDimensionCodeAndName.clear(); }, validRequest({ dimensions: { DEPARTMENT: "SALES" } })],
    ["inactive dimension", "Dimension DEPARTMENT is not ACTIVE", (data) => { data.dimensionValuesByDimensionCodeAndName.get("DEPARTMENT\u0000SALES")!.dimension_status = "INACTIVE"; }, validRequest({ dimensions: { DEPARTMENT: "SALES" } })],
    ["inactive dimension value", "Dimension DEPARTMENT value SALES is not ACTIVE", (data) => { data.dimensionValuesByDimensionCodeAndName.get("DEPARTMENT\u0000SALES")!.dimension_value_status = "INACTIVE"; }, validRequest({ dimensions: { DEPARTMENT: "SALES" } })],
    ["missing tax rule", "lines[0].tax_rule STANDARD was not found", (data) => { data.taxRulesByCode.clear(); }],
    ["inactive tax rule", "lines[0].tax_rule STANDARD is not ACTIVE", (data) => { data.taxRulesByCode.get("STANDARD")!.status = "INACTIVE"; }],
    ["tax rule country mismatch", "lines[0].tax_rule STANDARD is not valid for company country NZ", (data) => { data.taxRulesByCode.get("STANDARD")!.country_code = "AU"; }],
    ["CALLER_SUPPLIED tax rule wrong method", "lines[0].tax_rule CALLER_SUPPLIED is not configured as CALLER_SUPPLIED", (data) => { data.taxRulesByCode.set("CALLER_SUPPLIED", taxRule("CALLER_SUPPLIED")); }, validRequest({ lines: [{ ...validRequest().lines[0], tax_rule: "CALLER_SUPPLIED", tax_components: [{ tax_authority_code: "IRD", tax_rate: 0.15 }] }] })],
    ["caller supplied authority missing", "lines[0].tax_components[0].tax_authority_code IRD was not found", (data) => { data.taxAuthoritiesByCode.clear(); }, validRequest({ lines: [{ ...validRequest().lines[0], tax_rule: "CALLER_SUPPLIED", tax_components: [{ tax_authority_code: "IRD", tax_rate: 0.15 }] }] })],
    ["caller supplied authority inactive", "Tax authority IRD is not ACTIVE", (data) => { data.taxAuthoritiesByCode.get("IRD")!.status = "INACTIVE"; }, validRequest({ lines: [{ ...validRequest().lines[0], tax_rule: "CALLER_SUPPLIED", tax_components: [{ tax_authority_code: "IRD", tax_rate: 0.15 }] }] })],
    ["caller supplied authority country mismatch", "Tax authority IRD is not valid for company country NZ", (data) => { data.taxAuthoritiesByCode.get("IRD")!.country_code = "AU"; }, validRequest({ lines: [{ ...validRequest().lines[0], tax_rule: "CALLER_SUPPLIED", tax_components: [{ tax_authority_code: "IRD", tax_rate: 0.15 }] }] })],
    ["configured line uses caller supplied rule", "lines[0].tax_rule STANDARD requires caller supplied tax components", (data) => { data.taxRulesByCode.set("STANDARD", taxRule("STANDARD", "CALLER_SUPPLIED", 0)); }],
    ["NO_TAX has configured components", "lines[0].tax_rule STANDARD is NO_TAX but has configured tax components", (data) => { data.taxRulesByCode.set("STANDARD", taxRule("STANDARD", "NO_TAX", 0)); }],
    ["configured tax rule has no components", "lines[0].tax_rule STANDARD has no configured tax components", (data) => { data.taxComponentsByRuleCode.clear(); }],
    ["configured tax rule component count mismatch", "lines[0].tax_rule STANDARD expected 2 tax components but resolved 1", (data) => { data.taxRulesByCode.set("STANDARD", taxRule("STANDARD", "CONFIGURED_COMPONENTS", 2)); }],
    ["inactive tax component", "Tax component GST is not ACTIVE", (data) => { data.taxComponentsByRuleCode.get("STANDARD")![0].status = "INACTIVE"; }],
    ["tax component rule ownership mismatch", "Tax component GST does not belong to tax rule STANDARD", (data) => { data.taxComponentsByRuleCode.get("STANDARD")![0].tax_rule_code = "OTHER"; }],
  ];

  for (const [name, expectedMessage, mutate, input] of cases) {
    it(`rejects ${name}`, () => {
      expectDataValidation(expectedMessage, mutate, input);
    });
  }
});

