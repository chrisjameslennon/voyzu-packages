import "server-only";

import { notFound } from "next/navigation";
import { TemplateDetail } from "../../client";
import { getTemplate } from "../lib/template.service";

export async function TemplateDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const template = await getTemplate(decodeURIComponent(code));
  if (!template) notFound();
  return <TemplateDetail template={template} />;
}
