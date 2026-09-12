import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { Ledger, Status } from "../../common/types/index";
import { BusinessCode, NonBlankText, TrimmedText200, TrimmedText70 } from "../../common/types/constraints";

export const FinancialDocumentTypeUpdateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  description: TrimmedText200,
  documentPurpose: TrimmedText70,
  primarySupportingLedger: Ledger,
  status: Status,
});
export type FinancialDocumentTypeUpdateRequestDto = Type.Static<typeof FinancialDocumentTypeUpdateRequestDto>;
