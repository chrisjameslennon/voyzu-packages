import type { Ledger } from "@voyzu/core/types/modules/core";

export interface FinancialDocumentTypeCreateRequestDto {
  code: string;
  name: string;
  description: string;
  documentPurpose: string;
  primarySupportingLedger: Ledger;
}
