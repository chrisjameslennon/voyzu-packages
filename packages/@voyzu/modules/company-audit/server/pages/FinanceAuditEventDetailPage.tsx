import "server-only";

import { notFound } from "next/navigation";

import { resolveServerCompanyApiContext } from "@voyzu/modules/common/server";
import { getAuditEvent } from "@voyzu/modules/common/audit/server";

import { FinanceAuditEventDetail } from "../../client";

interface FinanceAuditEventDetailPageProps {
  id?: string;
}

export async function FinanceAuditEventDetailPage({ id }: FinanceAuditEventDetailPageProps) {
  if (!id) notFound();

  const [event, company] = await Promise.all([
    getAuditEvent(Number(id)),
    resolveServerCompanyApiContext(),
  ]);

  if (!event || event.companyId !== company.companyId) {
    notFound();
  }

  return (
    <FinanceAuditEventDetail
      event={event}
      routeBasePath="/finance/audit"
    />
  );
}
