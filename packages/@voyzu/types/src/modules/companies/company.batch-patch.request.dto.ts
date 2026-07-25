import type { CompanyPatchRequestDto } from "./company.patch.request.dto";

export interface CompanyBatchPatchRequestDto extends CompanyPatchRequestDto {
  /** Company business code identifying the company to patch. */
  code: string;
}
