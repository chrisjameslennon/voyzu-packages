import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { Ledger, Status } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, TrimmedText200, TrimmedText70 } from "@voyzu/finance/types/constraints";

export const FinancialDocumentTypeUpdateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  description: TrimmedText200,
  documentPurpose: TrimmedText70,
  primarySupportingLedger: Ledger,
  status: Status,
});
export type FinancialDocumentTypeUpdateRequestDto = Type.Static<typeof FinancialDocumentTypeUpdateRequestDto>;
