import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ApBillRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill.request.dto";
import { getPool } from "@voyzu/capability/db";
import type { ApBillDataValidationContext } from "@voyzu/finance/financial-document-processing-engine/server";
import {
  validateApBillData as validateData,
  validateApBillRequest as validateRequest,
} from "@voyzu/finance/financial-document-processing-engine/server";
import { processApBill } from "../../../modules/financial-document-processing-engine/commands";

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
          await pool.query(`DELETE FROM ap_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
        } finally {
          await pool.query("ALTER TABLE journal_line ENABLE TRIGGER USER");
          await pool.query("ALTER TABLE journal_header ENABLE TRIGGER USER");
        }
      }
    }
    if (createdCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ap_counterparty WHERE code = ANY($1::text[])`, [[...createdCounterpartyCodes]]);
    }
  } finally {
    await pool.end();
  }
});

function validRequest(overrides: Partial<ApBillRequestDto> = {}): ApBillRequestDto {
  return {
    document_type: "AP_BILL",
    company_code: "ACME",
    ap_counterparty_code: "SUPP_TEST",
    document_id: "BILL-VALIDATION",
    supplier_invoice_number: "SUPP-VALIDATION",
    bill_date: "2026-04-19",
    posting_date: "2026-04-19",
    purchase_posting_code: "699000",
    lines: [
      {
        line_id: 1,
        description: "Validation bill line",
        net_amount: 100,
        tax_rule: "NZ_STANDARD",
        gross_amount: 115,
      },
    ],
    ...overrides,
  };
}

function purchasePostingCode(code: string, isDefault = false) {
  return {
    id: 70,
    code,
    document_code: "AP_BILL" as const,
    document_property_slot: "purchase_posting_code" as const,
    status: "ACTIVE" as const,
    gl_account_id: 80,
    gl_account_code: "699000",
    gl_account_name: "General Expenses",
    gl_account_type: "EXPENSE",
    gl_account_status: "ACTIVE" as const,
    is_default: isDefault,
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

function taxRule(code = "NZ_STANDARD") {
  return {
    id: 90,
    code,
    country_code: "NZ",
    region_code: null,
    name: "NZ Standard GST",
    invoice_label: "GST",
    report_label: "GST",
    calculation_method: "CONFIGURED_COMPONENTS" as const,
    component_mode: "CONFIGURED" as const,
    component_count: 1,
    status: "ACTIVE" as const,
  };
}

function taxComponent(code = "NZ_STANDARD_GST") {
  return {
    id: 95,
    code,
    tax_rule_country_code: "NZ",
    tax_rule_code: "NZ_STANDARD",
    tax_authority_code: "IRD",
    tax_authority_id: 110,
    tax_authority_name: "Inland Revenue",
    scheme_code: "GST",
    invoice_label: "GST",
    report_label: "GST",
    rate: 0.15,
    status: "ACTIVE" as const,
  };
}

function validData(): ApBillDataValidationContext {
  const standardTaxRule = taxRule();
  const standardTaxComponent = taxComponent();
  return {
    company: { id: 1, code: "ACME", name: "Acme", country_code: "NZ", base_currency_code: "NZD", status: "ACTIVE" },
    documentProcessor: { code: "AP_BILL", status: "ACTIVE", supports_dimensions: true, cash_movement: false, supports_items: true },
    counterparty: { id: 10, finance_organization_id: 1, code: "SUPP_TEST", name: "Supplier Test", status: "ACTIVE", country_code: "NZ", tax_region_or_province: null, country_currency_code: "NZD" },
    duplicateSupplierBill: null,
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
    apControlAccount: {
      control_account_code: "AP_TRADE_PAYABLES",
      control_account_name: "Trade Payables",
      control_account_status: "ACTIVE",
      gl_account_id: 50,
      gl_account_code: "200000",
      gl_account_name: "Accounts Payable",
      gl_account_status: "ACTIVE",
    },
    inventoryControlAccount: {
      control_account_code: "INVENTORY_CONTROL",
      control_account_name: "Inventory Control",
      control_account_status: "ACTIVE",
      gl_account_id: 55,
      gl_account_code: "121000",
      gl_account_name: "Inventory Control",
      gl_account_status: "ACTIVE",
    },
    taxMovementControlAccount: {
      tax_movement_type_code: "TAX_ON_PURCHASES",
      tax_movement_type_name: "Tax on Purchases",
      tax_movement_type_status: "ACTIVE",
      gl_account_id: 60,
      gl_account_code: "120000",
      gl_account_name: "Tax on Purchases",
      gl_account_status: "ACTIVE",
    },
    defaultPurchasePostingCode: purchasePostingCode("PURCHASE_ACCOUNT", true),
    purchasePostingCodesByCode: new Map([["699000", purchasePostingCode("699000", true)]]),
    itemPostingProfilesByItemCode: new Map(),
    taxRulesByCode: new Map([[standardTaxRule.code, standardTaxRule]]),
    taxComponentsByRuleCode: new Map([[standardTaxRule.code, [standardTaxComponent]]]),
    taxAuthoritiesByCode: new Map([["IRD", taxAuthority("IRD")]]),
    dimensionValuesByDimensionCodeAndName: new Map(),
  };
}

function expectValidation(fn: () => void, expectedMessage: string): void {
  assert.throws(fn, (err: unknown) => err instanceof Error && err.message.includes(expectedMessage));
}

describe("AP_BILL request validation", () => {
  it("rejects the removed document-level tax summary fields", () => {
    expectValidation(
      () => validateRequest({ ...validRequest(), tax_summary: [{ tax_amount: 15 }] }),
      "$.tax_summary is not allowed",
    );
  });

  it("requires a line tax rule", () => {
    expectValidation(
      () => validateRequest({
        ...validRequest(),
        lines: [{ line_id: 1, description: "Gross line", gross_amount: 115 } as ApBillRequestDto["lines"][number]],
      }),
      "lines[0].tax_rule is required",
    );
  });
});

describe("AP_BILL data validation", () => {
  it("uses the item posting profile instead of requiring a document default", () => {
    const request = validRequest({
      purchase_posting_code: null,
      lines: [{ line_id: 1, description: "Service purchase", net_amount: 100, gross_amount: 115, inventory_item_code: "SERVICE-1", tax_rule: "NZ_STANDARD" }],
    });
    const data = validData();
    data.defaultPurchasePostingCode = null;
    data.itemPostingProfilesByItemCode.set("SERVICE-1", {
      item_code: "SERVICE-1", item_type: "SERVICE", item_status: "ACTIVE",
      profile_code: "SERVICES", profile_status: "ACTIVE", is_purchased: true,
      purchase_gl_account_id: 80, purchase_gl_account_code: "699000", purchase_gl_account_name: "General Expenses",
      purchase_gl_account_type: "EXPENSE", purchase_gl_account_status: "ACTIVE",
    });
    assert.doesNotThrow(() => validateData(request, data));
  });

  it("rejects an item whose posting profile does not permit purchases", () => {
    const request = validRequest({
      lines: [{ line_id: 1, description: "Service purchase", net_amount: 100, gross_amount: 115, inventory_item_code: "SERVICE-1", tax_rule: "NZ_STANDARD" }],
    });
    const data = validData();
    data.itemPostingProfilesByItemCode.set("SERVICE-1", {
      item_code: "SERVICE-1", item_type: "SERVICE", item_status: "ACTIVE",
      profile_code: "SALES_ONLY", profile_status: "ACTIVE", is_purchased: false,
      purchase_gl_account_id: null, purchase_gl_account_code: null, purchase_gl_account_name: null,
      purchase_gl_account_type: null, purchase_gl_account_status: null,
    });
    expectValidation(() => validateData(request, data), "Item posting profile SALES_ONLY does not permit purchases");
  });

  it("accepts a configured tax rule with configured components", () => {
    assert.doesNotThrow(() => validateData(validRequest(), validData()));
  });

  it("rejects a configured tax rule without configured components", () => {
    const data = validData();
    data.taxComponentsByRuleCode = new Map();
    expectValidation(
      () => validateData(validRequest(), data),
      "lines[0].tax_rule NZ_STANDARD has no configured tax components",
    );
  });

  it("rejects duplicate supplier invoice numbers", () => {
    const data = validData();
    data.duplicateSupplierBill = { id: 999 };
    expectValidation(
      () => validateData(validRequest(), data),
      "Supplier invoice number SUPP-VALIDATION has already been posted",
    );
  });
});

describe("AP_BILL posting", () => {
  it("previews a line-level bill and derives tax from the configured tax rule", async () => {
    const response = await processApBill({
      document_type: "AP_BILL",
      company_code: "ACME",
      ap_counterparty: {
        code: "SUPP-PREVIEW",
        name: "AP Preview Supplier",
        status: "ACTIVE",
        country_code: "NZ",
        state_or_province_code: null,
      },
      document_id: "BILL-PREVIEW",
      supplier_invoice_number: "SUPP-PREVIEW-001",
      memo: "Preview bill",
      bill_date: "2026-04-19",
      posting_date: "2026-04-19",
      lines: [
        {
          line_id: 1,
          description: "Office supplies",
          net_amount: "100.00",
          tax_rule: "NZ_STANDARD",
          gross_amount: "115.00",
        },
      ],
    }, { preview: true });

    assert.equal(response.detailed_document.net_amount, 100);
    assert.equal(response.detailed_document.recoverable_tax_amount, 15);
    assert.equal(response.detailed_document.gross_amount, 115);
    assert.equal(response.detailed_document.lines[0].tax_components[0].tax_authority_code, "IRD");
    assert.equal(response.tax_ledger_details[0].tax_movement_type_code, "TAX_ON_PURCHASES");
    assert.equal(response.posting_details.journal_header.status, "EPHEMERAL");
    assert.equal(response.posting_details.journal_header.total_debit_base_amount, 115);
    assert.equal(response.posting_details.journal_header.total_credit_base_amount, 115);
    assert.deepEqual(response.posting_details.journal_lines.map((line) => line.dr_cr), ["DR", "DR", "CR"]);
  });

  it("posts a supplier bill without leaving residual data after cleanup", async () => {
    const suffix = String(Date.now()).slice(-8);
    const documentId = `BILL${suffix}`;
    const counterpartyCode = `SUPP${suffix}`;
    createdDocumentIds.push(documentId);
    createdCounterpartyCodes.push(counterpartyCode);

    const response = await processApBill({
      document_type: "AP_BILL",
      company_code: "ACME",
      ap_counterparty: {
        code: counterpartyCode,
        name: "AP Bill Happy Path",
        status: "ACTIVE",
        country_code: "NZ",
        state_or_province_code: null,
      },
      document_id: documentId,
      supplier_invoice_number: `SUPP-${suffix}`,
      memo: "Happy path",
      bill_date: "2026-04-19",
      posting_date: "2026-04-19",
      purchase_posting_code: "699000",
      lines: [
        {
          line_id: 1,
          description: "Simple bill line",
          net_amount: 200,
          tax_rule: "NZ_STANDARD",
          gross_amount: 230,
        },
      ],
    });

    assert.equal(response.ap_counterparty_details.code, counterpartyCode);
    assert.equal(response.ap_subledger_details.base_currency_amount, 230);
    assert.equal(response.ap_subledger_details.entry_type, "CREDIT");
    assert.equal(response.tax_ledger_details.length, 1);
    assert.equal(response.tax_ledger_details[0].base_currency_amount, 30);
    assert.equal(response.posting_details.journal_header.status, "POSTED");
    assert.equal(response.posting_details.journal_lines.length, 3);
  });
});

