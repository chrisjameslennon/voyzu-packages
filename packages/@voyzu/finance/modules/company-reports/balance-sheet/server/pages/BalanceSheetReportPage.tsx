import "server-only";

import { cookies } from "next/headers";
import { listOrganizations } from "@voyzu/erp-core/organizations/server";
import {
  SELECTED_ORGANIZATION_COOKIE,
  parseSelectedOrganizationId,
} from "@voyzu/erp-core/organization-switcher/server";

import { BalanceSheetReport } from "../../client";
import { BalanceSheetReportTemplate } from "../../templates/BalanceSheetReportTemplate";
import {
  getBalanceSheet,
  listFinancialYearsWithPostings,
} from "../lib/balance-sheet.service";

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

export async function BalanceSheetReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedOrganizationId(cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value);
  const companies = await listOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const today = todayIso();

  if (!company) {
    return (
      <BalanceSheetReport
        pageTitle="Balance Sheet"
        initialData={null}
        initialAsAtDate={today}
        initialFinancialYears={[]}
        initialSelectedYearCode=""
        selectedCompanyId={null}
      />
    );
  }

  const financialYears = await listFinancialYearsWithPostings(company.id);
  const currentYear = financialYears.find((year) => year.startDate <= today && today <= year.endDate) ?? financialYears[0];
  const defaultAsAtDate = currentYear
    ? (today > currentYear.endDate ? currentYear.endDate : today < currentYear.startDate ? currentYear.startDate : today)
    : today;
  const asAtDate = query.asAtDate ?? defaultAsAtDate;
  const initialData = await getBalanceSheet(company.id, asAtDate);

  if (surface?.unframed) {
    return (
      <BalanceSheetReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showCompanyHeader={query.showCompanyHeader !== "false"}
        showCompanyFooter={query.showCompanyFooter !== "false"}
        showAccountCode={query.showAccountCode !== "false"}
        showReportingCategories={query.showReportingCategories === "true"}
        showDecimals={query.showDecimals !== "false"}
      />
    );
  }

  return (
    <BalanceSheetReport
      pageTitle="Balance Sheet"
      initialData={initialData}
      initialAsAtDate={asAtDate}
      initialFinancialYears={financialYears}
      initialSelectedYearCode={currentYear?.code ?? ""}
      selectedCompanyId={company.id}
    />
  );
}
