import "server-only";

import { notFound } from "next/navigation";
import { getAuditEvent } from "@voyzu/audit/server";
import { IceCreamAuditEventDetail, IceCreamAuditEventList } from "../../client";

interface IceCreamAuditEventsPageProps {
  surface?: { searchParams?: Record<string, string> };
}

export async function IceCreamAuditEventsPage({ surface }: IceCreamAuditEventsPageProps = {}) {
  return <IceCreamAuditEventList initialFilters={surface?.searchParams} />;
}

export async function IceCreamAuditEventDetailPage({ id }: { id?: string }) {
  if (!id) notFound();
  const event = await getAuditEvent(Number(id));
  if (!event || event.packageCode !== "@voyzu/ice-creams") notFound();
  return <IceCreamAuditEventDetail event={event} />;
}
