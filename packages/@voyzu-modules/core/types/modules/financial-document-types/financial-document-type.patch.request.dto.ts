import type { Ledger, Status } from "@voyzu-modules/core/types/modules/core";

export interface FinancialDocumentTypePatchRequestDto {
  code?: string;
  name?: string;
  description?: string;
  documentPurpose?: string;
  primarySupportingLedger?: Ledger;
  status?: Status;
}
