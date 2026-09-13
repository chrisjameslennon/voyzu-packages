"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";
import { FinanceCompanySwitcher } from "../modules/organization-finance/client/index";

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
