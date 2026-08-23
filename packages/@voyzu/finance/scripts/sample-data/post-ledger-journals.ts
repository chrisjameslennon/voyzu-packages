import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import type { LedgerJournalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine";
import type { LedgerJournalReversalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine";
import { processLedgerJournal, processLedgerJournalReversal } from "@voyzu/finance/financial-document-processing-engine/server";
import { skipExistingSampleDocument } from "./sample-document";
import { SAMPLE_POSTING_COMPANIES, type SampleCompanyConfig } from "./sample-company-config";

const JOURNALS: Array<Omit<LedgerJournalRequestDto, "company_code">> = [
  {
    document_type: "LEDGER_JOURNAL",
    document_id: "SAMP-GLJ-001",
    document_memo: "Sample ledger journal one",
    posting_date: "2026-05-12",
    lines: [
      {
        line_id: 1,
        gl_account_code: "650000",
        description: "Professional fees",
        dr_cr: "DR",
        base_currency_amount: "1250.00",
        dimensions: { SALES_CHANNEL: "Direct" },
      },
      {
        line_id: 2,
        gl_account_code: "100100",
        description: "Payroll bank",
        dr_cr: "CR",
        base_currency_amount: "1250.00",
      },
    ],
  },
  {
    document_type: "LEDGER_JOURNAL",
    document_id: "SAMP-GLJ-002",
    document_memo: "Sample ledger journal two",
    posting_date: "2026-05-15",
    lines: [
      {
        line_id: 1,
        gl_account_code: "630000",
        description: "IT and software",
        dr_cr: "DR",
        base_currency_amount: "450.00",
        dimensions: { SALES_CHANNEL: "Online" },
      },
      {
        line_id: 2,
        gl_account_code: "240000",
        description: "Accrued expenses",
        dr_cr: "CR",
        base_currency_amount: "450.00",
      },
    ],
  },
];

async function postForCompany(config: SampleCompanyConfig) {
  let sourceJournalCode: string | null = null;

  for (const journal of JOURNALS) {
    if (await skipExistingSampleDocument(config.companyCode, journal.document_id)) {
      if (journal.document_id === "SAMP-GLJ-001") {
        const existing = await getPool().query<{ code: string }>(
          `SELECT h.code
             FROM journal_header h
             JOIN finance_organization fc ON fc.id = h.finance_organization_id
             JOIN organization c ON c.id = fc.organization_id
            WHERE c.code = $1 AND h.document_id = $2
            LIMIT 1`,
          [config.companyCode, journal.document_id],
        );
        sourceJournalCode = existing.rows[0]?.code ?? null;
      }
      continue;
    }
    const response = await processLedgerJournal({ ...journal, company_code: config.companyCode });
    if (journal.document_id === "SAMP-GLJ-001") sourceJournalCode = response.posting_details.journal_header.code;
    console.log(
      `posted ${config.companyCode} ${response.detailed_document.document_id} ` +
      `journal ${response.posting_details.journal_header.code} ` +
      `debit ${response.detailed_document.total_debit_base_amount}`,
    );
  }

  if (!sourceJournalCode) throw new Error(`First sample ledger journal did not return a journal code for ${config.companyCode}`);

  const reversalRequest: LedgerJournalReversalRequestDto = {
    document_type: "LEDGER_JOURNAL_REVERSAL",
    company_code: config.companyCode,
    document_id: "SAMP-GLJR-001",
    document_memo: "Reverse sample ledger journal one",
    source_journal_code: sourceJournalCode,
  };

  if (await skipExistingSampleDocument(config.companyCode, reversalRequest.document_id)) {
    return;
  }

  const reversal = await processLedgerJournalReversal(reversalRequest);
  console.log(
    `posted ${config.companyCode} ${reversal.detailed_document.document_id} ` +
    `reversal journal ${reversal.posting_details.journal_header.code} ` +
    `for ${reversal.detailed_document.source_journal_code}`,
  );
}

async function main() {
  for (const company of SAMPLE_POSTING_COMPANIES) {
    await postForCompany(company);
  }
  await getPool().end();
}

main();
