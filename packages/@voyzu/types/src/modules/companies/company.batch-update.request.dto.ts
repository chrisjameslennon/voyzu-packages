import type { CompanyUpdateRequestDto } from "./company.update.request.dto";

export interface CompanyBatchUpdateRequestDto extends CompanyUpdateRequestDto {
  /** Company business code identifying the company to update. */
  code: string;
}
