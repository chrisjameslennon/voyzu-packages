import "server-only";
import { command } from "@voyzu/capability/commands";
import Type from "typebox";
import {
  InventoryReportDto,
  InventoryReportKeyDto,
} from "./types/report.types";
const load = () => import("./server/lib/report.service");
export const getInventoryReport = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), InventoryReportKeyDto]),
    result: InventoryReportDto,
  },
  () => load().then((m) => m.getInventoryReport),
);
export const commands = { getInventoryReport } as const;
