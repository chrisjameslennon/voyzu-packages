import "server-only";
import { internalApi } from "@voyzu/capability/internal-api";
import { Dashboard } from "../../client/Dashboard";
import { getDashboardMetrics } from "../lib/dashboard.service";

export async function DashboardPage() {
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  return <Dashboard
    key={selectedOrganization?.organization_id ?? "none"}
    hasOrganization={Boolean(selectedOrganization)}
    metrics={getDashboardMetrics(selectedOrganization?.organization_id ?? null)}
  />;
}
