import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { Status } from "@voyzu/types/modules/core";

export type TaxFamilyCode = "INDIRECT_TAX";
export type TaxRuleCalculationMethod = "NO_TAX" | "CONFIGURED_COMPONENTS";
export type TaxComponentMode = "NONE" | "CONFIGURED";
export type TaxBaseAmountType = "LINE_NET_AMOUNT";

interface AuditDto {
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}

export interface TaxAuthorityResponseDto extends AuditDto {
  id: number;
  code: string;
  name: string;
  countryCode: string;
  regionCode: string | null;
  jurisdictionLevel: string;
  taxFamilyCode: TaxFamilyCode;
  description: string | null;
  status: Status;
}

export interface TaxRuleResponseDto extends AuditDto {
  id: number;
  code: string;
  countryCode: string;
  regionCode: string | null;
  name: string;
  invoiceLabel: string;
  reportLabel: string;
  calculationMethod: TaxRuleCalculationMethod;
  componentMode: TaxComponentMode;
  componentCount: number;
  description: string | null;
  status: Status;
}

export interface TaxComponentResponseDto extends AuditDto {
  id: number;
  code: string;
  taxRuleCode: string;
  taxAuthorityCode: string;
  schemeCode: string;
  invoiceLabel: string;
  reportLabel: string;
  rate: number;
  baseAmountType: TaxBaseAmountType;
  calculationOrder: number;
  description: string | null;
  status: Status;
}

export interface CountryTaxConfigurationResponseDto {
  taxAuthorities: TaxAuthorityResponseDto[];
  taxRules: TaxRuleResponseDto[];
  taxComponents: TaxComponentResponseDto[];
}
