import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { InventoryReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { getPool } from "@voyzu/capability/db";
import { processApBill, processArInvoice, processInventoryReceipt } from "../../../modules/financial-document-processing-engine/operations";

const createdDocumentIds: string[] = [];
const createdItemCodes: string[] = [];
const createdArCounterpartyCodes: string[] = [];
const createdApCounterpartyCodes: string[] = [];

after(async () => {
  const pool = getPool();
  try {
    const inventoryJournalRows = createdItemCodes.length
      ? await pool.query<{ journal_header_id: number; document_id: string }>(
        `SELECT DISTINCT h.journal_header_id, h.document_id
         FROM inventory_ledger_entry_header h
         JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
         WHERE l.item_code = ANY($1::text[])`,
        [[...createdItemCodes]],
      )
      : { rows: [] };
    for (const row of inventoryJournalRows.rows) {
      createdDocumentIds.push(row.document_id);
    }
    const journalIds = createdDocumentIds.length
      ? await pool.query<{ id: number }>(`SELECT id FROM journal_header WHERE document_id = ANY($1::text[])`, [[...createdDocumentIds]])
      : { rows: [] };
    const ids = [...new Set([
      ...journalIds.rows.map((row) => row.id),
      ...inventoryJournalRows.rows.map((row) => row.journal_header_id),
    ])];
    if (ids.length) {
      await pool.query(`SET session_replication_role = replica`);
      try {
        await pool.query(`DELETE FROM inventory_ledger_entry_line WHERE inventory_ledger_entry_header_id IN (SELECT id FROM inventory_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[]))`, [ids]);
        await pool.query(`DELETE FROM inventory_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await pool.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await pool.query(`DELETE FROM ar_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await pool.query(`DELETE FROM ap_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await pool.query(`DELETE FROM journal_line_dimension WHERE journal_line_id IN (SELECT id FROM journal_line WHERE journal_header_id = ANY($1::bigint[]))`, [ids]);
        await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
      } finally {
        await pool.query(`SET session_replication_role = DEFAULT`);
      }
    }
    if (createdDocumentIds.length) {
    }
    if (createdItemCodes.length) {
      await pool.query(`DELETE FROM item WHERE sku = ANY($1::text[])`, [[...createdItemCodes]]);
    }
    if (createdArCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ar_counterparty WHERE code = ANY($1::text[])`, [[...createdArCounterpartyCodes]]);
    }
    if (createdApCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ap_counterparty WHERE code = ANY($1::text[])`, [[...createdApCounterpartyCodes]]);
    }
  } finally {
    await pool.end();
  }
});

let suffixCounter = 0;

function suffix(): string {
  suffixCounter += 1;
  return `${Date.now().toString(36).slice(-5)}${suffixCounter.toString(36)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase();
}

async function createItem(code: string): Promise<void> {
  await getPool().query(
    `INSERT INTO item (
       organization_id, sku, name, description, item_type, unit, quantity_tracked,
       item_posting_code_id, status, creation_date, creation_actor_type
     )
     SELECT organization.id,
            $1,
            $2,
            $3,
            'SINGLE_ITEM',
            'ea',
            true,
            profile.id,
            'ACTIVE',
            now(),
            'SYSTEM'
     FROM organization
     JOIN finance_organization finance ON finance.organization_id = organization.id
     JOIN item_posting_profile profile ON profile.finance_organization_id = finance.id AND profile.code = 'RESALE_GOODS'
     WHERE organization.code = 'ACME'
     ORDER BY organization.id
     LIMIT 1`,
    [code, `Downstream ${code}`, "Downstream inventory integration test item"],
  );
  createdItemCodes.push(code);
}

async function seedBalance(documentId: string, itemCode: string): Promise<void> {
  const request: InventoryReceiptRequestDto = {
    document_type: "INVENTORY_RECEIPT",
    company_code: "ACME",
    document_id: documentId,
    receipt_date: "2026-05-01",
    posting_date: "2026-05-01",
    source: { source_document: "SELF" },
    lines: [{
      line_id: 1,
      inventory_item_code: itemCode,
      description: "Opening test stock",
      quantity_delta: 20,
      valuation_method: "SUPPLIED_UNIT_BOOK_VALUE",
      unit_book_value: 25,
    }],
  };
  createdDocumentIds.push(documentId);
  await processInventoryReceipt(request);
}

describe("Downstream inventory documents", () => {
  it("creates an inventory issue from an AR invoice inventory line", async () => {
    const id = suffix();
    const itemCode = `TST-DAR-${id}`;
    const openingDocumentId = `INV-OPEN-${id}`;
    const invoiceDocumentId = `INV-DAR-${id}`;
    const counterpartyCode = `CUST-DAR-${id}`;
    createdDocumentIds.push(invoiceDocumentId);
    createdArCounterpartyCodes.push(counterpartyCode);
    await createItem(itemCode);
    await seedBalance(openingDocumentId, itemCode);

    await processArInvoice({
      document_type: "AR_INVOICE",
      company_code: "ACME",
      ar_counterparty: { code: counterpartyCode, name: "Downstream AR Customer", status: "ACTIVE", country_code: "NZ" },
      document_id: invoiceDocumentId,
      invoice_date: "2026-05-02",
      posting_date: "2026-05-02",
      lines: [{
        line_id: 1,
        description: "Inventory sale",
        quantity: 4,
        net_unit_price: 40,
        inventory_item_code: itemCode,
        tax_rule: "NZ_ZERO_RATED",
      }],
    });

    const ledger = await getPool().query<{ document_id: string; source_document_type_code: string; movement_type_code: string; qty_delta: string; book_value_delta: string }>(
      `SELECT h.document_id, h.source_document_type_code, l.movement_type_code, l.qty_delta::text, l.book_value_delta::text
       FROM inventory_ledger_entry_header h
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
       WHERE h.source_document_type_code = 'AR_INVOICE'
         AND l.item_code = $1`,
      [itemCode],
    );
    assert.equal(ledger.rows.length, 1);
    createdDocumentIds.push(ledger.rows[0].document_id);
    assert.equal(ledger.rows[0].source_document_type_code, "AR_INVOICE");
    assert.equal(ledger.rows[0].movement_type_code, "INVENTORY_ISSUE");
    assert.equal(Number(ledger.rows[0].qty_delta), -4);
    assert.equal(Number(ledger.rows[0].book_value_delta), -100);
  });

  it("creates a ledger-only inventory receipt from an AP bill inventory line", async () => {
    const id = suffix();
    const itemCode = `TST-DAP-${id}`;
    const billDocumentId = `BILL-DAP-${id}`;
    const counterpartyCode = `SUPP-DAP-${id}`;
    createdDocumentIds.push(billDocumentId);
    createdApCounterpartyCodes.push(counterpartyCode);
    await createItem(itemCode);

    await processApBill({
      document_type: "AP_BILL",
      company_code: "ACME",
      ap_counterparty: { code: counterpartyCode, name: "Downstream AP Supplier", status: "ACTIVE", country_code: "NZ" },
      document_id: billDocumentId,
      supplier_invoice_number: `SUPP-DAP-${id}`,
      bill_date: "2026-05-03",
      posting_date: "2026-05-03",
      lines: [{
        line_id: 1,
        description: "Inventory purchase",
        quantity: 10,
        net_amount: 600,
        tax_rule: "NZ_STANDARD",
        gross_amount: 690,
        inventory_item_code: itemCode,
      }],
    });

    const journals = await getPool().query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM journal_header WHERE document_id = $1`, [billDocumentId]);
    assert.equal(Number(journals.rows[0].count), 1);

    const journalLines = await getPool().query<{ gl_account_code: string; dr_cr: string; base_currency_amount: string }>(
      `SELECT gl_account_code, dr_cr, base_currency_amount::text
       FROM journal_line
       WHERE journal_header_id = (SELECT id FROM journal_header WHERE document_id = $1 AND document_type_code = 'AP_BILL')
       ORDER BY line_number`,
      [billDocumentId],
    );
    assert.equal(journalLines.rows[0].gl_account_code, "121000");
    assert.equal(journalLines.rows[0].dr_cr, "DR");
    assert.equal(Number(journalLines.rows[0].base_currency_amount), 600);

    const ledger = await getPool().query<{ document_id: string; source_document_type_code: string; movement_type_code: string; qty_delta: string; unit_value_supplied: string; book_value_delta: string }>(
      `SELECT h.document_id, h.source_document_type_code, l.movement_type_code, l.qty_delta::text, l.unit_value_supplied::text, l.book_value_delta::text
       FROM inventory_ledger_entry_header h
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
       WHERE h.source_document_type_code = 'AP_BILL'
         AND h.journal_header_id = (SELECT id FROM journal_header WHERE document_id = $1 AND document_type_code = 'AP_BILL')`,
      [billDocumentId],
    );
    assert.equal(ledger.rows.length, 1);
    createdDocumentIds.push(ledger.rows[0].document_id);
    assert.equal(ledger.rows[0].source_document_type_code, "AP_BILL");
    assert.equal(ledger.rows[0].movement_type_code, "INVENTORY_RECEIPT");
    assert.equal(Number(ledger.rows[0].qty_delta), 10);
    assert.equal(Number(ledger.rows[0].unit_value_supplied), 60);
    assert.equal(Number(ledger.rows[0].book_value_delta), 600);
  });
});
