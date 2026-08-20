import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const FinancialDocumentDefaultKeyDto = StrictObject({
  documentCode: BusinessCode,
  code: BusinessCode,
});
export type FinancialDocumentDefaultKeyDto = Type.Static<typeof FinancialDocumentDefaultKeyDto>;

export const FinancialDocumentDefaultKeysRequestDto = StrictObject({
  keys: Type.Array(FinancialDocumentDefaultKeyDto, { minItems: 1, description: "Composite financial document default keys identifying the records to act on." }),
});
export type FinancialDocumentDefaultKeysRequestDto = Type.Static<typeof FinancialDocumentDefaultKeysRequestDto>;
