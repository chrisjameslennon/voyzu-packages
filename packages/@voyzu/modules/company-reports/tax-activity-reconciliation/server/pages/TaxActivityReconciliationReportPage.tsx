import "server-only";

import { cookies } from "next/headers";

import type { CompanyResponseDto } from "@voyzu/types/modules/companies";
import type { FinancialYearResponseDto } from "@voyzu/types/modules/financial-years";

import { listCompanies } from "@voyzu/modules/companies/server";
import {
  SELECTED_COMPANY_COOKIE,
  parseSelectedCompanyId,
} from "@voyzu/modules/company-switcher/server";
import { listFinancialYears } from "@voyzu/modules/financial-years/server";

import { TaxActivityReconciliationReport } from "../../client";
import { TaxActivityReconciliationReportTemplate } from "../../templates/TaxActivityReconciliationReportTemplate";
import { getTaxActivityReconciliation } from "../lib/tax-activity-reconciliation.service";

interface ReportPageProps {
  surface?: {
    searchParams?: Record<string, string>;
    unframed?: boolean;
  };
}

interface FilingPeriod {
  value: string;
  label: string;
  startDate: string;
  endDate: string;
}

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function parseIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function iso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthName(month: number): string {
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(2026, month - 1, 1));
}

function deriveFilingPeriods(
  company: Pick<CompanyResponseDto, "taxFilingAnchorMonth" | "taxFilingIntervalMonths">,
  year: FinancialYearResponseDto | undefined,
): FilingPeriod[] {
  if (!year) return [];
  const start = parseIso(year.startDate);
  const end = parseIso(year.endDate);
  const anchor = company.taxFilingAnchorMonth;
  const interval = company.taxFilingIntervalMonths;
  const periods: FilingPeriod[] = [];

  let cursor = new Date(start.getFullYear() - 1, 0, 1);
  const limit = new Date(end.getFullYear() + 1, 11, 31);

  while (cursor <= limit) {
    const month = cursor.getMonth() + 1;
    const monthsFromAnchor = (month - anchor + 12) % interval;
    if (monthsFromAnchor === 0) {
      const periodEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      const periodStart = new Date(cursor.getFullYear(), cursor.getMonth() - interval + 1, 1);
      if (periodEnd >= start && periodStart <= end) {
        const clampedStart = periodStart < start ? start : periodStart;
        const clampedEnd = periodEnd > end ? end : periodEnd;
        const label = `${monthName(clampedStart.getMonth() + 1)} ${clampedStart.getFullYear()} - ${monthName(clampedEnd.getMonth() + 1)} ${clampedEnd.getFullYear()}`;
        periods.push({
          value: `${iso(clampedStart)}:${iso(clampedEnd)}`,
          label,
          startDate: iso(clampedStart),
          endDate: iso(clampedEnd),
        });
      }
    }
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return periods;
}

export async function TaxActivityReconciliationReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedCompanyId(cookieStore.get(SELECTED_COMPANY_COOKIE)?.value);
  const companies = await listCompanies();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;

  if (!company) {
    return (
      <TaxActivityReconciliationReport
        pageTitle="Tax Reconciliation"
        initialData={null}
        initialFinancialYears={[]}
        initialSelectedYearCode=""
        initialSelectedPeriodValue=""
        organizationName=""
        selectedCompany={null}
      />
    );
  }

  const today = todayIso();
  const allYears = await listFinancialYears(company.id);
  const yearsWithPostings = allYears.filter((year) => year.hasPostings);
  const selectedYear = yearsWithPostings.find((year) => year.startDate <= today && today <= year.endDate)
    ?? yearsWithPostings[0]
    ?? allYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? undefined;
  const filingPeriods = deriveFilingPeriods(company, selectedYear);
  const defaultPeriod = filingPeriods.find((period) => period.startDate <= today && today <= period.endDate)
    ?? filingPeriods[0]
    ?? null;
  const selectedPeriod = query.periodStartDate && query.periodEndDate
    ? {
        value: `${query.periodStartDate}:${query.periodEndDate}`,
        label: query.periodLabel ?? `${query.periodStartDate} - ${query.periodEndDate}`,
        startDate: query.periodStartDate,
        endDate: query.periodEndDate,
      }
    : defaultPeriod;
  const initialData = selectedPeriod
    ? await getTaxActivityReconciliation(company.id, selectedPeriod.startDate, selectedPeriod.endDate, selectedPeriod.label, query.taxAuthorityCode ?? null)
    : null;

  if (surface?.unframed && initialData) {
    return (
      <TaxActivityReconciliationReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        organizationName=""
        showOrganization={query.showOrganization === "true"}
        showCompanyHeader={query.showCompanyHeader === "true"}
        showCompanyFooter={query.showCompanyFooter === "true"}
        showDecimals={query.showDecimals === "true"}
      />
    );
  }

  return (
    <TaxActivityReconciliationReport
      pageTitle="Tax Reconciliation"
      initialData={initialData}
      initialFinancialYears={yearsWithPostings}
      initialSelectedYearCode={selectedYear?.code ?? ""}
      initialSelectedPeriodValue={selectedPeriod?.value ?? ""}
      organizationName=""
      selectedCompany={{
        id: company.id,
        taxFilingAnchorMonth: company.taxFilingAnchorMonth,
        taxFilingIntervalMonths: company.taxFilingIntervalMonths,
      }}
    />
  );
}
