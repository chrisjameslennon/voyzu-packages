import { getStockActivityDetail as readStockActivityDetail } from "./stock.service";

export async function getStockActivityDetail(input: { organizationId: number; code: string }) {
  return { record: await readStockActivityDetail(input.organizationId, input.code) };
}
