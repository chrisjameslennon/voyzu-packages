import "server-only";

import {
  OrganizationAuditEventDetailPage,
  OrganizationAuditEventsPage,
} from "@voyzu-modules/core/organization-audit/server";

export async function IceCreamAuditEventsPage({
  surface,
}: {
  surface?: { searchParams?: Record<string, string> };
} = {}) {
  return OrganizationAuditEventsPage({
    surface: {
      searchParams: {
        entityType: "ice_cream",
        ...(surface?.searchParams ?? {}),
      },
    },
  });
}

export async function IceCreamAuditEventDetailPage(props: Record<string, unknown>) {
  return OrganizationAuditEventDetailPage(props);
}
