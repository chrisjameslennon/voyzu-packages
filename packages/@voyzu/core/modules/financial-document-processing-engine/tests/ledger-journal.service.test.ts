import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { LedgerJournalRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import type { LedgerJournalReversalRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import { getDb, getPool } from "@voyzu/capability/db";
import { LedgerJournalPostingRepo } from "@voyzu/core/financial-document-processing-engine/server";
import { processLedgerJournalReversal } from "@voyzu/core/financial-document-processing-engine/server";
import { processLedgerJournal } from "@voyzu/core/financial-document-processing-engine/server";

const createdDocumentIds: string[] = [];

after(async () => {
  try {
    await new LedgerJournalPostingRepo(getDb()).deleteJournalArtifactsByDocumentIds([...createdDocumentIds]);
  } finally {
    await getPool().end();
  }
});

function suffix(): string {
  return String(Date.now()).slice(-8);
}

function request(documentId: string): LedgerJournalRequestDto {
  return {
    document_type: "LEDGER_JOURNAL",
    company_code: "ACME",
    document_id: documentId,
    document_memo: "Ledger journal test",
    posting_date: "2026-05-01",
    lines: [
      {
        line_id: 1,
        gl_account_code: "240000",
        description: "Accrued expenses",
        dr_cr: "DR",
        base_currency_amount: "125.50",
        dimensions: {
          SALES_CHANNEL: "Direct",
        },
      },
      {
        line_id: 2,
        gl_account_code: "100100",
        description: "Payroll bank",
        dr_cr: "CR",
        base_currency_amount: "125.50",
      },
    ],
  };
}

function reversalRequest(documentId: string | undefined, sourceJournalCode: string): LedgerJournalReversalRequestDto {
  return {
    document_type: "LEDGER_JOURNAL_REVERSAL",
    company_code: "ACME",
    document_id: documentId,
    document_memo: "Ledger journal reversal test",
    source_journal_code: sourceJournalCode,
  };
}

async function countJournals(documentId: string): Promise<number> {
  return new LedgerJournalPostingRepo(getDb()).countJournalsByDocumentId(documentId);
}

describe("LEDGER_JOURNAL document processing engine", () => {
  it("posts a balanced ledger journal with dimensions", async () => {
    const documentId = `GLJ${suffix()}`;
    createdDocumentIds.push(documentId);

    const result = await processLedgerJournal(request(documentId));

    assert.equal(result.detailed_document.document_id, documentId);
    assert.equal(result.detailed_document.generated_description, `Ledger Journal ${documentId}`);
    assert.equal(result.detailed_document.total_debit_base_amount, 125.5);
    assert.equal(result.detailed_document.total_credit_base_amount, 125.5);
    assert.equal(result.posting_details.journal_header.status, "POSTED");
    assert.equal(result.posting_details.journal_header.document_type_code, "LEDGER_JOURNAL");
    assert.equal(result.posting_details.journal_lines.length, 2);
    assert.equal(result.posting_details.journal_lines[0].source_ledger, null);
    assert.equal(result.posting_details.journal_lines[0].source_control_account, null);
    assert.equal(result.posting_details.journal_lines[1].source_ledger, "BANK_CASH");
    assert.equal(result.posting_details.journal_lines[1].source_control_account, "BANK_PAYROLL");
    assert.equal(result.posting_details.journal_lines[0].dimensions?.[0].dimension_code, "SALES_CHANNEL");
  });

  it("accepts bank cash details when a ledger journal posts to a BANK_CASH linked GL account", async () => {
    const documentId = `GLJBC${suffix()}`;
    createdDocumentIds.push(documentId);
    const input = request(documentId);
    input.bank_cash_details = {
      code: "BANK_PAYROLL",
      tx_id: `TEST-GLJ-${documentId}`,
      tx_ref: documentId,
      payment_ref: documentId,
    };

    const result = await processLedgerJournal(input);

    assert.equal(result.detailed_document.bank_cash_details?.code, "BANK_PAYROLL");
    assert.equal(result.detailed_document.bank_cash_details?.tx_id, `TEST-GLJ-${documentId}`);
    const header = await getPool().query<{ bank_cash_code: string | null; bank_cash_tx_id: string | null }>(
      `SELECT bank_cash_code, bank_cash_tx_id FROM journal_header WHERE id = $1`,
      [result.posting_details.journal_header.id],
    );
    assert.equal(header.rows[0].bank_cash_code, "BANK_PAYROLL");
    assert.equal(header.rows[0].bank_cash_tx_id, `TEST-GLJ-${documentId}`);
  });

  it("rejects bank cash details when no ledger journal line posts to BANK_CASH", async () => {
    const input = request(`GLJBCNO${suffix()}`);
    input.lines[1].gl_account_code = "121000";
    input.bank_cash_details = { code: "BANK_PAYROLL" };

    await assert.rejects(
      () => processLedgerJournal(input, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("requires at least one line posted to a BANK_CASH linked GL account"),
    );
  });

  it("rejects bank cash details that do not match the ledger journal bank GL account", async () => {
    const input = request(`GLJBCMIS${suffix()}`);
    input.bank_cash_details = { code: "BANK_OPERATING" };

    await assert.rejects(
      () => processLedgerJournal(input, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("does not match a BANK_CASH linked GL account"),
    );
  });

  it("generates a document id when omitted", async () => {
    const input = request(`GLJIGNORED${suffix()}`);
    delete input.document_id;

    const result = await processLedgerJournal(input);
    createdDocumentIds.push(result.detailed_document.document_id);

    assert.match(result.detailed_document.document_id, /^GLJ-\d+$/);
    assert.equal(result.detailed_document.generated_description, `Ledger Journal ${result.detailed_document.document_id}`);
    assert.equal(result.posting_details.journal_header.document_id, result.detailed_document.document_id);
  });

  it("rejects caller-supplied document description", async () => {
    const documentId = `GLJDESC${suffix()}`;
    const input = {
      ...request(documentId),
      generated_description: "Caller supplied description",
    };

    await assert.rejects(
      () => processLedgerJournal(input, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("$.generated_description is not allowed"),
    );
    assert.equal(await countJournals(documentId), 0);
  });

  it("does not persist rows in preview mode", async () => {
    const documentId = `GLJPV${suffix()}`;

    const result = await processLedgerJournal(request(documentId), { preview: true });

    assert.equal(result.posting_details.journal_header.status, "EPHEMERAL");
    assert.equal(result.posting_details.journal_header.id, null);
    assert.equal(await countJournals(documentId), 0);
  });

  it("rejects direct posting to a GL account linked to a posting code", async () => {
    const documentId = `GLJPC${suffix()}`;
    const input = request(documentId);
    input.lines[0].gl_account_code = "610000";

    await assert.rejects(
      () => processLedgerJournal(input, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("linked to POSTING_CODE"),
    );
    assert.equal(await countJournals(documentId), 0);
  });

  it("rejects direct posting to control and tax control GL accounts", async () => {
    const controlInput = request(`GLJCA${suffix()}`);
    controlInput.lines[0].gl_account_code = "110000";
    await assert.rejects(
      () => processLedgerJournal(controlInput, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("linked to CONTROL_ACCOUNT"),
    );

    const taxInput = request(`GLJTA${suffix()}`);
    taxInput.lines[0].gl_account_code = "220000";
    await assert.rejects(
      () => processLedgerJournal(taxInput, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("linked to TAX_CONTROL_ACCOUNT"),
    );
  });

  it("posts a full ledger journal reversal and carries dimensions", async () => {
    const sourceDocumentId = `GLJSRC${suffix()}`;
    createdDocumentIds.push(sourceDocumentId);
    const source = await processLedgerJournal(request(sourceDocumentId));
    const sourceCode = source.posting_details.journal_header.code;
    assert.ok(sourceCode);

    const reversal = await processLedgerJournalReversal(reversalRequest(undefined, sourceCode));
    createdDocumentIds.push(reversal.detailed_document.document_id);

    assert.match(reversal.detailed_document.document_id, /^GLJR-\d+$/);
    assert.equal(reversal.detailed_document.source_journal_code, sourceCode);
    assert.equal(reversal.detailed_document.posting_date, source.detailed_document.posting_date);
    assert.equal(reversal.posting_details.journal_header.document_type_code, "LEDGER_JOURNAL_REVERSAL");
    assert.equal(reversal.posting_details.journal_header.status, "POSTED");
    assert.equal(reversal.posting_details.journal_lines[0].dr_cr, "CR");
    assert.equal(reversal.posting_details.journal_lines[1].dr_cr, "DR");
    assert.equal(reversal.posting_details.journal_lines[0].dimensions?.[0].dimension_code, "SALES_CHANNEL");
  });

  it("accepts bank cash details on a ledger journal reversal when the source journal includes BANK_CASH", async () => {
    const sourceDocumentId = `GLJBCS${suffix()}`;
    const reversalDocumentId = `GLJBCR${suffix()}`;
    createdDocumentIds.push(sourceDocumentId, reversalDocumentId);
    const source = await processLedgerJournal(request(sourceDocumentId));
    const sourceCode = source.posting_details.journal_header.code;
    assert.ok(sourceCode);
    const reversalInput = reversalRequest(reversalDocumentId, sourceCode);
    reversalInput.bank_cash_details = {
      code: "BANK_PAYROLL",
      tx_id: `TEST-GLJR-${reversalDocumentId}`,
    };

    const reversal = await processLedgerJournalReversal(reversalInput);

    assert.equal(reversal.detailed_document.bank_cash_details?.code, "BANK_PAYROLL");
    const header = await getPool().query<{ bank_cash_code: string | null; bank_cash_tx_id: string | null }>(
      `SELECT bank_cash_code, bank_cash_tx_id FROM journal_header WHERE id = $1`,
      [reversal.posting_details.journal_header.id],
    );
    assert.equal(header.rows[0].bank_cash_code, "BANK_PAYROLL");
    assert.equal(header.rows[0].bank_cash_tx_id, `TEST-GLJR-${reversalDocumentId}`);
  });

  it("does not persist a reversal in preview mode", async () => {
    const sourceDocumentId = `GLJPVS${suffix()}`;
    const reversalDocumentId = `GLJPVR${suffix()}`;
    createdDocumentIds.push(sourceDocumentId);
    const source = await processLedgerJournal(request(sourceDocumentId));
    const sourceCode = source.posting_details.journal_header.code;
    assert.ok(sourceCode);

    const reversal = await processLedgerJournalReversal(reversalRequest(reversalDocumentId, sourceCode), { preview: true });

    assert.equal(reversal.posting_details.journal_header.status, "EPHEMERAL");
    assert.equal(await countJournals(reversalDocumentId), 0);
  });

  it("rejects reversing an already reversed ledger journal", async () => {
    const sourceDocumentId = `GLJARS${suffix()}`;
    const reversalDocumentId = `GLJARR${suffix()}`;
    createdDocumentIds.push(sourceDocumentId, reversalDocumentId);
    const source = await processLedgerJournal(request(sourceDocumentId));
    const sourceCode = source.posting_details.journal_header.code;
    assert.ok(sourceCode);
    await processLedgerJournalReversal(reversalRequest(reversalDocumentId, sourceCode));

    await assert.rejects(
      () => processLedgerJournalReversal(reversalRequest(`GLJARR2${suffix()}`, sourceCode), { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("has already been reversed"),
    );
  });
});

