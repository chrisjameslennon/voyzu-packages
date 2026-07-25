export interface FinancialYearPatchRequestDto {
  /** Updated business code (up to 14 characters). Locked once the year has postings. */
  code?: string;
  /** Updated display name. */
  name?: string;
  /** Updated start date (ISO date string, YYYY-MM-DD). Locked once financial periods exist. */
  startDate?: string;
  /** Updated end date (ISO date string, YYYY-MM-DD). Locked once financial periods exist. */
  endDate?: string;
}
