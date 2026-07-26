import type { InsertJournalLineRow } from "../../../journals/server/db/journal.row.types";

export const LEDGER_JOURNAL_ENGINE_CODE = "LEDGER_JOURNAL";
export const LEDGER_JOURNAL_DOCUMENT_LABEL = "Ledger Journal";
export const LEDGER_JOURNAL_REVERSAL_ENGINE_CODE = "LEDGER_JOURNAL_REVERSAL";
export const LEDGER_JOURNAL_REVERSAL_DOCUMENT_LABEL = "Ledger Journal Reversal";

export type LedgerJournalPostingLine = Omit<InsertJournalLineRow, "journal_header_id"> & {
  dimensions?: Array<{
    dimension_id: number;
    dimension_value_id: number;
    dimension_code: string;
    dimension_name: string;
    dimension_value_name: string;
  }>;
};
