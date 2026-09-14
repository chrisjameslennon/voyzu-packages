import { getAccessibleOrganization } from "./organization-access";
import { getDb } from "@voyzu/capability/db";
import { internalApi } from "@voyzu/capability/internal-api";
import { BusinessRuleError } from "@voyzu/capability/errors";
type Scope = { organization_id: number };
type Document = Scope & { document_type: string; code: string; document: Record<string, unknown>; details: Record<string, unknown> };
type Counterparty = Scope & { party_id: number; code: string; name: string; status: "ACTIVE" | "INACTIVE"; country_code: string | null; tax_region_or_province: string | null };
async function authorize(organization_id: number) {
 await getAccessibleOrganization({ organization_id });
}
function counterparties(side: "ar" | "ap") {
 const table = side === "ar" ? "ar_counterparty" : "ap_counterparty";
 const select = "SELECT c.organization_id::int, p.id::int AS party_id, p.code, p.name, c.status, c.country_code, c.tax_region_or_province FROM " + table + " c JOIN party p ON p.id = c.party_id";
 return {
  async get({ organization_id, party_id }: Scope & { party_id: number }): Promise<Counterparty | null> {
   await authorize(organization_id);
   const { rows } = await getDb().query(select + " WHERE c.organization_id = $1 AND c.party_id = $2", [organization_id, party_id]);
   return (rows[0] as Counterparty | undefined) ?? null;
  },
  async list({ organization_id }: Scope): Promise<Counterparty[]> {
   await authorize(organization_id);
   const { rows } = await getDb().query(select + " WHERE c.organization_id = $1 ORDER BY p.code", [organization_id]);
   return rows as Counterparty[];
  },
  async ensure(input: Scope & { code: string; name: string; country_code?: string; tax_region_or_province?: string }): Promise<Counterparty> {
   await authorize(input.organization_id);
   // Serialize creation of the shared identity across AR and AP in this transaction.
   await getDb().query("SELECT pg_advisory_xact_lock(hashtext($1))", ["party:" + input.code]);
   const party = await internalApi.call("@core/party", "get", { code: input.code })
     ?? await internalApi.call("@core/party", "create", { code: input.code, name: input.name });
   await getDb().query("INSERT INTO " + table + " (organization_id, party_id, status, country_code, tax_region_or_province, creation_date, creation_actor_type, updated_date, updated_actor_type) VALUES ($1,$2,'ACTIVE',$3,$4,now(),'SYSTEM',now(),'SYSTEM') ON CONFLICT (organization_id, party_id) DO NOTHING", [input.organization_id, party.party_id, input.country_code ?? null, input.tax_region_or_province ?? null]);
   const { rows } = await getDb().query(select + " WHERE c.organization_id = $1 AND c.party_id = $2", [input.organization_id, party.party_id]);
   return rows[0] as Counterparty;
  },
 };
}
export const arMethods = counterparties("ar");
export const apMethods = counterparties("ap");
export const documentMethods = {
 async get({ organization_id, document_type, code }: Scope & { document_type: string; code: string }): Promise<Document | null> {
  await authorize(organization_id);
  const { rows } = await getDb().query("SELECT organization_id::int, document_type, code, document, details FROM finance_document WHERE organization_id = $1 AND document_type = $2 AND code = $3", [organization_id, document_type, code]);
  return (rows[0] as Document | undefined) ?? null;
 },
 async record(input: Document): Promise<Document> {
  await authorize(input.organization_id);
  await getDb().query("INSERT INTO finance_document (organization_id, document_type, code, document, details) VALUES ($1,$2,$3,$4::jsonb,$5::jsonb) ON CONFLICT (organization_id, document_type, code) DO NOTHING", [input.organization_id, input.document_type, input.code, JSON.stringify(input.document), JSON.stringify(input.details)]);
  const { rows } = await getDb().query("SELECT organization_id::int, document_type, code, document, details FROM finance_document WHERE organization_id = $1 AND document_type = $2 AND code = $3", [input.organization_id, input.document_type, input.code]);
  return rows[0] as Document;
 },
};
