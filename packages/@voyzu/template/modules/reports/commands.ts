import "server-only";

import { command } from "@voyzu/capability/commands";
import Type from "typebox";

import { TemplateReportRowDto } from "../types";

export const getAllTemplatesReport = command.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(TemplateReportRowDto) },
  () => import("./server/lib/template-report.service")
    .then((module) => module.getAllTemplatesReport),
);

export const commands = { getAllTemplatesReport } as const;
