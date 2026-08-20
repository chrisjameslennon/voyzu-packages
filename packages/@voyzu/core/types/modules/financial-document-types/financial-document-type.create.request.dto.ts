import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { Ledger } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, TrimmedText200, TrimmedText70 } from "@voyzu/core/types/constraints";

export const FinancialDocumentTypeCreateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  description: TrimmedText200,
  documentPurpose: TrimmedText70,
  primarySupportingLedger: Ledger,
});
export type FinancialDocumentTypeCreateRequestDto = Type.Static<typeof FinancialDocumentTypeCreateRequestDto>;
