import "server-only";
import { operation } from "@voyzu/capability/operations";
import Type from "typebox";
import {
  InventoryReportDto,
  InventoryReportKeyDto,
} from "./types/report.types";
const load = () => import("./server/lib/report.service");
export const getInventoryReport = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), InventoryReportKeyDto]),
    result: InventoryReportDto,
  },
  () => load().then((m) => m.getInventoryReport),
);
export const operations = { getInventoryReport } as const;
