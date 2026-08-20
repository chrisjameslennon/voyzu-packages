import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { Ledger, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, TrimmedText200, TrimmedText70 } from "@voyzu/core/types/constraints";

export const FinancialDocumentTypePatchRequestDto = StrictObject({
  code: Type.Optional(BusinessCode),
  name: Type.Optional(NonBlankText),
  description: Type.Optional(TrimmedText200),
  documentPurpose: Type.Optional(TrimmedText70),
  primarySupportingLedger: Type.Optional(Ledger),
  status: Type.Optional(Status),
}, { minProperties: 1 });
export type FinancialDocumentTypePatchRequestDto = Type.Static<typeof FinancialDocumentTypePatchRequestDto>;
