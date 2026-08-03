"use client";

import { ScopedAuditPanel, type ScopedAuditPanelProps } from "../../common/client/ScopedAuditPanel";

export function CompanyAuditPanel(props: ScopedAuditPanelProps) {
  return <ScopedAuditPanel {...props} backSource="companyAudit" />;
}
