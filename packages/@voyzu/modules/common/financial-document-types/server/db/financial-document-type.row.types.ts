import type { ActorType } from "@voyzu/types/modules/core";
export interface FinancialDocumentTypeRow {
  code: string;
  name: string;
  description: string;
  document_purpose: string;
  primary_supporting_ledger: string;
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
  status: string;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertFinancialDocumentTypeRow {
  code: string;
  name: string;
  description: string;
  document_purpose: string;
  primary_supporting_ledger: string;
  supports_dimensions?: boolean;
  cash_movement?: boolean;
  supports_items?: boolean;
  status?: string;
  creation_user_id?: string | null;
}

export interface UpdateFinancialDocumentTypeRow {
  code: string;
  name: string;
  description: string;
  document_purpose: string;
  primary_supporting_ledger: string;
  status: string;
  updated_user_id?: string | null;
}

export type PatchFinancialDocumentTypeRow = Partial<UpdateFinancialDocumentTypeRow>;
