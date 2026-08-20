import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "@voyzu/core/types/constraints";

export const FinancialDocumentDefaultPatchRequestDto = StrictObject({
  glAccountId: Type.Optional(PositiveId),
  bankCashControlAccountId: Type.Optional(PositiveId),
}, { minProperties: 1 });
export type FinancialDocumentDefaultPatchRequestDto = Type.Static<typeof FinancialDocumentDefaultPatchRequestDto>;
