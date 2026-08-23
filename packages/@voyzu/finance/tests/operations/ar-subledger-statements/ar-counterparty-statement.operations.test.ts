import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type { ArReceiptApplicationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import type { ArReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations/organization.response.dto";
import { getPool } from "@voyzu/capability/db";
import { getArCounterpartyStatement } from "../../../modules/ar-subledger-statements/operations";
import { processArInvoice, processArReceipt, processArReceiptApplication } from "../../../modules/financial-document-processing-engine/operations";

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
        await pool.query(`SET session_replication_role = replica`);
        try {
          await pool.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM ar_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
        } finally {
          await pool.query(`SET session_replication_role = DEFAULT`);
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

function suffix(): string {
  return String(Date.now()).slice(-8);
}

async function getCompany(): Promise<OrganizationResponseDto> {
  const pool = getPool();
  const { rows } = await pool.query<{
    id: number;
    code: string;
    name: string;
    countryCode: string;
    baseCurrencyCode: string;
    status: OrganizationResponseDto["status"];
    taxFilingAnchorMonth: number;
    taxFilingIntervalMonths: 1 | 2 | 3 | 6 | 12;
    hasPostings: boolean;
    creationDate: string;
    creationActorType: OrganizationResponseDto["audit"]["created"]["actorType"];
    creationUserId: string | null;
    updatedDate: string;
    updatedActorType: OrganizationResponseDto["audit"]["updated"]["actorType"];
    updatedUserId: string | null;
  }>(
    `SELECT id, code, name, country_code AS "countryCode", base_currency_code AS "baseCurrencyCode",
            tax_filing_anchor_month AS "taxFilingAnchorMonth",
            tax_filing_interval_months AS "taxFilingIntervalMonths",
            status,
            EXISTS (SELECT 1 FROM journal_header WHERE finance_organization_id = company.id) AS "hasPostings",
            creation_date::text AS "creationDate",
            creation_actor_type AS "creationActorType",
            creation_user_id AS "creationUserId",
            updated_date::text AS "updatedDate",
            updated_actor_type AS "updatedActorType",
            updated_user_id AS "updatedUserId"
     FROM organization
     WHERE code = 'ACME'`,
  );
  const row = rows[0];
  assert.ok(row);
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    countryCode: row.countryCode,
    baseCurrencyCode: row.baseCurrencyCode,
    status: row.status,
    taxFilingAnchorMonth: row.taxFilingAnchorMonth,
    taxFilingIntervalMonths: row.taxFilingIntervalMonths,
    hasPostings: row.hasPostings,
    country: undefined,
    baseCurrency: undefined,
    useFinanceTemplateSettings: false,
    reportLine1: null,
    reportLine2: null,
    reportFooter: null,
    audit: {
      created: {
        date: row.creationDate,
        actorType: row.creationActorType,
        userId: row.creationUserId,
        user: null,
        mutationId: null,
      },
      updated: {
        date: row.updatedDate,
        actorType: row.updatedActorType,
        userId: row.updatedUserId,
        user: null,
        mutationId: null,
      },
    },
  };
}

function invoiceRequest(documentId: string, counterpartyCode: string): ArInvoiceRequestDto {
  createdDocumentIds.push(documentId);
  createdCounterpartyCodes.push(counterpartyCode);
  return {
    document_type: "AR_INVOICE",
    company_code: "ACME",
    ar_counterparty: {
      code: counterpartyCode,
      name: "Statement Test Customer",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    invoice_date: "2026-04-19",
    posting_date: "2026-04-19",
    revenue_posting_code: "400000",
    lines: [{ line_id: 1, description: "Statement invoice", quantity: 1, net_unit_price: 100, tax_rule: "NZ_STANDARD" }],
  };
}

function receiptRequest(documentId: string, counterpartyCode: string): ArReceiptRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    memo: "Statement source receipt",
    payment_date: "2026-05-01",
    receipt_amount: 115,
  };
}

function applicationRequest(documentId: string, counterpartyCode: string, receiptDocumentId: string, invoiceDocumentId: string): ArReceiptApplicationRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT_APPLICATION",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    document_memo: "Statement application",
    application_date: "2026-05-08",
    applications: [{ source_receipt: { document_id: receiptDocumentId }, target_invoice: { document_id: invoiceDocumentId }, amount: 50 }],
  };
}

describe("AR counterparty statement", () => {
  it("shows receipt applications under both source receipt and target invoice", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTST${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVST${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYST${id}`, counterpartyCode));
    const application = await processArReceiptApplication(applicationRequest(
      `APPST${id}`,
      counterpartyCode,
      receipt.detailed_document.document_id,
      invoice.detailed_document.document_id,
    ));
    const company = await getCompany();

    const statement = await getArCounterpartyStatement(company, counterpartyCode);

    assert.ok(statement);
    const invoiceGroup = statement.groups.find((group) => group.documentId === invoice.detailed_document.document_id);
    const receiptGroup = statement.groups.find((group) => group.documentId === receipt.detailed_document.document_id);
    assert.ok(invoiceGroup);
    assert.ok(receiptGroup);
    assert.deepEqual(invoiceGroup.applications.map((app) => [app.documentId, app.debit, app.credit]), [
      [application.detailed_document.document_id, 0, 50],
    ]);
    assert.deepEqual(receiptGroup.applications.map((app) => [app.documentId, app.debit, app.credit]), [
      [application.detailed_document.document_id, 50, 0],
    ]);
    assert.equal(invoiceGroup.openBalance, 65);
    assert.equal(receiptGroup.openBalance, -65);
  });
});
