import type { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

export interface CompanyResponseDto {
  /** Unique numeric identifier for the company. */
  id: number;
  /** Stable company code. */
  code: string;
  /** Company display name. */
  name: string;
  /** Country code used for company localization. */
  countryCode: string;
  /** Country reference for display. */
  country?: {
    /** Country code. */
    code: string;
    /** Country display name. */
    name: string;
  };
  /** Base currency code used for company reporting. */
  baseCurrencyCode: string;
  /** Base currency reference for display. */
  baseCurrency?: {
    /** Currency code. */
    code: string;
    /** Currency display name. */
    name: string;
  };
  /** Tax filing anchor month. */
  taxFilingAnchorMonth: number;
  /** Tax filing interval in months. */
  taxFilingIntervalMonths: 1 | 2 | 3 | 6 | 12;
  /** Whether this company inherits organization standard settings. */
  useOrganizationStandardSettings: boolean;
  /** First line used on generated reports. */
  reportLine1?: string;
  /** Second line used on generated reports. */
  reportLine2?: string;
  /** Footer text used on generated reports. */
  reportFooter?: string;
  /** Current company status. */
  status: Status;
  /** Whether the company has posted journal entries. */
  hasPostings: boolean;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
