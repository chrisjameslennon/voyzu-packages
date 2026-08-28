import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { CountryTaxConfigurationResponseDto, TaxAuthorityResponseDto, TaxComponentResponseDto, TaxRuleResponseDto } from "@voyzu/finance/types/modules/tax";



export const createTaxAuthority = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxAuthority),
);
export const getTaxAuthority = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxAuthorityResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxAuthority),
);
export const listTaxAuthorities = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxAuthorityResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxAuthorities),
);
export const listApplicableTaxAuthorities = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(Type.Any()) },
  () => import("./server/lib/tax.service").then((module) => module.listApplicableTaxAuthorities),
);
export const updateTaxAuthority = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxAuthority),
);
export const patchTaxAuthority = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxAuthorityResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxAuthority),
);
export const deleteTaxAuthority = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxAuthority),
);
export const createTaxRule = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxRule),
);
export const getTaxRule = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxRuleResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxRule),
);
export const listTaxRules = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxRuleResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxRules),
);
export const updateTaxRule = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxRule),
);
export const patchTaxRule = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxRuleResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxRule),
);
export const deleteTaxRule = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxRule),
);
export const createTaxComponent = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.createTaxComponent),
);
export const getTaxComponent = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([TaxComponentResponseDto, Type.Null()]) },
  () => import("./server/lib/tax.service").then((module) => module.getTaxComponent),
);
export const listTaxComponents = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.String()])]), result: Type.Array(TaxComponentResponseDto) },
  () => import("./server/lib/tax.service").then((module) => module.listTaxComponents),
);
export const updateTaxComponent = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.updateTaxComponent),
);
export const patchTaxComponent = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.Any()]), result: TaxComponentResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.patchTaxComponent),
);
export const deleteTaxComponent = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/tax.service").then((module) => module.deleteTaxComponent),
);
export const getCountryTaxConfiguration = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: CountryTaxConfigurationResponseDto },
  () => import("./server/lib/tax.service").then((module) => module.getCountryTaxConfiguration),
);

export const operations = {
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
