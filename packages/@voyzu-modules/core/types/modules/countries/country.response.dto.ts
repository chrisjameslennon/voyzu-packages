import type { AuditMetadataDto, OperationReference } from "@voyzu/types/modules/core";
import type { Status } from "@voyzu/types/modules/core";

export interface CountryTaxAuthorityResponseDto {
  /** Internal identifier for the tax authority. */
  id: string;
  /** Tax authority business code. */
  code: string;
  /** Tax authority display name. */
  name: string;
  /** Optional country region code for the authority. */
  regionCode?: string | null;
  /** Jurisdiction level handled by the authority. */
  jurisdictionLevel: string;
  /** Current lifecycle status of the tax authority. */
  status: Status;
}

export interface CountryTaxRuleResponseDto {
  /** Internal identifier for the tax rule. */
  id: string;
  /** Tax rule business code. */
  code: string;
  /** Tax rule display name. */
  name: string;
  /** Optional country region code for the rule. */
  regionCode?: string | null;
  /** Invoice label used for this tax rule. */
  invoiceLabel: string;
  /** Calculation method used by this tax rule. */
  calculationMethod: string;
  /** Number of tax components in this tax rule. */
  componentCount: number;
  /** Current lifecycle status of the tax rule. */
  status: Status;
}

export interface CountryTaxComponentResponseDto {
  /** Internal identifier for the tax component. */
  id: string;
  /** Tax component business code. */
  code: string;
  /** Parent tax rule code. */
  taxRuleCode: string;
  /** Tax authority code receiving this component. */
  taxAuthorityCode: string;
  /** Tax scheme code for this component. */
  schemeCode: string;
  /** Invoice label used for this tax component. */
  invoiceLabel: string;
  /** Tax rate for this component. */
  rate: number;
  /** Current lifecycle status of the tax component. */
  status: Status;
}

export interface CountryResponseDto {
  /** Stable country identifier. */
  id: string;
  /** Stable country business code. */
  code: string;
  /** Country display name. */
  name: string;
  /** Default currency code for the country. */
  currencyCode: string;
  /** First month of the country's financial period cycle, when configured. */
  financialPeriodStartMonth: string | null;
  /** Anchor month used for tax filing cycles. */
  taxFilingAnchorMonth: number;
  /** Filing interval, in months, used for tax filing cycles. */
  taxFilingIntervalMonths: 1 | 2 | 3 | 6 | 12;
  /** Tax authorities configured for this country. */
  taxAuthorities?: CountryTaxAuthorityResponseDto[];
  /** Tax rules configured for this country. */
  taxRules?: CountryTaxRuleResponseDto[];
  /** Tax components configured for this country. */
  taxComponents?: CountryTaxComponentResponseDto[];
  /** Default currency summary. */
  currency: {
    /** Default currency code. */
    code: string;
    /** Default currency display name. */
    name: string;
  };
  /** Current lifecycle status of the country. */
  status: Status;
  /** True when at least one company in this country has posted journal headers. */
  hasPostings: boolean;
  /** Records that directly reference this country. */
  linkedBy: OperationReference[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
