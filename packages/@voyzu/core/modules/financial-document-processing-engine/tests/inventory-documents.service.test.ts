import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { InventoryAdjustmentRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import type { InventoryIssueRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import type { InventoryReceiptRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { getDb, getPool } from "@voyzu/capability/db";
import { InventoryProcessingRepo } from "@voyzu/core/financial-document-processing-engine/server";
import {
  processInventoryAdjustment,
  processInventoryIssue,
  processInventoryReceipt,
} from "@voyzu/core/financial-document-processing-engine/server";

const createdDocumentIds: string[] = [];
const createdItemCodes: string[] = [];

after(async () => {
  const pool = getPool();
  try {
    await new InventoryProcessingRepo(getDb()).deleteArtifactsByDocumentIds([...createdDocumentIds]);
    if (createdItemCodes.length) {
      await pool.query(`DELETE FROM inventory_item WHERE code = ANY($1::text[])`, [[...createdItemCodes]]);
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

async function createItem(code: string, overrides: { isSold?: boolean; isPurchased?: boolean; isConsumed?: boolean; categoryCode?: string } = {}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO inventory_item (
       company_id, code, name, description, item_type, category_id, unit_code,
       status, creation_date, creation_actor_type
     )
     SELECT co.id,
            $1,
            $2,
            $3,
            'INVENTORY',
            (SELECT c.id FROM inventory_category c WHERE c.company_id = co.id AND c.code = $4 ORDER BY c.id LIMIT 1),
            'ea',
            'ACTIVE',
            now(),
            'SYSTEM'
     FROM company co
     WHERE co.code = 'ACME'
     ORDER BY co.id
     LIMIT 1`,
    [
      code,
      `Test ${code}`,
      "Disposable inventory document test item",
      overrides.categoryCode ?? (overrides.isSold === false ? "PACKAGING" : "RESALE_GOODS"),
    ],
  );
  createdItemCodes.push(code);
}

function receiptRequest(documentId: string, itemCode: string, quantity = 10, unitValue = 20): InventoryReceiptRequestDto {
  return {
    document_type: "INVENTORY_RECEIPT",
    company_code: "ACME",
    document_id: documentId,
    memo: "Inventory receipt test",
    receipt_date: "2026-05-01",
    posting_date: "2026-05-01",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: itemCode,
        description: "Receipt test line",
        quantity_delta: quantity,
        valuation_method: "SUPPLIED_UNIT_BOOK_VALUE",
        unit_book_value: unitValue,
      },
    ],
  };
}

function issueRequest(documentId: string, itemCode: string, quantity = -5): InventoryIssueRequestDto {
  return {
    document_type: "INVENTORY_ISSUE",
    company_code: "ACME",
    document_id: documentId,
    memo: "Inventory issue test",
    issue_date: "2026-05-02",
    posting_date: "2026-05-02",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: itemCode,
        description: "Issue test line",
        quantity_delta: quantity,
        issue_purpose: "SOLD",
      },
    ],
  };
}

function quantityAdjustmentRequest(documentId: string, itemCode: string): InventoryAdjustmentRequestDto {
  return {
    document_type: "INVENTORY_ADJUSTMENT",
    company_code: "ACME",
    document_id: documentId,
    memo: "Inventory adjustment test",
    adjustment_date: "2026-05-03",
    posting_date: "2026-05-03",
    source: { source_document: "SELF" },
    lines: [
      {
        line_id: 1,
        inventory_item_code: itemCode,
        description: "Positive stocktake variance",
        adjustment_type: "QUANTITY_ADJUSTMENT",
        quantity_delta: 3,
        unit_book_value: 12,
        reason_code: "STOCKTAKE_VARIANCE",
      },
      {
        line_id: 2,
        inventory_item_code: itemCode,
        description: "Value correction",
        adjustment_type: "VALUE_ADJUSTMENT",
        book_value_delta: -30,
        reason_code: "VALUE_CORRECTION",
      },
    ],
  };
}

describe("Inventory document processing engines", () => {
  it("previews a supplied-value inventory receipt without persistence", async () => {
    const id = suffix();
    const itemCode = `TST-REC-${id}`;
    const documentId = `IVR${id}`;
    await createItem(itemCode);

    const result = await processInventoryReceipt(receiptRequest(documentId, itemCode), { preview: true });

    assert.equal(result.detailed_document.document_type, "INVENTORY_RECEIPT");
    assert.equal(result.detailed_document.lines[0].quantity_delta, 10);
    assert.equal(result.detailed_document.lines[0].unit_book_value_supplied, 20);
    assert.equal(result.detailed_document.lines[0].book_value_delta, 200);
    assert.equal(result.inventory_ledger_details.inventory_ledger_entry_header.status, "EPHEMERAL");
    assert.equal(result.posting_details.journal_header.status, "EPHEMERAL");
    assert.deepEqual(result.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.gl_account_code}`), ["DR:121000", "CR:405000"]);
    assert.equal(await new InventoryProcessingRepo(getDb()).countJournalsByDocumentId(documentId), 0);
  });

  it("posts an inventory issue using current average value and allows negative stock", async () => {
    const id = suffix();
    const itemCode = `TST-ISS-${id}`;
    const receiptId = `IVR${id}`;
    const issueId = `IVI${id}`;
    createdDocumentIds.push(receiptId, issueId);
    await createItem(itemCode);
    await processInventoryReceipt(receiptRequest(receiptId, itemCode, 5, 10));

    const result = await processInventoryIssue(issueRequest(issueId, itemCode, -10));

    assert.equal(result.detailed_document.lines[0].unit_book_value_used, 10);
    assert.equal(result.detailed_document.lines[0].book_value_delta, -100);
    assert.equal(result.detailed_document.lines[0].qty_balance, -5);
    assert.equal(result.detailed_document.lines[0].book_value_balance, -50);
    assert.equal(result.detailed_document.lines[0].avg_unit_value, 10);
    assert.equal(result.inventory_ledger_details.inventory_ledger_entry_header.status, "POSTED");
    assert.deepEqual(result.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.gl_account_code}`), ["DR:500000", "CR:121000"]);
  });

  it("posts quantity and value adjustments with sequential balances", async () => {
    const id = suffix();
    const itemCode = `TST-ADJ-${id}`;
    const receiptId = `IVRA${id}`;
    const adjustmentId = `IVA${id}`;
    createdDocumentIds.push(receiptId, adjustmentId);
    await createItem(itemCode);
    await processInventoryReceipt(receiptRequest(receiptId, itemCode, 10, 10));

    const result = await processInventoryAdjustment(quantityAdjustmentRequest(adjustmentId, itemCode));

    assert.equal(result.detailed_document.lines[0].movement, "INVENTORY_QUANTITY_ADJUSTMENT");
    assert.equal(result.detailed_document.lines[0].book_value_delta, 36);
    assert.equal(result.detailed_document.lines[0].qty_balance, 13);
    assert.equal(result.detailed_document.lines[1].movement, "INVENTORY_VALUE_ADJUSTMENT");
    assert.equal(result.detailed_document.lines[1].quantity_delta, 0);
    assert.equal(result.detailed_document.lines[1].book_value_delta, -30);
    assert.equal(result.detailed_document.lines[1].book_value_balance, 106);
    assert.deepEqual(result.inventory_ledger_details.inventory_ledger_lines.map((line) => line.movement), ["INVENTORY_QUANTITY_ADJUSTMENT", "INVENTORY_VALUE_ADJUSTMENT"]);
  });

  it("rejects current-average receipt valuation when the item has no inventory balance", async () => {
    const id = suffix();
    const itemCode = `TST-CAV-${id}`;
    await createItem(itemCode);

    const input = receiptRequest(`IVC${id}`, itemCode);
    input.lines[0].valuation_method = "CURRENT_AVERAGE_BOOK_VALUE";
    delete input.lines[0].unit_book_value;

    await assert.rejects(
      () => processInventoryReceipt(input, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("requires a current average unit book value"),
    );
  });

  it("rejects sold issues for items not enabled for sale", async () => {
    const id = suffix();
    const itemCode = `TST-NOS-${id}`;
    const receiptId = `IVRN${id}`;
    createdDocumentIds.push(receiptId);
    await createItem(itemCode, { isSold: false });
    await processInventoryReceipt(receiptRequest(receiptId, itemCode, 5, 10));

    await assert.rejects(
      () => processInventoryIssue(issueRequest(`IVIN${id}`, itemCode), { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("does not permit sales"),
    );
  });
});

