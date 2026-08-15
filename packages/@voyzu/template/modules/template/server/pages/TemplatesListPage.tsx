import "server-only";

import { TemplatesList } from "../../client";
import { listTemplates } from "../lib/template.service";

export async function TemplatesListPage() {
  return <TemplatesList templates={await listTemplates()} />;
}
