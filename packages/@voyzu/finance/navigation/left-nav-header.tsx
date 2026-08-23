"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";
import { FinanceCompanySwitcher } from "@voyzu/finance/finance-companies/client";

export const leftNavHeaderRootPaths = ["/finance"] as const;

const financeTemplateDomainId = "voyzu.financeTemplate.page.landing";
const financeTemplatePath = "/finance";
const companyFinancePath = "/finance/journals";

export default function CoreLeftNavHeader({ domainId, isCollapsed }: VoyzuSurfaceLeftNavHeaderProps) {
  return (
    <FinanceCompanySwitcher
      companyPath={companyFinancePath}
      isCollapsed={isCollapsed}
      isTemplateMode={domainId === financeTemplateDomainId}
      templatePath={financeTemplatePath}
    />
  );
}
