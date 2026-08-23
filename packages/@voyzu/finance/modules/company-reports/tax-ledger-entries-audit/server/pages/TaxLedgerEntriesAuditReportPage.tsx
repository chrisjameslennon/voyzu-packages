import "server-only";

import { cookies } from "next/headers";

import { listOrganizations } from "@voyzu/erp-core/organizations/server";
import {
  SELECTED_ORGANIZATION_COOKIE,
  parseSelectedOrganizationId,
} from "@voyzu/erp-core/organization-switcher/server";
import { listFinancialYears } from "@voyzu/finance/financial-years/server";
import { listPeriods } from "@voyzu/finance/financial-years/server";

import { TaxLedgerEntriesAuditReport } from "../../client";
import { TaxLedgerEntriesAuditReportTemplate } from "../../templates/TaxLedgerEntriesAuditReportTemplate";
import { getTaxLedgerEntriesAudit } from "../lib/tax-ledger-entries-audit.service";

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

function previous90DaysRange(fiscalYearStartDate?: string): { fromDate: string; toDate: string } {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
  const fromDate = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;
  const toDate = todayIso();
  return { fromDate: fiscalYearStartDate && fromDate < fiscalYearStartDate ? fiscalYearStartDate : fromDate, toDate };
}

export async function TaxLedgerEntriesAuditReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedOrganizationId(cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value);
  const companies = await listOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const fallback = previous90DaysRange();

  if (!company) {
    return (
      <TaxLedgerEntriesAuditReport
        pageTitle="Tax Ledger Entries"
        initialData={null}
        initialFromDate={fallback.fromDate}
        initialToDate={fallback.toDate}
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
  const selectedYear = yearsWithPostings.find((year) => year.startDate <= today && today <= year.endDate)
    ?? yearsWithPostings[0]
    ?? allYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? null;
  const defaultRange = previous90DaysRange(selectedYear?.startDate);
  const fromDate = query.fromDate ?? defaultRange.fromDate;
  const toDate = query.toDate ?? defaultRange.toDate;
  const periods = selectedYear ? await listPeriods(selectedYear.id) : [];
  const initialData = await getTaxLedgerEntriesAudit(company.id, fromDate, toDate);

  if (surface?.unframed) {
    return (
      <TaxLedgerEntriesAuditReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showSnapshotData={query.showSnapshotData === "true"}
      />
    );
  }

  return (
    <TaxLedgerEntriesAuditReport
      pageTitle="Tax Ledger Entries"
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
