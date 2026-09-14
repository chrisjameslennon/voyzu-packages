import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listReportOrganizations } from "../../../organization-directory.repo";
import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";
import { listFinancialYears } from "../../../../financial-years/server/index";
import { listPeriods } from "../../../../financial-years/server/index";

import { FinancialIntegrityReport } from "../../client/index";
import { FinancialIntegrityReportTemplate } from "../../templates/FinancialIntegrityReportTemplate";
import { getFinancialIntegrity } from "../lib/financial-integrity.service";

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
  return {
    fromDate: fiscalYearStartDate && fromDate < fiscalYearStartDate ? fiscalYearStartDate : fromDate,
    toDate,
  };
}

export async function FinancialIntegrityReportPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const queryCompanyId = context.queryParams.companyId ? Number(context.queryParams.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await internalApi.call("@core/organization-context", "get", {})).organization_id;
  const companies = await listReportOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const fallbackFromDate = previous90DaysStartIso();
  const fallbackToDate = todayIso();

  if (!company) {
    return (
      <FinancialIntegrityReport
        pageTitle="Financial Integrity"
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
  const documentTypeCode = query.documentTypeCode ?? undefined;
  const initialData = await getFinancialIntegrity(company.id, fromDate, toDate, documentTypeCode);

  if (context.routeDefinition.unframed) {
    return (
      <FinancialIntegrityReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showSubledgerEntries={context.queryParams.showSubledgerEntries === true}
        showSourceDocument={context.queryParams.showSourceDocument === true}
      />
    );
  }

  return (
    <FinancialIntegrityReport
      pageTitle="Financial Integrity"
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
