import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { CountryTaxConfigurationResponseDto, TaxAuthorityResponseDto, TaxComponentResponseDto, TaxRuleResponseDto } from "@voyzu/finance/types/modules/tax";

const NullableString = Type.Union([Type.String(), Type.Null()]);
const TaxAuthorityRequestDto = Type.Object({
  code: Type.String(), name: Type.String(), country_code: Type.String(), region_code: NullableString,
  jurisdiction_level: Type.String(), tax_family_code: Type.String(), description: NullableString, status: Type.String(),
}, { additionalProperties: false });
const TaxAuthorityPatchRequestDto = Type.Partial(TaxAuthorityRequestDto);
const ApplicableTaxAuthorityResponseDto = Type.Object({ ...TaxAuthorityResponseDto.properties, balance: Type.Number() }, { additionalProperties: false });
const TaxRuleRequestDto = Type.Object({
  code: Type.String(), country_code: Type.String(), region_code: NullableString, name: Type.String(),
  invoice_label: Type.String(), report_label: Type.String(), calculation_method: Type.String(),
  component_mode: Type.String(), component_count: Type.Number(), description: NullableString, status: Type.String(),
}, { additionalProperties: false });
const TaxRulePatchRequestDto = Type.Partial(TaxRuleRequestDto);
const TaxComponentRequestDto = Type.Object({
  code: Type.String(), tax_rule_code: Type.String(), tax_authority_code: Type.String(), scheme_code: Type.String(),
  invoice_label: Type.String(), report_label: Type.String(), rate: Type.Number(), base_amount_type: Type.String(),
  calculation_order: Type.Number(), description: NullableString, status: Type.String(),
}, { additionalProperties: false });
const TaxComponentPatchRequestDto = Type.Partial(TaxComponentRequestDto);


export const createTaxAuthority = platformCommand.defineLazy(
  { parameters: Type.Tuple([TaxAuthorityRequestDto]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxAuthority),
);
export const getTaxAuthority = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxAuthorityResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxAuthority),
);
export const listTaxAuthorities = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxAuthorityResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxAuthorities),
);
export const listApplicableTaxAuthorities = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApplicableTaxAuthorityResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listApplicableTaxAuthorities),
);
export const updateTaxAuthority = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxAuthorityRequestDto]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxAuthority),
);
export const patchTaxAuthority = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxAuthorityPatchRequestDto]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxAuthority),
);
export const deleteTaxAuthority = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxAuthority),
);
export const createTaxRule = platformCommand.defineLazy(
  { parameters: Type.Tuple([TaxRuleRequestDto]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxRule),
);
export const getTaxRule = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxRuleResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxRule),
);
export const listTaxRules = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxRuleResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxRules),
);
export const updateTaxRule = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxRuleRequestDto]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxRule),
);
export const patchTaxRule = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxRulePatchRequestDto]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxRule),
);
export const deleteTaxRule = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxRule),
);
export const createTaxComponent = platformCommand.defineLazy(
  { parameters: Type.Tuple([TaxComponentRequestDto]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxComponent),
);
export const getTaxComponent = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxComponentResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxComponent),
);
export const listTaxComponents = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxComponentResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxComponents),
);
export const updateTaxComponent = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxComponentRequestDto]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxComponent),
);
export const patchTaxComponent = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), TaxComponentPatchRequestDto]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxComponent),
);
export const deleteTaxComponent = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxComponent),
);
export const getCountryTaxConfiguration = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: CountryTaxConfigurationResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.getCountryTaxConfiguration),
);

export const commands = {
  createTaxAuthority,
  getTaxAuthority,
  listTaxAuthorities,
  listApplicableTaxAuthorities,
  updateTaxAuthority,
  patchTaxAuthority,
  deleteTaxAuthority,
  createTaxRule,
  getTaxRule,
  listTaxRules,
  updateTaxRule,
  patchTaxRule,
  deleteTaxRule,
  createTaxComponent,
  getTaxComponent,
  listTaxComponents,
  updateTaxComponent,
  patchTaxComponent,
  deleteTaxComponent,
  getCountryTaxConfiguration,
} as const;
