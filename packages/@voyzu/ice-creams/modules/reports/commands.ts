import "server-only";

import { command } from "@voyzu/capability/commands";
import { IceCreamReportRowDto } from "@voyzu/ice-creams/types";
import Type from "typebox";

export const getAllIceCreamsReport = command.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(IceCreamReportRowDto) },
  () => import("./server/lib/ice-cream-report.service")
    .then((module) => module.getAllIceCreamsReport),
);

export const commands = {
  getAllIceCreamsReport,
} as const;
