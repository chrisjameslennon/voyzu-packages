import type { FinancialDocumentDefaultUpdateRequestDto } from "./financial-document-default.update.request.dto";

export interface FinancialDocumentDefaultBatchUpdateRequestDto extends FinancialDocumentDefaultUpdateRequestDto {
  /** Financial document processor code this default belongs to. */
  documentCode: string;
  /** Financial document default slot code. */
  code: string;
}
