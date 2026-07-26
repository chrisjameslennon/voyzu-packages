export interface CompanyCreateRequestDto {
  /** Stable company code. */
  code: string;
  /** Company display name. */
  name: string;
  /** Country code for localization and tax setup. */
  countryCode: string;
  /** Base currency code used for company reporting. */
  baseCurrencyCode: string;
  /** Optional tax filing anchor month. */
  taxFilingAnchorMonth?: number;
  /** Optional tax filing interval in months. */
  taxFilingIntervalMonths?: 1 | 2 | 3 | 6 | 12;
  /** Whether this company inherits organization standard settings. */
  useOrganizationStandardSettings?: boolean;
  /** First line used on generated reports. */
  reportLine1?: string;
  /** Second line used on generated reports. */
  reportLine2?: string;
  /** Footer text used on generated reports. */
  reportFooter?: string;
}
