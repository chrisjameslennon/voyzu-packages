import "server-only";

import { getAllIceCreamsReport as getAllIceCreamsReportService } from "./server/lib/ice-cream-report.service";

export const getAllIceCreamsReport = (
  ...args: Parameters<typeof getAllIceCreamsReportService>
): ReturnType<typeof getAllIceCreamsReportService> => getAllIceCreamsReportService(...args);

export const operations = {
  getAllIceCreamsReport,
} as const;
