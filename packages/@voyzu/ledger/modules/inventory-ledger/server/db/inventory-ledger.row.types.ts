export interface InventoryLedgerEntryRow {
  id: number;
  line_id: number;
  code: string;
  journal_header_id: number;
  journal_code: string;
  line_number: number;
  posting_date: string;
  document_date: string;
  source_document: string;
  movement: string;
  document_id: string;
  upstream_document_type_code: string | null;
  upstream_document_id: string | null;
  description: string | null;
  memo: string | null;
  line_description: string | null;
  line_memo: string | null;
  item_code: string;
  item_name: string;
  qty_delta: number;
  unit_value_supplied: number | null;
  book_value_delta: number;
  qty_balance: number;
  avg_unit_value: number;
  book_value_balance: number;
  base_currency_code: string;
  status: "POSTED";
  control_account_code: string;
  control_account_name: string;
  gl_account_code: string;
  gl_account_name: string;
  control_account_balances_json: {
    controlAccountCode: string;
    controlAccountName: string;
    glAccountCode: string;
    glAccountName: string;
    balance: number;
  }[];
  document_snapshot_json: Record<string, unknown>;
  detailed_document_snapshot_json: Record<string, unknown>;
  creation_date: string | null;
  updated_date: string | null;
}

export interface InventoryValuationRow {
  item_id: number; item_code: string; item_name: string; qty_balance: number;
  avg_unit_value: number; book_value_balance: number; base_currency_code: string; posting_date: string;
}
