import type { Ledger } from "@voyzu/types/modules/core";

export interface FinancialDocumentTypeCreateRequestDto {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
}
