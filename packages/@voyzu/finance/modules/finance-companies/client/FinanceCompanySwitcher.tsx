"use client";

import { useRouter } from "next/navigation";
import { clientComponent } from "@voyzu/ui-surface/client";

const OrganizationSwitcher = clientComponent.use("erp.organization-switcher");

export function FinanceCompanySwitcher({ isCollapsed, companyPath = "/finance/journals" }: { isCollapsed: boolean; companyPath?: string; }) {
  const router = useRouter();
  return <OrganizationSwitcher
    isCollapsed={isCollapsed}
    selectionUrl="/api/finance/company-selection"
    onSelected={() => {
      router.push(companyPath);
      router.refresh();
    }}
  />;
}
