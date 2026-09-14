import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listReportOrganizations } from "../../../organization-directory.repo";
import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";

import { TaxPositionReport } from "../../client/index";
import { TaxPositionReportTemplate } from "../../templates/TaxPositionReportTemplate";
import { getTaxPosition } from "../lib/tax-position.service";

function todayIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export async function TaxPositionReportPage({ context }: PageProps) {
  const query = pageStringParameters(context.queryParams);
  const queryCompanyId = context.queryParams.companyId ? Number(context.queryParams.companyId) : null;
  const selectedCompanyId = queryCompanyId || (await internalApi.call("@core/organization-context", "get", {})).organization_id;
  const companies = await listReportOrganizations();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const today = query.asAtDate ?? todayIso();

  if (!company) {
    return <TaxPositionReport pageTitle="Tax Position" initialData={null} initialAsAtDate={today} selectedCompanyId={null} />;
  }

  const initialData = await getTaxPosition(company.id, today);
  if (context.routeDefinition.unframed) {
    return <TaxPositionReportTemplate data={initialData} generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }

  return <TaxPositionReport pageTitle="Tax Position" initialData={initialData} initialAsAtDate={today} selectedCompanyId={company.id} />;
}
