import { InternalServerErrorResponseDto } from "@voyzu/types";
import {
  InventoryReportDto,
  InventoryReportKeyDto,
} from "./types/report.types";
export const apiDefinitions = {
  report: {
    method: "GET",
    path: "/inventory/reports/[report]",
    loadHandler: () =>
      import("./server/api/report.http.handlers").then((m) => m.handleReport),
    summary: "Get inventory report",
    description:
      "Builds the selected Inventory report for the active organization.",
    tags: ["Inventory Reports"],
    request: { path: { report: { schema: InventoryReportKeyDto } } },
    responses: {
      "200": { description: "Inventory report", body: InventoryReportDto },
      "500": {
        description: "Unexpected error",
        body: InternalServerErrorResponseDto,
      },
    },
  },
} as const;
