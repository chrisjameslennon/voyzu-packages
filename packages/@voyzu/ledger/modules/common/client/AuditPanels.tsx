"use client";

import { ScopedAuditPanel, type ScopedAuditPanelProps } from "./ScopedAuditPanel";

export function CompanyAuditPanel(props: ScopedAuditPanelProps) {
  return <ScopedAuditPanel {...props} />;
}

export function OrganizationAuditPanel(props: ScopedAuditPanelProps) {
  return <ScopedAuditPanel {...props} />;
}
