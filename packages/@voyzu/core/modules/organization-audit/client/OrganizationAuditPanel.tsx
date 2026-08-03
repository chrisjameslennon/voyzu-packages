"use client";

import { ScopedAuditPanel, type ScopedAuditPanelProps } from "../../common/client/ScopedAuditPanel";

export function OrganizationAuditPanel(props: ScopedAuditPanelProps) {
  return <ScopedAuditPanel {...props} backSource="organizationAudit" />;
}
