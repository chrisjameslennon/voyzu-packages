export const dashboardPeriods = [
  { value: "month", label: "Month to date" },
  { value: "previousMonth", label: "Previous month" },
  { value: "previous2Months", label: "Previous 2 full months" },
  { value: "previous3Months", label: "Previous 3 full months" },
  { value: "previous6Months", label: "Previous 6 full months" },
  { value: "previous90Days", label: "Previous 90 days" },
] as const;
export type DashboardPeriod = typeof dashboardPeriods[number]["value"];
export type DashboardMetric = "orders" | "customers" | "purchases" | "products" | "quotes";
export interface MetricValue { total: number; change: number }
export interface TopSellingItem { id: number; name: string; unitsSold: number }
export type DashboardMetrics = Record<DashboardPeriod, Record<DashboardMetric, MetricValue> & { topSellingItems: TopSellingItem[] }>;
