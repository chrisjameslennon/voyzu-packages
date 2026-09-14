"use client";

import type { UiSurfaceHeaderProps } from "@voyzu/types/ui-surface";
import { FinanceCompanySwitcher } from "../modules/organization-finance/client/index";


const companyFinancePath = "/finance/journals";

export default function CoreLeftNavHeader({ presentation }: UiSurfaceHeaderProps) {
  return (
    <FinanceCompanySwitcher
      companyPath={companyFinancePath}
      isCollapsed={presentation === "collapsed"}
    />
  );
}
