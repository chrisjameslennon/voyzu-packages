import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listReportOrganizations } from "../../../organization-directory.repo";
import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";

import { BalanceSheetReport } from "../../client/index";
import { BalanceSheetReportTemplate } from "../../templates/BalanceSheetReportTemplate";
import {
  getBalanceSheet,
  listFinancialYearsWithPostings,
} from "../lib/balance-sheet.service";

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export async function BalanceSheetReportPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const queryCompanyId = context.queryParams.companyId ? Number(context.queryParams.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await internalApi.call("@core/organization-context", "get", {})).organization_id;
  const companies = await listReportOrganizations();
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

  if (context.routeDefinition.unframed) {
    return (
      <BalanceSheetReportTemplate
        data={initialData}
        generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        showCompanyHeader={context.queryParams.showCompanyHeader !== false}
        showCompanyFooter={context.queryParams.showCompanyFooter !== false}
        showAccountCode={context.queryParams.showAccountCode !== false}
        showReportingCategories={context.queryParams.showReportingCategories === true}
        showDecimals={context.queryParams.showDecimals !== false}
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
