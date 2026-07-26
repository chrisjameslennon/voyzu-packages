import "server-only";

import { cookies } from "next/headers";

import { listCompanies } from "@voyzu-modules/core/companies/server";
import {
  SELECTED_COMPANY_COOKIE,
  parseSelectedCompanyId,
} from "@voyzu-modules/core/company-switcher/server";

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
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedCompanyId(cookieStore.get(SELECTED_COMPANY_COOKIE)?.value);
  const companies = await listCompanies();
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
