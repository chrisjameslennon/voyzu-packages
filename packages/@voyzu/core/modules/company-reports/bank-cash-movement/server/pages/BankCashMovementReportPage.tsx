import "server-only";

import { cookies } from "next/headers";

import { listCompanies } from "@voyzu/core/companies/server";
import {
  SELECTED_COMPANY_COOKIE,
  parseSelectedCompanyId,
} from "@voyzu/core/company-switcher/server";

import { BankCashMovementReport } from "../../client";
import { BankCashMovementReportTemplate } from "../../templates/BankCashMovementReportTemplate";
import { getBankCashMovement } from "../lib/bank-cash-movement.service";

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

function monthStartIso(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
}

export async function BankCashMovementReportPage({ surface }: ReportPageProps = {}) {
  const cookieStore = await cookies();
  const query = surface?.searchParams ?? {};
  const queryCompanyId = query.companyId ? Number(query.companyId) : null;
  const selectedCompanyId = queryCompanyId || parseSelectedCompanyId(cookieStore.get(SELECTED_COMPANY_COOKIE)?.value);
  const companies = await listCompanies();
  const company = companies.find((item) => item.id === selectedCompanyId) ?? companies[0] ?? null;
  const fromDate = query.fromDate ?? monthStartIso();
  const toDate = query.toDate ?? todayIso();

  if (!company) {
    return <BankCashMovementReport pageTitle="Bank / Cash Movement" initialData={null} initialFromDate={fromDate} initialToDate={toDate} selectedCompanyId={null} />;
  }

  const initialData = await getBankCashMovement(company.id, fromDate, toDate, null);
  if (surface?.unframed) {
    return <BankCashMovementReportTemplate data={initialData} generatedAt={new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }

  return <BankCashMovementReport pageTitle="Bank / Cash Movement" initialData={initialData} initialFromDate={fromDate} initialToDate={toDate} selectedCompanyId={company.id} />;
}
