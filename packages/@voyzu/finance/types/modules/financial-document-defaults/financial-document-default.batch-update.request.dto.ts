import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { FinancialDocumentDefaultUpdateRequestDto } from "./financial-document-default.update.request.dto";
import { BusinessCode } from "@voyzu/finance/types/constraints";

export const FinancialDocumentDefaultBatchUpdateRequestDto = StrictObject({
  ...FinancialDocumentDefaultUpdateRequestDto.properties,
  documentCode: BusinessCode,
  code: BusinessCode,
});
export type FinancialDocumentDefaultBatchUpdateRequestDto = Type.Static<typeof FinancialDocumentDefaultBatchUpdateRequestDto>;
