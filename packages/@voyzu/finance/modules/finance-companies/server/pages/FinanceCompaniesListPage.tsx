import "server-only";

import { FinanceCompaniesList } from "../../client";
import { listFinanceCompanies } from "../lib/finance-company.service";

export async function FinanceCompaniesListPage() {
  return <FinanceCompaniesList initialCompanies={await listFinanceCompanies()} />;
}
