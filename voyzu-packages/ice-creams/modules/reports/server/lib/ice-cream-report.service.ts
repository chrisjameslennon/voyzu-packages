import type { IceCreamReportRowDto } from "../../../types";
import { listIceCreams } from "../../../ice-creams/server";

export async function getAllIceCreamsReport(): Promise<IceCreamReportRowDto[]> {
  return (await listIceCreams()).map((iceCream) => ({
    code: iceCream.code,
    name: iceCream.name,
    flavorCode: iceCream.flavor.code,
    flavorName: iceCream.flavor.name,
    supplier: iceCream.supplier,
    status: iceCream.status,
  }));
}
