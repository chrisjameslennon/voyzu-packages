import "server-only";

import { listArSubledgerEntries } from "@voyzu-modules/all-modules/ar-subledger-ledger-entries/server";
import { listFinancialYears, listPeriods } from "@voyzu-modules/all-modules/financial-years/server";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";

import { ArLedgerEntryEnquiry } from "../../client/ArLedgerEntryEnquiry";

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

export async function ArLedgerEntryEnquiryListPage() {
  const company = await getSelectedCompany();
  if (!company) {
    const range = previous90DaysRange();
    return <ArLedgerEntryEnquiry entries={[]} financialYears={[]} periods={[]} selectedYearCode="" {...range} />;
  }

  const [entries, allYears] = await Promise.all([
    listArSubledgerEntries(company.id),
    listFinancialYears(company.id),
  ]);
  const financialYears = allYears.filter((year) => year.hasPostings);
  const today = toIso(new Date());
  const selectedYear = financialYears.find((year) => year.startDate <= today && today <= year.endDate)
    ?? financialYears[0];
  const periods = selectedYear ? await listPeriods(selectedYear.id) : [];
  const range = previous90DaysRange(selectedYear?.startDate, selectedYear?.endDate);

  return (
    <ArLedgerEntryEnquiry
      entries={entries}
      financialYears={financialYears}
      periods={periods}
      selectedYearCode={selectedYear?.code ?? ""}
      {...range}
    />
  );
}
