import "server-only";


import { capabilities, semanticData } from "@voyzu/capability/contracts";

import { TrialBalanceReport } from "../../client";
import { TrialBalanceReportTemplate } from "../../templates/TrialBalanceReportTemplate";
import { getTrialBalance } from "../lib/trial-balance.service";

interface ReportPageProps {
  surface?: {
    searchParams?: Record<string, string>;
    unframed?: boolean;
  };
}

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export async function TrialBalanceReportPage({ surface }: ReportPageProps = {}) {
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await capabilities.use("erp.organization-context").getSavedOrganizationId({})).organizationId;
  const companies = await semanticData.query("organization", "all", {});
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const today = query.asAtDate ?? todayIso();

  if (!company) {
    return <TrialBalanceReport pageTitle="Trial Balance" initialData={null} initialAsAtDate={today} selectedCompanyId={null} />;
  }

  const initialData = await getTrialBalance(company.id, today);

  if (surface?.unframed) {
    return (
      <TrialBalanceReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showAccountCode={query.showAccountCode === "true"}
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
