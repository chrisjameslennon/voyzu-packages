import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";
import { TemplateDetail } from "../../client";
import { getTemplate } from "../lib/template.service";

export async function TemplateDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const template = await getTemplate((code));
  if (!template) notFound();
  return <TemplateDetail template={template} />;
}
