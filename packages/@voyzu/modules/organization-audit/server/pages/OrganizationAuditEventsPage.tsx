import "server-only";

import { listCompanies } from "@voyzu/modules/companies/server";
import { previousDaysRange } from "@voyzu/modules/common/audit/server";
import { detailBackHref, normalizeDetailBackSource } from "@voyzu/modules/common/server";

import { OrganizationAuditEventList } from "../../client";

interface OrganizationAuditEventsPageProps {
  surface?: { searchParams?: Record<string, string> };
}

function normalizeAuditLinkParams(searchParams: Record<string, string>) {
  const rawEntityId = searchParams.entityId ?? "";
  const entityIdLooksLikeDatabaseId = rawEntityId === "" || /^\d+$/.test(rawEntityId);

  return {
    entityType: searchParams.entityType ?? "",
    entityCode: searchParams.entityCode ?? (entityIdLooksLikeDatabaseId ? "" : rawEntityId),
    entityId: entityIdLooksLikeDatabaseId ? rawEntityId : "",
    mutationId: searchParams.mutationId ?? "",
  };
}

export async function OrganizationAuditEventsPage({ surface }: OrganizationAuditEventsPageProps = {}) {
  const companies = await listCompanies();
  const { fromDate, toDate } = previousDaysRange(90);
  const searchParams = surface?.searchParams ?? {};
  const initialFilters = normalizeAuditLinkParams(searchParams);
  const hasLinkedEntityFilter = Boolean(initialFilters.entityType || initialFilters.entityCode || initialFilters.entityId || initialFilters.mutationId);
  const backFrom = normalizeDetailBackSource(searchParams.from);
  const backFromCode = searchParams.fromCode;
  const hasBackTarget = backFrom === "organizationAudit"
    && detailBackHref({ from: backFrom, fromCode: backFromCode, fallbackHref: "" }) !== "";

  return (
    <OrganizationAuditEventList
      companies={companies.map((company) => ({
        id: company.id,
        code: company.code,
        name: company.name,
      }))}
      initialFinancialYears={[]}
      initialSelectedYearCode=""
      initialDateFrom={hasLinkedEntityFilter ? "" : fromDate}
      initialDateTo={hasLinkedEntityFilter ? "" : toDate}
      suppressInitialDateFilter={hasLinkedEntityFilter}
      initialEntityType={initialFilters.entityType}
      initialEntityCode={initialFilters.entityCode}
      initialEntityId={initialFilters.entityId}
      initialMutationId={initialFilters.mutationId}
      backFromCode={hasBackTarget ? backFromCode : undefined}
    />
  );
}
