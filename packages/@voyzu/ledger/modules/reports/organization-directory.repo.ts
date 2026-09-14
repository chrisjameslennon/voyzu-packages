import { getDb } from "@voyzu/capability/db";
export async function listReportOrganizations() {
  const { rows } = await getDb().query("SELECT id, code, name, base_currency_code FROM organization WHERE status != 'DELETED' ORDER BY code");
  return rows.map(row => ({ id: Number(row.id), code: String(row.code), name: String(row.name), baseCurrencyCode: String(row.base_currency_code) }));
}
