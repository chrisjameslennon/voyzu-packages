import type { InventoryProcessingRuleAction, InventoryProcessingRuleDirection } from "../../domain/index";

export interface FinanceInventoryActivityRow {
  id: number;
  inventory_financial_activity_id: number;
  inventory_transaction_line_id: number;
  inventory_document_code: string;
  inventory_document_type: "RECEIPT" | "ISSUE" | "ADJUSTMENT";
  item_id: number;
  item_code: string;
  item_name: string;
  quantity_change: number;
  reason_code: string | null;
  activity_date: string;
  processing_status: "RECEIVED" | "PROCESSED";
  finance_document_type: string | null;
  finance_document_id: number | null;
  finance_document_code: string | null;
  processed_at: string | null;
  creation_date: string;
  creation_actor_type: "API" | "APP" | "SYSTEM" | null;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: "API" | "APP" | "SYSTEM" | null;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface FinanceInventoryProcessingRuleRow {
  id: number;
  inventory_document_type: "RECEIPT" | "ISSUE" | "ADJUSTMENT";
  reason_code: string;
  direction: InventoryProcessingRuleDirection;
  action: InventoryProcessingRuleAction;
  offset_gl_account_id: number | null;
  offset_gl_account_code: string | null;
  offset_gl_account_name: string | null;
  creation_date: string;
  creation_actor_type: "API" | "APP" | "SYSTEM" | null;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: "API" | "APP" | "SYSTEM" | null;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}
