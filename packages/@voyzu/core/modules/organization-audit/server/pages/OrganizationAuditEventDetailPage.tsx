import "server-only";

import { notFound } from "next/navigation";
import { getAuditEvent } from "@voyzu/audit/server";

import { OrganizationAuditEventDetail } from "../../client";

interface OrganizationAuditEventDetailPageProps {
  id?: string;
}

export async function OrganizationAuditEventDetailPage({ id }: OrganizationAuditEventDetailPageProps) {
  if (!id) notFound();

  const event = await getAuditEvent(Number(id));
  if (!event || event.packageCode !== "@voyzu/core") notFound();

  return (
    <OrganizationAuditEventDetail
      event={event}
      routeBasePath="/organization/audit"
    />
  );
}
