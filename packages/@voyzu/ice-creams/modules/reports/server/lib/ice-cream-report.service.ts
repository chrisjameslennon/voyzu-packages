import type { IceCreamReportRowDto } from "@voyzu/ice-creams/types";
import { listIceCreams } from "../../../ice-creams/server/lib/ice-cream.service";

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
