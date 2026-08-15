import "server-only";

import { notFound } from "next/navigation";
import { getAuditEvent } from "@voyzu/audit/server";
import { TemplateAuditEventDetail, TemplateAuditEventList } from "../../client";

interface TemplateAuditEventsPageProps {
  surface?: { searchParams?: Record<string, string> };
}

export async function TemplateAuditEventsPage({ surface }: TemplateAuditEventsPageProps = {}) {
  return <TemplateAuditEventList initialFilters={surface?.searchParams} />;
}

export async function TemplateAuditEventDetailPage({ id }: { id?: string }) {
  if (!id) notFound();
  const event = await getAuditEvent(Number(id));
  if (!event || event.packageCode !== "@voyzu/template") notFound();
  return <TemplateAuditEventDetail event={event} />;
}
