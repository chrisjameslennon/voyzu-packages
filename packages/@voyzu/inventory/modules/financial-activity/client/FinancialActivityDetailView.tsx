"use client";

import type { StockActivityDetail } from "../../stock/types/stock.types";
import type { StockCountOrganization } from "../../stock/client/StockCountReportTemplate";
import { StockTransactionDetailView } from "../../stock/client/StockTransactionDetailView";

export function FinancialActivityDetailView({
  record,
  organization,
  financialActivityId,
}: {
  record: StockActivityDetail;
  organization: StockCountOrganization;
  financialActivityId: number;
}) {
  return (
    <StockTransactionDetailView
      record={record}
      organization={organization}
      backHref="/inventory/financial-activity"
      printablePath={`/inventory/financial-activity/${financialActivityId}/printable`}
    />
  );
}
