import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";

export type FinancialYearStatus = "INACTIVE" | "PLANNED" | "OPEN" | "CLOSED";

export interface FinancialYearResponseDto {
  /** Unique numeric identifier of the financial year. */
  id: number;
  /** Business code of the financial year (up to 14 characters). */
  code: string;
  /** Display name of the financial year. */
  name: string;
  /** The company this financial year belongs to. */
  companyId: number;
  /** First day of the financial year (ISO date string, inclusive). */
  startDate: string;
  /** Last day of the financial year (ISO date string, inclusive). */
  endDate: string;
  /** Current lifecycle status of the financial year. */
  status: FinancialYearStatus;
  /** True when a posted journal has a posting date within this financial year. */
  hasPostings: boolean;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
