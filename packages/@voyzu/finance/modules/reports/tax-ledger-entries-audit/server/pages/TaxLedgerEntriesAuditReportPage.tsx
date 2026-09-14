import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listReportOrganizations } from "../../../organization-directory.repo";
import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";
import { listFinancialYears } from "../../../../financial-years/server/index";
import { listPeriods } from "../../../../financial-years/server/index";

import { TaxLedgerEntriesAuditReport } from "../../client/index";
import { TaxLedgerEntriesAuditReportTemplate } from "../../templates/TaxLedgerEntriesAuditReportTemplate";
import { getTaxLedgerEntriesAudit } from "../lib/tax-ledger-entries-audit.service";

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

export async function TaxLedgerEntriesAuditReportPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const queryCompanyId = context.queryParams.companyId ? Number(context.queryParams.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await internalApi.call("@core/organization-context", "get", {})).organization_id;
  const companies = await listReportOrganizations();
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

  if (context.routeDefinition.unframed) {
    return (
      <TaxLedgerEntriesAuditReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showSnapshotData={context.queryParams.showSnapshotData === true}
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
