export interface CountryPatchRequestDto {
  /** Country display name. */
  name?: string;
  /** Default currency code for the country. */
  currencyCode?: string;
  /** Optional tax filing anchor month. */
  taxFilingAnchorMonth?: number;
  /** Optional tax filing interval. */
  taxFilingIntervalMonths?: 1 | 2 | 3 | 6 | 12;
}
