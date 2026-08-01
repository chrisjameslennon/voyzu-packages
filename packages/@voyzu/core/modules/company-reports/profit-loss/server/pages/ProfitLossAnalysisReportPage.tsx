import "server-only";

import { cookies } from "next/headers";

import type { ProfitLossBreakdownDto, ProfitLossDimensionSelectionDto } from "@voyzu/core/types/modules/company-reports";

import { listCompanies } from "@voyzu/core/companies/server";
import {
  SELECTED_COMPANY_COOKIE,
  parseSelectedCompanyId,
} from "@voyzu/core/company-switcher/server";
import { listDimensions } from "@voyzu/core/common/dimensions/server";
import { listFinancialYears } from "@voyzu/core/financial-years/server";
import { listPeriods } from "@voyzu/core/financial-years/server";

import { ProfitLossAnalysisReport } from "../../client";
import { ProfitLossAnalysisReportTemplate } from "../../templates/ProfitLossAnalysisReportTemplate";
import { getProfitLossAnalysis } from "../lib/profit-loss.service";

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

function parseJsonParam<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function ProfitLossAnalysisReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedCompanyId(cookieStore.get(SELECTED_COMPANY_COOKIE)?.value);
  const companies = await listCompanies();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const fallbackFromDate = previous90DaysStartIso();
  const fallbackToDate = todayIso();

  if (!company) {
    return (
      <ProfitLossAnalysisReport
        pageTitle="Profit & Loss Analysis"
        initialData={null}
        initialFromDate={fallbackFromDate}
        initialToDate={fallbackToDate}
        initialFinancialYears={[]}
        initialPeriods={[]}
        initialSelectedYearCode=""
        dimensions={[]}
        organizationName=""
        selectedCompanyId={null}
      />
    );
  }

  const dimensions = await listDimensions(company.id);
  const today = todayIso();
  const allYears = await listFinancialYears(company.id);
  const yearsWithPostings = allYears.filter((year) => year.hasPostings);
  const currentYear = yearsWithPostings.find((year) => year.startDate <= today && today <= year.endDate);
  const selectedYear = currentYear
    ?? yearsWithPostings[0]
    ?? allYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? null;
  const { fromDate, toDate } = selectedYear
    ? previous90DaysRange(selectedYear.startDate)
    : { fromDate: fallbackFromDate, toDate: fallbackToDate };
  const reportFromDate = query.fromDate ?? fromDate;
  const reportToDate = query.toDate ?? toDate;
  const dimensionFilters = parseJsonParam<ProfitLossDimensionSelectionDto[]>(query.dimensionFilters, []);
  const breakdown = parseJsonParam<ProfitLossBreakdownDto | null>(query.breakdown, null);
  const periods = selectedYear ? await listPeriods(selectedYear.id) : [];
  const initialData = await getProfitLossAnalysis(company.id, reportFromDate, reportToDate, dimensionFilters, breakdown);

  if (surface?.unframed) {
    return (
      <ProfitLossAnalysisReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        organizationName=""
        showAccountCode={query.showAccountCode === "true"}
        showOrganization={query.showOrganization === "true"}
        showCompanyHeader={query.showCompanyHeader === "true"}
        showCompanyFooter={query.showCompanyFooter === "true"}
        showDecimals={query.showDecimals === "true"}
      />
    );
  }

  return (
    <ProfitLossAnalysisReport
      pageTitle="Profit & Loss Analysis"
      initialData={initialData}
      initialFromDate={reportFromDate}
      initialToDate={reportToDate}
      initialFinancialYears={yearsWithPostings}
      initialPeriods={periods}
      initialSelectedYearCode={selectedYear?.code ?? ""}
      dimensions={dimensions}
      organizationName=""
      selectedCompanyId={company.id}
    />
  );
}
