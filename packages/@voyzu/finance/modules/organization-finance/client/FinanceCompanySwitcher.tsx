"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/erp-core/exports/components";

export function FinanceCompanySwitcher({ isCollapsed, companyPath = "/finance/journals" }: { isCollapsed: boolean; companyPath?: string; }) {
  const router = useRouter();
  const pathname = usePathname();
  return <OrganizationSwitcher
    isCollapsed={isCollapsed}
    allCompanies={pathname === "/finance/global-settings" || pathname.startsWith("/finance/global-settings/")}
    selectionUrl="/api/finance/company-selection"
    onSelected={() => {
      router.push(companyPath);
      router.refresh();
    }}
  />;
}
