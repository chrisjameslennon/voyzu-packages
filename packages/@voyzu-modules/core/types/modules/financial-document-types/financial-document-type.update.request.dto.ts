import type { Ledger, Status } from "@voyzu/types/modules/core";

export interface FinancialDocumentTypeUpdateRequestDto {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
  status: Status;
}
