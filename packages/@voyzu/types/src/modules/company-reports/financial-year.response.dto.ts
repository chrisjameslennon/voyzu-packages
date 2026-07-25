import type { AuditMetadataDto } from "../core";

export type FinancialYearStatus = "INACTIVE" | "PLANNED" | "OPEN" | "CLOSED";

export interface FinancialYearResponseDto {
  id: number;
  code: string;
  name: string;
  companyId: number;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  hasPostings: boolean;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
