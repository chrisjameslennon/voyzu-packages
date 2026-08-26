import "server-only";

import { operation } from "@voyzu/capability/operations";
import Type from "typebox";

import { TemplateReportRowDto } from "../types";

export const getAllTemplatesReport = operation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(TemplateReportRowDto) },
  () => import("./server/lib/template-report.service")
    .then((module) => module.getAllTemplatesReport),
);

export const operations = { getAllTemplatesReport } as const;
