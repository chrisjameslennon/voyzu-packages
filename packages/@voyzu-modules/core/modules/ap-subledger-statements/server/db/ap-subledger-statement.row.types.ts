import type { EntryType } from "@voyzu/types/modules/core";
export interface ApCounterpartySummaryRow {
  counterparty_code: string;
  counterparty_name: string;
  open_bills_amount: number;
  unapplied_payments_amount: number;
  net_balance: number;
}

export interface ApCounterpartyStatementRow {
  entry_header_id: number;
  parent_entry_header_id: number | null;
  code: string;
  posting_date: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  applied_to_document_id: string | null;
  memo: string | null;
  description: string;
  entry_type: EntryType;
  base_currency_amount: number;
  base_currency_code: string;
  counterparty_code: string;
  counterparty_name: string;
}
