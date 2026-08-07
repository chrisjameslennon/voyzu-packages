import type { FinancialDocumentDefaultPatchRequestDto } from "./financial-document-default.patch.request.dto";

export interface FinancialDocumentDefaultBatchPatchRequestDto extends FinancialDocumentDefaultPatchRequestDto {
  /** Financial document processor code this default belongs to. */
  documentCode: string;
  /** Financial document default slot code. */
  code: string;
}
