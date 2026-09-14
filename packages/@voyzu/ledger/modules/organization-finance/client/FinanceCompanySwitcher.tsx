"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/ui-business-components";

export function FinanceCompanySwitcher({ isCollapsed, companyPath = "/ledger/journals" }: { isCollapsed: boolean; companyPath?: string; }) {
  const router = useRouter();
  const pathname = usePathname();
  return <OrganizationSwitcher
    isCollapsed={isCollapsed}
    allCompanies={pathname === "/ledger/global-settings" || pathname.startsWith("/ledger/global-settings/")}
    selectionUrl="/api/ledger/company-selection"
    onSelected={() => {
      router.push(companyPath);
      router.refresh();
    }}
  />;
}
