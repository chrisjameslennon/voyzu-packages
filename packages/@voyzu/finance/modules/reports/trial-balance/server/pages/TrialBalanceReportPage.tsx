import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listReportOrganizations } from "../../../organization-directory.repo";
import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";

import { TrialBalanceReport } from "../../client/index";
import { TrialBalanceReportTemplate } from "../../templates/TrialBalanceReportTemplate";
import { getTrialBalance } from "../lib/trial-balance.service";

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export async function TrialBalanceReportPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const queryCompanyId = context.queryParams.companyId ? Number(context.queryParams.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await internalApi.call("@core/organization-context", "get", {})).organization_id;
  const companies = await listReportOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const today = query.asAtDate ?? todayIso();

  if (!company) {
    return <TrialBalanceReport pageTitle="Trial Balance" initialData={null} initialAsAtDate={today} selectedCompanyId={null} />;
  }

  const initialData = await getTrialBalance(company.id, today);

  if (context.routeDefinition.unframed) {
    return (
      <TrialBalanceReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showAccountCode={context.queryParams.showAccountCode === true}
      />
    );
  }

  return (
    <TrialBalanceReport
      pageTitle="Trial Balance"
      initialData={initialData}
      initialAsAtDate={today}
      selectedCompanyId={company.id}
    />
  );
}
