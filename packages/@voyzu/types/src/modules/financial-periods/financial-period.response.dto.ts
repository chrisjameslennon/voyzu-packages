import type { AuditMetadataDto } from "../core";

export type FinancialPeriodStatus = "OPEN" | "CLOSED";

export interface FinancialPeriodResponseDto {
  /** Unique numeric identifier of the financial period. */
  id: number;
  /** The Financial Year this period belongs to. */
  financialYearId: number;
  /** The company this period belongs to. */
  companyId: number;
  /** Month abbreviation code e.g. "APR", "MAY". Unique within its Financial Year. */
  code: string;
  /** Display name of the period. */
  name: string;
  /** First day of the period (ISO date string, inclusive). */
  startDate: string;
  /** Last day of the period (ISO date string, inclusive). */
  endDate: string;
  /** Current lifecycle status of the period. */
  status: FinancialPeriodStatus;
  /** True when a posted journal has a posting date within this financial period. */
  hasPostings: boolean;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
