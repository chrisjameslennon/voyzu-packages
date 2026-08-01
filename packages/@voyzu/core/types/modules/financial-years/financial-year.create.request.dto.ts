import type { FinancialYearStatus } from "./financial-year.response.dto";

export interface FinancialYearCreateRequestDto {
  /** Business code for the new financial year (up to 14 characters, uppercase letters, numbers, dash, underscore). */
  code: string;
  /** Display name for the financial year. Defaults to "Financial Year YYYY" when omitted. */
  name?: string;
  /** First day of the financial year (ISO date string, YYYY-MM-DD). */
  startDate: string;
  /** Last day of the financial year (ISO date string, YYYY-MM-DD). */
  endDate: string;
  /**
   * Initial status. Use OPEN for active years created via the UI.
   * INACTIVE and PLANNED are reserved for the seed process.
   */
  status: FinancialYearStatus;
}
