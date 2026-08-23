import "server-only";

import { notFound } from "next/navigation";
import { FinanceCompanyDetail } from "../../client";
import { getFinanceCompany } from "../lib/finance-company.service";

export async function FinanceCompanyDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const company = await getFinanceCompany(decodeURIComponent(code));
  if (!company) notFound();
  return <FinanceCompanyDetail company={company} />;
}
