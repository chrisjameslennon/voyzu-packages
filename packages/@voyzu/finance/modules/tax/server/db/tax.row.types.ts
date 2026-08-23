import type { ActorType } from "@voyzu/finance/types/modules/core";
export interface AuditRow {
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export interface TaxAuthorityRow extends AuditRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  region_code: string | null;
  jurisdiction_level: string;
  tax_family_code: string;
  description: string | null;
  status: string;
}

export interface ApplicableTaxAuthorityRow extends TaxAuthorityRow {
  balance: number;
}

export type InsertTaxAuthorityRow = Omit<TaxAuthorityRow, "id" | keyof AuditRow>;
type UpdateAuditRow = Partial<Pick<AuditRow, "updated_date" | "updated_actor_type" | "updated_user_id" | "updated_mutation_id">>;

export type UpdateTaxAuthorityRow = InsertTaxAuthorityRow & UpdateAuditRow;
export type PatchTaxAuthorityRow = Partial<UpdateTaxAuthorityRow>;

export interface TaxRuleRow extends AuditRow {
  id: number;
  code: string;
  country_code: string;
  region_code: string | null;
  name: string;
  invoice_label: string;
  report_label: string;
  calculation_method: string;
  component_mode: string;
  component_count: number;
  description: string | null;
  status: string;
}

export type InsertTaxRuleRow = Omit<TaxRuleRow, "id" | keyof AuditRow>;
export type UpdateTaxRuleRow = InsertTaxRuleRow & UpdateAuditRow;
export type PatchTaxRuleRow = Partial<UpdateTaxRuleRow>;

export interface TaxComponentRow extends AuditRow {
  id: number;
  code: string;
  tax_rule_code: string;
  tax_authority_code: string;
  scheme_code: string;
  invoice_label: string;
  report_label: string;
  rate: number;
  base_amount_type: string;
  calculation_order: number;
  description: string | null;
  status: string;
}

export type InsertTaxComponentRow = Omit<TaxComponentRow, "id" | keyof AuditRow>;
export type UpdateTaxComponentRow = InsertTaxComponentRow & UpdateAuditRow;
export type PatchTaxComponentRow = Partial<UpdateTaxComponentRow>;
