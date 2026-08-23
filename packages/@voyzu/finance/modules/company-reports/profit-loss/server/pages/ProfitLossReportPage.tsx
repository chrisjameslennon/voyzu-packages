import "server-only";

import { cookies } from "next/headers";

import { listOrganizations } from "@voyzu/erp-core/organizations/server";
import {
  SELECTED_ORGANIZATION_COOKIE,
  parseSelectedOrganizationId,
} from "@voyzu/erp-core/organization-switcher/server";
import { listFinancialYears } from "@voyzu/finance/financial-years/server";
import { listPeriods } from "@voyzu/finance/financial-years/server";

import { ProfitLossReport } from "../../client";
import { ProfitLossReportTemplate } from "../../templates/ProfitLossReportTemplate";
import { getProfitLoss } from "../lib/profit-loss.service";

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

function previous90DaysStartIso(): string {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
  return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;
}

function previous90DaysRange(fiscalYearStartDate?: string): { fromDate: string; toDate: string } {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
  const fromDate = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;
  const toDate = todayIso();
  return { fromDate: fiscalYearStartDate && fromDate < fiscalYearStartDate ? fiscalYearStartDate : fromDate, toDate };
}

export async function ProfitLossReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedOrganizationId(cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value);
  const companies = await listOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const fallbackFromDate = previous90DaysStartIso();
  const fallbackToDate = todayIso();

  if (!company) {
    return (
      <ProfitLossReport
        pageTitle="Profit & Loss"
        initialData={null}
        initialFromDate={fallbackFromDate}
        initialToDate={fallbackToDate}
        initialFinancialYears={[]}
        initialPeriods={[]}
        initialSelectedYearCode=""
        selectedCompanyId={null}
      />
    );
  }

  const today = todayIso();
  const allYears = await listFinancialYears(company.id);
  const yearsWithPostings = allYears.filter((year) => year.hasPostings);
  const currentYear = yearsWithPostings.find((year) => year.startDate <= today && today <= year.endDate);
  const selectedYear = currentYear
    ?? yearsWithPostings[0]
    ?? allYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? null;
  const defaultRange = selectedYear
    ? previous90DaysRange(selectedYear.startDate)
    : { fromDate: fallbackFromDate, toDate: fallbackToDate };
  const fromDate = query.fromDate ?? defaultRange.fromDate;
  const toDate = query.toDate ?? defaultRange.toDate;
  const periods = selectedYear ? await listPeriods(selectedYear.id) : [];
  const initialData = await getProfitLoss(company.id, fromDate, toDate);

  if (surface?.unframed) {
    return (
      <ProfitLossReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showAccountCode={query.showAccountCode === "true"}
        showCompanyHeader={query.showCompanyHeader === "true"}
        showCompanyFooter={query.showCompanyFooter === "true"}
        showReportingCategories={query.showReportingCategories === "true"}
        showDecimals={query.showDecimals === "true"}
      />
    );
  }

  return (
    <ProfitLossReport
      pageTitle="Profit & Loss"
      initialData={initialData}
      initialFromDate={fromDate}
      initialToDate={toDate}
      initialFinancialYears={yearsWithPostings}
      initialPeriods={periods}
      initialSelectedYearCode={selectedYear?.code ?? ""}
      selectedCompanyId={company.id}
    />
  );
}
