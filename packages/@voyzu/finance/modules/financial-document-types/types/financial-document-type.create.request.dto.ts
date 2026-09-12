import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { Ledger } from "../../common/types/index";
import { BusinessCode, NonBlankText, TrimmedText200, TrimmedText70 } from "../../common/types/constraints";

export const FinancialDocumentTypeCreateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  description: TrimmedText200,
  documentPurpose: TrimmedText70,
  primarySupportingLedger: Ledger,
});
export type FinancialDocumentTypeCreateRequestDto = Type.Static<typeof FinancialDocumentTypeCreateRequestDto>;
