import { getDb } from "@voyzu/capability/db";
import { StockRepo } from "../db/stock.repo";
import { getStockActivityDetail } from "./stock.service";
export async function get(id: number) {
  const key = await new StockRepo(getDb()).activityKeyById(id);
  return key ? getStockActivityDetail(key.organizationId, key.code) : null;
}
export async function byCode(input: { organizationId: number; code: string }) {
  const record = await getStockActivityDetail(input.organizationId, input.code);
  return record ? [record] : [];
}
