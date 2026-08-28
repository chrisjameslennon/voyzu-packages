import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { FinancialDocumentTypeCreateRequestDto, FinancialDocumentTypePatchRequestDto, FinancialDocumentTypeResponseDto, FinancialDocumentTypeUpdateRequestDto } from "@voyzu/finance/types/modules/financial-document-types";
import { Filter, ListOptions } from "@voyzu/types/params";

const FinancialDocumentTypeBatchUpdateRequestDto = Type.Object({ ...FinancialDocumentTypeUpdateRequestDto.properties, code: Type.String() }, { additionalProperties: false });
const FinancialDocumentTypeBatchPatchRequestDto = Type.Object({ ...FinancialDocumentTypePatchRequestDto.properties, code: Type.String() }, { additionalProperties: false });


export const createFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([FinancialDocumentTypeCreateRequestDto]), Type.Tuple([FinancialDocumentTypeCreateRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.createFinancialDocumentType),
);
export const getFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([FinancialDocumentTypeResponseDto, Type.Null()]) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.getFinancialDocumentType),
);
export const updateFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), FinancialDocumentTypeUpdateRequestDto]), Type.Tuple([Type.String(), FinancialDocumentTypeUpdateRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.updateFinancialDocumentType),
);
export const patchFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), FinancialDocumentTypePatchRequestDto]), Type.Tuple([Type.String(), FinancialDocumentTypePatchRequestDto, Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.patchFinancialDocumentType),
);
export const deleteFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deleteFinancialDocumentType),
);
export const listFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.listFinancialDocumentTypes),
);
export const filterFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.filterFinancialDocumentTypes),
);
export const searchFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.searchFinancialDocumentTypes),
);
export const batchGetFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchGetFinancialDocumentTypes),
);
export const batchDeleteFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchDeleteFinancialDocumentTypes),
);
export const batchCreateFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeCreateRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeCreateRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchCreateFinancialDocumentTypes),
);
export const batchUpdateFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeBatchUpdateRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchUpdateFinancialDocumentTypes),
);
export const batchPatchFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(FinancialDocumentTypeBatchPatchRequestDto)]), Type.Tuple([Type.Array(FinancialDocumentTypeBatchPatchRequestDto), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.batchPatchFinancialDocumentTypes),
);
export const activateFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.activateFinancialDocumentType),
);
export const deactivateFinancialDocumentType = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: FinancialDocumentTypeResponseDto },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deactivateFinancialDocumentType),
);
export const activateFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.activateFinancialDocumentTypes),
);
export const deactivateFinancialDocumentTypes = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(FinancialDocumentTypeResponseDto) },
  () => import("../common/financial-document-types/server/lib/financial-document-type.service").then((module) => module.deactivateFinancialDocumentTypes),
);

export const operations = {
  createFinancialDocumentTypeCompanyFinancialDocumentTypes: createFinancialDocumentType,
  getFinancialDocumentTypeCompanyFinancialDocumentTypes: getFinancialDocumentType,
  updateFinancialDocumentTypeCompanyFinancialDocumentTypes: updateFinancialDocumentType,
  patchFinancialDocumentTypeCompanyFinancialDocumentTypes: patchFinancialDocumentType,
  deleteFinancialDocumentTypeCompanyFinancialDocumentTypes: deleteFinancialDocumentType,
  listFinancialDocumentTypesCompanyFinancialDocumentTypes: listFinancialDocumentTypes,
  filterFinancialDocumentTypesCompanyFinancialDocumentTypes: filterFinancialDocumentTypes,
  searchFinancialDocumentTypesCompanyFinancialDocumentTypes: searchFinancialDocumentTypes,
  batchGetFinancialDocumentTypesCompanyFinancialDocumentTypes: batchGetFinancialDocumentTypes,
  batchDeleteFinancialDocumentTypesCompanyFinancialDocumentTypes: batchDeleteFinancialDocumentTypes,
  batchCreateFinancialDocumentTypesCompanyFinancialDocumentTypes: batchCreateFinancialDocumentTypes,
  batchUpdateFinancialDocumentTypesCompanyFinancialDocumentTypes: batchUpdateFinancialDocumentTypes,
  batchPatchFinancialDocumentTypesCompanyFinancialDocumentTypes: batchPatchFinancialDocumentTypes,
  activateFinancialDocumentTypeCompanyFinancialDocumentTypes: activateFinancialDocumentType,
  deactivateFinancialDocumentTypeCompanyFinancialDocumentTypes: deactivateFinancialDocumentType,
  activateFinancialDocumentTypesCompanyFinancialDocumentTypes: activateFinancialDocumentTypes,
  deactivateFinancialDocumentTypesCompanyFinancialDocumentTypes: deactivateFinancialDocumentTypes,
} as const;
