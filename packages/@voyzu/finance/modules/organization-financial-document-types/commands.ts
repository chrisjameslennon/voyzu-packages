import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { FinancialDocumentTypeCreateRequestDto, FinancialDocumentTypePatchRequestDto, FinancialDocumentTypeResponseDto, FinancialDocumentTypeUpdateRequestDto } from "@voyzu/finance/types/modules/financial-document-types";
import { Filter, ListOptions } from "@voyzu/types/params";

const FinancialDocumentTypeBatchUpdateRequestDto = Type.Object({ ...FinancialDocumentTypeUpdateRequestDto.properties, code: Type.String() }, { additionalProperties: false });
const FinancialDocumentTypeBatchPatchRequestDto = Type.Object({ ...FinancialDocumentTypePatchRequestDto.properties, code: Type.String() }, { additionalProperties: false });


export const createFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([FinancialDocumentTypeCreateRequestDto]), Type.Tuple([FinancialDocumentTypeCreateRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.createFinancialDocumentType),
);
export const getFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([FinancialDocumentTypeResponseDto, Type.Null()]) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.getFinancialDocumentType),
);
export const updateFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), FinancialDocumentTypeUpdateRequestDto]), Type.Tuple([Type.String(), FinancialDocumentTypeUpdateRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.updateFinancialDocumentType),
);
export const patchFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), FinancialDocumentTypePatchRequestDto]), Type.Tuple([Type.String(), FinancialDocumentTypePatchRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.patchFinancialDocumentType),
);
export const deleteFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deleteFinancialDocumentType),
);
export const listFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.listFinancialDocumentTypes),
);
export const filterFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.filterFinancialDocumentTypes),
);
export const searchFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.searchFinancialDocumentTypes),
);
export const batchGetFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchGetFinancialDocumentTypes),
);
export const batchDeleteFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchDeleteFinancialDocumentTypes),
);
export const batchCreateFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeCreateRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeCreateRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchCreateFinancialDocumentTypes),
);
export const batchUpdateFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeBatchUpdateRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchUpdateFinancialDocumentTypes),
);
export const batchPatchFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeBatchPatchRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeBatchPatchRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchPatchFinancialDocumentTypes),
);
export const activateFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.activateFinancialDocumentType),
);
export const deactivateFinancialDocumentType = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deactivateFinancialDocumentType),
);
export const activateFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.activateFinancialDocumentTypes),
);
export const deactivateFinancialDocumentTypes = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deactivateFinancialDocumentTypes),
);

export const commands = {
  createFinancialDocumentTypeOrganizationFinancialDocumentTypes: createFinancialDocumentType,
  getFinancialDocumentTypeOrganizationFinancialDocumentTypes: getFinancialDocumentType,
  updateFinancialDocumentTypeOrganizationFinancialDocumentTypes: updateFinancialDocumentType,
  patchFinancialDocumentTypeOrganizationFinancialDocumentTypes: patchFinancialDocumentType,
  deleteFinancialDocumentTypeOrganizationFinancialDocumentTypes: deleteFinancialDocumentType,
  listFinancialDocumentTypesOrganizationFinancialDocumentTypes: listFinancialDocumentTypes,
  filterFinancialDocumentTypesOrganizationFinancialDocumentTypes: filterFinancialDocumentTypes,
  searchFinancialDocumentTypesOrganizationFinancialDocumentTypes: searchFinancialDocumentTypes,
  batchGetFinancialDocumentTypesOrganizationFinancialDocumentTypes: batchGetFinancialDocumentTypes,
  batchDeleteFinancialDocumentTypesOrganizationFinancialDocumentTypes: batchDeleteFinancialDocumentTypes,
  batchCreateFinancialDocumentTypesOrganizationFinancialDocumentTypes: batchCreateFinancialDocumentTypes,
  batchUpdateFinancialDocumentTypesOrganizationFinancialDocumentTypes: batchUpdateFinancialDocumentTypes,
  batchPatchFinancialDocumentTypesOrganizationFinancialDocumentTypes: batchPatchFinancialDocumentTypes,
  activateFinancialDocumentTypeOrganizationFinancialDocumentTypes: activateFinancialDocumentType,
  deactivateFinancialDocumentTypeOrganizationFinancialDocumentTypes: deactivateFinancialDocumentType,
  activateFinancialDocumentTypesOrganizationFinancialDocumentTypes: activateFinancialDocumentTypes,
  deactivateFinancialDocumentTypesOrganizationFinancialDocumentTypes: deactivateFinancialDocumentTypes,
} as const;
