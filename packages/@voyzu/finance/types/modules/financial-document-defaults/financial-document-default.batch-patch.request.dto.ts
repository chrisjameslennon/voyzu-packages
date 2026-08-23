import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { FinancialDocumentDefaultPatchRequestDto } from "./financial-document-default.patch.request.dto";
import { BusinessCode } from "@voyzu/finance/types/constraints";

export const FinancialDocumentDefaultBatchPatchRequestDto = StrictObject({
  ...FinancialDocumentDefaultPatchRequestDto.properties,
  documentCode: BusinessCode,
  code: BusinessCode,
});
export type FinancialDocumentDefaultBatchPatchRequestDto = Type.Static<typeof FinancialDocumentDefaultBatchPatchRequestDto>;
