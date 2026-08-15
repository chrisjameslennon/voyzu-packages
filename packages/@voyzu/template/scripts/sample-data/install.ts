import type { TemplateCreateRequestDto } from "../../modules/types";
import {
  batchCreateTemplates,
  batchGetTemplates,
} from "../../modules/template/server";

export const templateSampleData: TemplateCreateRequestDto[] = [
  { code: "EXAMPLE_ONE", description: "First example template record." },
  { code: "EXAMPLE_TWO", description: "Second example template record." },
];

/** Installs repeatable demonstration data without overwriting existing records. */
export async function install(): Promise<void> {
  const existing = await batchGetTemplates(templateSampleData.map(({ code }) => code));
  const existingCodes = new Set(existing.map(({ code }) => code));
  const missing = templateSampleData.filter(({ code }) => !existingCodes.has(code));
  if (missing.length) await batchCreateTemplates(missing);
}

export default install;
