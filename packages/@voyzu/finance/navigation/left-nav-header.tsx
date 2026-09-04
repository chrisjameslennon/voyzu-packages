"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";
import { FinanceCompanySwitcher } from "@voyzu/finance/finance-companies/client";

export const leftNavHeaderRootPaths = ["/finance"] as const;

const companyFinancePath = "/finance/journals";

export default function CoreLeftNavHeader({ isCollapsed }: VoyzuSurfaceLeftNavHeaderProps) {
  return (
    <FinanceCompanySwitcher
      companyPath={companyFinancePath}
      isCollapsed={isCollapsed}
    />
  );
}
