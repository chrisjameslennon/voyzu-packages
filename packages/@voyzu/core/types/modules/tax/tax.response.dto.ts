import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, CountryCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const TaxFamilyCode = Type.Literal("INDIRECT_TAX");
export type TaxFamilyCode = Type.Static<typeof TaxFamilyCode>;
export const TaxRuleCalculationMethod = Type.Union([Type.Literal("NO_TAX"), Type.Literal("CONFIGURED_COMPONENTS")]);
export type TaxRuleCalculationMethod = Type.Static<typeof TaxRuleCalculationMethod>;
export const TaxComponentMode = Type.Union([Type.Literal("NONE"), Type.Literal("CONFIGURED")]);
export type TaxComponentMode = Type.Static<typeof TaxComponentMode>;
export const TaxBaseAmountType = Type.Literal("LINE_NET_AMOUNT");
export type TaxBaseAmountType = Type.Static<typeof TaxBaseAmountType>;

const AuditDto = StrictObject({
  audit: AuditMetadataDto,
});
type AuditDto = Type.Static<typeof AuditDto>;

export const TaxAuthorityResponseDto = StrictObject({
  ...AuditDto.properties,
  id: PositiveId,
  code: BusinessCode,
  name: NonBlankText,
  countryCode: CountryCode,
  regionCode: Type.Union([BusinessCode, Type.Null()]),
  jurisdictionLevel: Type.String(),
  taxFamilyCode: TaxFamilyCode,
  description: Type.Union([Type.String(), Type.Null()]),
  status: Status,
});
export type TaxAuthorityResponseDto = Type.Static<typeof TaxAuthorityResponseDto>;

export const TaxRuleResponseDto = StrictObject({
  ...AuditDto.properties,
  id: PositiveId,
  code: BusinessCode,
  countryCode: CountryCode,
  regionCode: Type.Union([BusinessCode, Type.Null()]),
  name: NonBlankText,
  invoiceLabel: Type.String(),
  reportLabel: Type.String(),
  calculationMethod: TaxRuleCalculationMethod,
  componentMode: TaxComponentMode,
  componentCount: Type.Number(),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Status,
});
export type TaxRuleResponseDto = Type.Static<typeof TaxRuleResponseDto>;

export const TaxComponentResponseDto = StrictObject({
  ...AuditDto.properties,
  id: PositiveId,
  code: BusinessCode,
  taxRuleCode: BusinessCode,
  taxAuthorityCode: BusinessCode,
  schemeCode: BusinessCode,
  invoiceLabel: Type.String(),
  reportLabel: Type.String(),
  rate: Type.Number(),
  baseAmountType: TaxBaseAmountType,
  calculationOrder: Type.Number(),
  description: Type.Union([Type.String(), Type.Null()]),
  status: Status,
});
export type TaxComponentResponseDto = Type.Static<typeof TaxComponentResponseDto>;

export const CountryTaxConfigurationResponseDto = StrictObject({
  taxAuthorities: Type.Array(TaxAuthorityResponseDto),
  taxRules: Type.Array(TaxRuleResponseDto),
  taxComponents: Type.Array(TaxComponentResponseDto),
});
export type CountryTaxConfigurationResponseDto = Type.Static<typeof CountryTaxConfigurationResponseDto>;
