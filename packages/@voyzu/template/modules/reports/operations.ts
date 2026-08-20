import "server-only";
import { getAllTemplatesReport as getAllTemplatesReportService } from "./server/lib/template-report.service";

export const getAllTemplatesReport = (
  ...args: Parameters<typeof getAllTemplatesReportService>
): ReturnType<typeof getAllTemplatesReportService> => getAllTemplatesReportService(...args);

export const operations = { getAllTemplatesReport } as const;
