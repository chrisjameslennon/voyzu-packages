import type { TemplateReportRowDto } from "../../../types";
import { listTemplates } from "../../../template/server";

export async function getAllTemplatesReport(): Promise<TemplateReportRowDto[]> {
  return (await listTemplates()).map(({ code, description, status }) => ({ code, description, status }));
}
