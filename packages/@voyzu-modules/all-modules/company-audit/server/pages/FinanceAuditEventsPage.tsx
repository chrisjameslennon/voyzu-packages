import "server-only";

import { detailBackHref, normalizeDetailBackSource, resolveServerCompanyApiContext } from "@voyzu-modules/all-modules/common/server";
import { listFinancialYears } from "@voyzu-modules/all-modules/financial-years/server";
import { previousDaysRange, todayIso } from "@voyzu-modules/all-modules/common/audit/server";

import { FinanceAuditEventList } from "../../client";

interface FinanceAuditEventsPageProps {
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

export async function FinanceAuditEventsPage({ surface }: FinanceAuditEventsPageProps = {}) {
  const company = await resolveServerCompanyApiContext();
  const searchParams = surface?.searchParams ?? {};
  const initialFilters = normalizeAuditLinkParams(searchParams);
  const hasLinkedEntityFilter = Boolean(initialFilters.entityType || initialFilters.entityCode || initialFilters.entityId || initialFilters.mutationId);
  const backFrom = normalizeDetailBackSource(searchParams.from);
  const backFromCode = searchParams.fromCode;
  const hasBackTarget = backFrom === "companyAudit"
    && detailBackHref({ from: backFrom, fromCode: backFromCode, fallbackHref: "" }) !== "";

  const today = todayIso();
  const allYears = await listFinancialYears(company.companyId);
  const yearsWithPostings = allYears.filter((year) => year.hasPostings);
  const selectedYear = yearsWithPostings.find((year) => year.startDate <= today && today <= year.endDate)
    ?? yearsWithPostings[0]
    ?? allYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? null;
  const { fromDate, toDate } = previousDaysRange(90, selectedYear?.startDate);

  return (
    <FinanceAuditEventList
      initialCompanyId={String(company.companyId)}
      initialFinancialYears={yearsWithPostings}
      initialSelectedYearCode={selectedYear?.code ?? ""}
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
