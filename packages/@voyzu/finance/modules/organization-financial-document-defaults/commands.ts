import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { FinancialDocumentDefaultBatchPatchRequestDto, FinancialDocumentDefaultBatchUpdateRequestDto, FinancialDocumentDefaultCreateRequestDto, FinancialDocumentDefaultPatchRequestDto, FinancialDocumentDefaultResponseDto, FinancialDocumentDefaultUpdateRequestDto } from "@voyzu/finance/types/modules/financial-document-defaults";
import { Filter, ListOptions } from "@voyzu/types/params";

const FinancialDocumentDefaultKeyDto = Type.Object({ documentCode: Type.String(), code: Type.String() }, { additionalProperties: false });
const FinancialDocumentDefaultKeyInputDto = Type.Union([Type.String(), FinancialDocumentDefaultKeyDto]);


export const encodeFinancialDocumentDefaultKey = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.String()]), result: Type.String() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.encodeFinancialDocumentDefaultKey),
);
export const decodeFinancialDocumentDefaultKey = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Union([FinancialDocumentDefaultKeyDto, Type.Null()]) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.decodeFinancialDocumentDefaultKey),
);
export const createFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Tuple([FinancialDocumentDefaultCreateRequestDto]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.createFinancialDocumentDefault),
);
export const getFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: Type.Union([FinancialDocumentDefaultResponseDto, Type.Null()]) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.getFinancialDocumentDefault),
);
export const updateFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultUpdateRequestDto]), Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultUpdateRequestDto, Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.updateFinancialDocumentDefault),
);
export const patchFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultPatchRequestDto]), Type.Tuple([Type.String(), Type.String(), FinancialDocumentDefaultPatchRequestDto, Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.patchFinancialDocumentDefault),
);
export const deleteFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.String(), Type.String()]), result: Type.Undefined() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deleteFinancialDocumentDefault),
);
export const listFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.listFinancialDocumentDefaults),
);
export const listFinancialDocumentDefaultSlots = platformCommand.defineLazy(
  { parameters: Type.Tuple([]), result: Type.Array(Type.String()) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.listFinancialDocumentDefaultSlots),
);
export const filterFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.filterFinancialDocumentDefaults),
);
export const searchFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.searchFinancialDocumentDefaults),
);
export const batchCreateFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultCreateRequestDto)]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchCreateFinancialDocumentDefaults),
);
export const batchGetFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto)]), Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchGetFinancialDocumentDefaults),
);
export const batchUpdateFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultBatchUpdateRequestDto)]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchUpdateFinancialDocumentDefaults),
);
export const batchPatchFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultBatchPatchRequestDto)]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchPatchFinancialDocumentDefaults),
);
export const batchDeleteFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto)]), result: Type.Undefined() },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.batchDeleteFinancialDocumentDefaults),
);
export const activateFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.activateFinancialDocumentDefault),
);
export const deactivateFinancialDocumentDefault = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.String()]), Type.Tuple([Type.String(), Type.String(), Type.Number()])]), result: FinancialDocumentDefaultResponseDto },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deactivateFinancialDocumentDefault),
);
export const activateFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto)]), Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.activateFinancialDocumentDefaults),
);
export const deactivateFinancialDocumentDefaults = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto)]), Type.Tuple([Type.Array(FinancialDocumentDefaultKeyDto), Type.Number()])]), result: Type.Array(FinancialDocumentDefaultResponseDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.deactivateFinancialDocumentDefaults),
);
export const normalizeFinancialDocumentDefaultKeys = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Array(FinancialDocumentDefaultKeyInputDto)]), result: Type.Array(FinancialDocumentDefaultKeyDto) },
  () => import("../common/financial-document-defaults/server/lib/financial-document-default.service").then((module) => module.normalizeFinancialDocumentDefaultKeys),
);

export const commands = {
  encodeFinancialDocumentDefaultKeyOrganizationFinancialDocumentDefaults: encodeFinancialDocumentDefaultKey,
  decodeFinancialDocumentDefaultKeyOrganizationFinancialDocumentDefaults: decodeFinancialDocumentDefaultKey,
  createFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: createFinancialDocumentDefault,
  getFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: getFinancialDocumentDefault,
  updateFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: updateFinancialDocumentDefault,
  patchFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: patchFinancialDocumentDefault,
  deleteFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: deleteFinancialDocumentDefault,
  listFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: listFinancialDocumentDefaults,
  listFinancialDocumentDefaultSlotsOrganizationFinancialDocumentDefaults: listFinancialDocumentDefaultSlots,
  filterFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: filterFinancialDocumentDefaults,
  searchFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: searchFinancialDocumentDefaults,
  batchCreateFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: batchCreateFinancialDocumentDefaults,
  batchGetFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: batchGetFinancialDocumentDefaults,
  batchUpdateFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: batchUpdateFinancialDocumentDefaults,
  batchPatchFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: batchPatchFinancialDocumentDefaults,
  batchDeleteFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: batchDeleteFinancialDocumentDefaults,
  activateFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: activateFinancialDocumentDefault,
  deactivateFinancialDocumentDefaultOrganizationFinancialDocumentDefaults: deactivateFinancialDocumentDefault,
  activateFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: activateFinancialDocumentDefaults,
  deactivateFinancialDocumentDefaultsOrganizationFinancialDocumentDefaults: deactivateFinancialDocumentDefaults,
  normalizeFinancialDocumentDefaultKeysOrganizationFinancialDocumentDefaults: normalizeFinancialDocumentDefaultKeys,
} as const;
