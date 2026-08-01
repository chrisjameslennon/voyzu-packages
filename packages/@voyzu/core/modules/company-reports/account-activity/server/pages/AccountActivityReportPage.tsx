import "server-only";

import { listFinancialYears, listPeriods } from "@voyzu/core/financial-years/server";
import { getSelectedCompany, listJournalsWithLines } from "@voyzu/core/journals/server";

import { AccountActivity } from "../../client/AccountActivity";

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function previous90DaysRange(financialYearStart?: string, financialYearEnd?: string) {
  const today = new Date();
  const fromDate = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
  const toDate = toIso(today);
  return {
    fromDate: financialYearStart && fromDate < financialYearStart ? financialYearStart : fromDate,
    toDate: financialYearEnd && toDate > financialYearEnd ? financialYearEnd : toDate,
  };
}

export async function AccountActivityReportPage() {
  const company = await getSelectedCompany();
  if (!company) {
    const range = previous90DaysRange();
    return <AccountActivity journals={[]} financialYears={[]} periods={[]} selectedYearCode="" {...range} />;
  }

  const [journals, allYears] = await Promise.all([
    listJournalsWithLines(company.id),
    listFinancialYears(company.id),
  ]);
  const financialYears = allYears.filter((year) => year.hasPostings);
  const today = toIso(new Date());
  const selectedYear = financialYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? financialYears[0];
  const periods = selectedYear ? await listPeriods(selectedYear.id) : [];
  const range = previous90DaysRange(selectedYear?.startDate, selectedYear?.endDate);

  return (
    <AccountActivity
      journals={journals}
      financialYears={financialYears}
      periods={periods}
      selectedYearCode={selectedYear?.code ?? ""}
      {...range}
    />
  );
}
