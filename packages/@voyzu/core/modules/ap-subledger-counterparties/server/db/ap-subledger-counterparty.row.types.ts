export interface ApCounterpartyRow {
  id: number;
  finance_company_id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string | null;
  country_name: string | null;
  tax_region_or_province: string | null;
  creation_date: string;
  creation_actor_type: "APP" | "API" | "SYSTEM";
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: "APP" | "API" | "SYSTEM";
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}
