import type { Ledger, Status } from "@voyzu-modules/core/types/modules/core";

export interface FinancialDocumentTypeUpdateRequestDto {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
  status: Status;
}
