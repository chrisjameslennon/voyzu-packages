import "server-only";
import { getActiveProductMetrics } from "../../../products/server/lib/product.service";
import type { DashboardMetrics } from "../../types/dashboard.types";

// These modules have no prototype activity yet. Keep their metrics empty.
export function getDashboardMetrics(organizationId: number | null): DashboardMetrics {
  const now = new Date();
  const monthStart = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset, 1).getTime();
  const forPeriod = (since: number, until = now.getTime() + 1) => ({
    orders: { total: 0, change: 0 },
    topSellingItems: [],
    customers: { total: 0, change: 0 },
    purchases: { total: 0, change: 0 },
    products: organizationId === null ? { total: 0, change: 0 } : getActiveProductMetrics(organizationId, since, until),
    quotes: { total: 0, change: 0 },
  });
  return {
    month: forPeriod(monthStart(0)),
    previousMonth: forPeriod(monthStart(-1), monthStart(0)),
    previous2Months: forPeriod(monthStart(-2), monthStart(0)),
    previous3Months: forPeriod(monthStart(-3), monthStart(0)),
    previous6Months: forPeriod(monthStart(-6), monthStart(0)),
    previous90Days: forPeriod(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90).getTime()),
  };
}
