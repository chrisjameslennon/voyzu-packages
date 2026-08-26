import "server-only";

import { operation } from "@voyzu/capability/operations";
import { IceCreamReportRowDto } from "@voyzu/ice-creams/types";
import Type from "typebox";

export const getAllIceCreamsReport = operation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(IceCreamReportRowDto) },
  () => import("./server/lib/ice-cream-report.service")
    .then((module) => module.getAllIceCreamsReport),
);

export const operations = {
  getAllIceCreamsReport,
} as const;
