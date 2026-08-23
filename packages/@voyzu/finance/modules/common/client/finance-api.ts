"use client";

import type { OrganizationSelectionResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";

let selectedFinanceBasePromise: Promise<string> | null = null;

async function selectedFinanceBase(): Promise<string> {
  if (!selectedFinanceBasePromise) {
    selectedFinanceBasePromise = fetch("/api/finance/company-selection", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load selected company");
        const selection = await response.json() as OrganizationSelectionResponseDto;
        const company = selection.selectedOrganization
          ?? selection.organizations.find((item) => item.id === selection.selectedOrganizationId)
          ?? selection.organizations[0];
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
