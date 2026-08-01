"use client";

import type { CompanySelectionResponseDto } from "@voyzu/core/types/modules/company-switcher";

let selectedFinanceBasePromise: Promise<string> | null = null;

async function selectedFinanceBase(): Promise<string> {
  if (!selectedFinanceBasePromise) {
    selectedFinanceBasePromise = fetch("/api/company-selection", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load selected company");
        const selection = await response.json() as CompanySelectionResponseDto;
        const company = selection.selectedCompany
          ?? selection.companies.find((item) => item.id === selection.selectedCompanyId)
          ?? selection.companies[0];
        if (!company?.code) throw new Error("No selected company is available");
        return `/api/finance/${encodeURIComponent(company.code)}`;
      });
  }
  return selectedFinanceBasePromise;
}

export async function financeApiUrl(path: string): Promise<string> {
  const base = await selectedFinanceBase();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
