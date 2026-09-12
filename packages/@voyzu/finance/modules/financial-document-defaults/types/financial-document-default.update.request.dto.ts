import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "../../common/types/constraints";

export const FinancialDocumentDefaultUpdateRequestDto = StrictObject({
  glAccountId: Type.Optional(PositiveId),
  bankCashControlAccountId: Type.Optional(PositiveId),
});
export type FinancialDocumentDefaultUpdateRequestDto = Type.Static<typeof FinancialDocumentDefaultUpdateRequestDto>;
