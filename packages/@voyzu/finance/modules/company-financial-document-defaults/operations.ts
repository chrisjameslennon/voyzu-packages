import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { FinancialDocumentDefaultCreateRequestDto, FinancialDocumentDefaultPatchRequestDto, FinancialDocumentDefaultResponseDto, FinancialDocumentDefaultUpdateRequestDto } from "@voyzu/finance/types/modules/financial-document-defaults";
import { Filter, ListOptions } from "@voyzu/types/params";



export const encodeFinancialDocumentDefaultKey = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.String()]), result: Type.String() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.encodeFinancialDocumentDefaultKey),
);
export const decodeFinancialDocumentDefaultKey = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([Type.Any(), Type.Null()]) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.decodeFinancialDocumentDefaultKey),
);
export const createFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Tuple([FinancialDocumentDefaultCreateRequestDto]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.createFinancialDocumentDefault),
);
export const getFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: Type.Union([FinancialDocumentDefaultResponseDto, Type.Null()]) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.getFinancialDocumentDefault),
);
export const updateFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultUpdateRequestDto]), Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultUpdateRequestDto, Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.updateFinancialDocumentDefault),
);
export const patchFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultPatchRequestDto]), Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultPatchRequestDto, Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.patchFinancialDocumentDefault),
);
export const deleteFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.String()]), result: Type.Undefined() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deleteFinancialDocumentDefault),
);
export const listFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.listFinancialDocumentDefaults),
);
export const listFinancialDocumentDefaultSlots = platformOperation.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(Type.String()) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.listFinancialDocumentDefaultSlots),
);
export const filterFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.filterFinancialDocumentDefaults),
);
export const searchFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.searchFinancialDocumentDefaults),
);
export const batchCreateFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultCreateRequestDto)]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchCreateFinancialDocumentDefaults),
);
export const batchGetFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.Any())]), Type.Tuple([Type.Array(Type.Any()), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchGetFinancialDocumentDefaults),
);
export const batchUpdateFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Array(Type.Any())]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchUpdateFinancialDocumentDefaults),
);
export const batchPatchFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Array(Type.Any())]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchPatchFinancialDocumentDefaults),
);
export const batchDeleteFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Array(Type.Any())]), result: Type.Undefined() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchDeleteFinancialDocumentDefaults),
);
export const activateFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.activateFinancialDocumentDefault),
);
export const deactivateFinancialDocumentDefault = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deactivateFinancialDocumentDefault),
);
export const activateFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.Any())]), Type.Tuple([Type.Array(Type.Any()), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.activateFinancialDocumentDefaults),
);
export const deactivateFinancialDocumentDefaults = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.Any())]), Type.Tuple([Type.Array(Type.Any()), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deactivateFinancialDocumentDefaults),
);
export const normalizeFinancialDocumentDefaultKeys = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: Type.Array(Type.Any()) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.normalizeFinancialDocumentDefaultKeys),
);

export const operations = {
  encodeFinancialDocumentDefaultKeyCompanyFinancialDocumentDefaults: encodeFinancialDocumentDefaultKey,
  decodeFinancialDocumentDefaultKeyCompanyFinancialDocumentDefaults: decodeFinancialDocumentDefaultKey,
  createFinancialDocumentDefaultCompanyFinancialDocumentDefaults: createFinancialDocumentDefault,
  getFinancialDocumentDefaultCompanyFinancialDocumentDefaults: getFinancialDocumentDefault,
  updateFinancialDocumentDefaultCompanyFinancialDocumentDefaults: updateFinancialDocumentDefault,
  patchFinancialDocumentDefaultCompanyFinancialDocumentDefaults: patchFinancialDocumentDefault,
  deleteFinancialDocumentDefaultCompanyFinancialDocumentDefaults: deleteFinancialDocumentDefault,
  listFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: listFinancialDocumentDefaults,
  listFinancialDocumentDefaultSlotsCompanyFinancialDocumentDefaults: listFinancialDocumentDefaultSlots,
  filterFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: filterFinancialDocumentDefaults,
  searchFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: searchFinancialDocumentDefaults,
  batchCreateFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: batchCreateFinancialDocumentDefaults,
  batchGetFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: batchGetFinancialDocumentDefaults,
  batchUpdateFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: batchUpdateFinancialDocumentDefaults,
  batchPatchFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: batchPatchFinancialDocumentDefaults,
  batchDeleteFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: batchDeleteFinancialDocumentDefaults,
  activateFinancialDocumentDefaultCompanyFinancialDocumentDefaults: activateFinancialDocumentDefault,
  deactivateFinancialDocumentDefaultCompanyFinancialDocumentDefaults: deactivateFinancialDocumentDefault,
  activateFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: activateFinancialDocumentDefaults,
  deactivateFinancialDocumentDefaultsCompanyFinancialDocumentDefaults: deactivateFinancialDocumentDefaults,
  normalizeFinancialDocumentDefaultKeysCompanyFinancialDocumentDefaults: normalizeFinancialDocumentDefaultKeys,
} as const;
