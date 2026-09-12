import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "../../common/types/index";
import {
  FinancialDocumentDefaultOverrideScope,
  FinancialDocumentDefaultTargetType,
} from "./financial-document-default.response.dto";
import { BusinessCode, NonBlankText, PositiveId } from "../../common/types/constraints";

export const FinancialDocumentDefaultCreateRequestDto = StrictObject({
  documentCode: BusinessCode,
  code: BusinessCode,
  name: NonBlankText,
  targetType: FinancialDocumentDefaultTargetType,
  allowedAccountTypes: Type.Array(AccountType, { minItems: 1 }),
  overridePropertyName: NonBlankText,
  overrideScope: FinancialDocumentDefaultOverrideScope,
  glAccountId: Type.Optional(PositiveId),
  bankCashControlAccountId: Type.Optional(PositiveId),
});
export type FinancialDocumentDefaultCreateRequestDto = Type.Static<typeof FinancialDocumentDefaultCreateRequestDto>;
