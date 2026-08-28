import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { DimensionBatchPatchRequestDto, DimensionBatchUpdateRequestDto, DimensionCreateRequestDto, DimensionPatchRequestDto, DimensionResponseDto, DimensionUpdateRequestDto, DimensionValueCreateRequestDto, DimensionValuePatchRequestDto, DimensionValueResponseDto } from "@voyzu/finance/types/modules/dimensions";
import { Filter, ListOptions } from "@voyzu/types/params";



export const createDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([DimensionCreateRequestDto]), Type.Tuple([DimensionCreateRequestDto, Type.Number()])]), result: DimensionResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.createDimension),
);
export const getDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([DimensionResponseDto, Type.Null()]) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.getDimension),
);
export const updateDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), DimensionUpdateRequestDto]), Type.Tuple([Type.String(), DimensionUpdateRequestDto, Type.Number()])]), result: DimensionResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.updateDimension),
);
export const patchDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), DimensionPatchRequestDto]), Type.Tuple([Type.String(), DimensionPatchRequestDto, Type.Number()])]), result: DimensionResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.patchDimension),
);
export const deleteDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.deleteDimension),
);
export const listDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.listDimensions),
);
export const filterDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.filterDimensions),
);
export const searchDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.searchDimensions),
);
export const batchCreateDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(DimensionCreateRequestDto)]), Type.Tuple([Type.Array(DimensionCreateRequestDto), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.batchCreateDimensions),
);
export const batchGetDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.batchGetDimensions),
);
export const batchUpdateDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(DimensionBatchUpdateRequestDto)]), Type.Tuple([Type.Array(DimensionBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.batchUpdateDimensions),
);
export const batchPatchDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(DimensionBatchPatchRequestDto)]), Type.Tuple([Type.Array(DimensionBatchPatchRequestDto), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.batchPatchDimensions),
);
export const batchDeleteDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.batchDeleteDimensions),
);
export const activateDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.activateDimensions),
);
export const activateDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: DimensionResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.activateDimension),
);
export const deactivateDimensions = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(DimensionResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.deactivateDimensions),
);
export const deactivateDimension = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: DimensionResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.deactivateDimension),
);
export const createDimensionValue = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), DimensionValueCreateRequestDto]), Type.Tuple([Type.String(), DimensionValueCreateRequestDto, Type.Number()])]), result: DimensionValueResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.createDimensionValue),
);
export const listDimensionValues = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Array(DimensionValueResponseDto) },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.listDimensionValues),
);
export const patchDimensionValue = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number(), DimensionValuePatchRequestDto]), Type.Tuple([Type.Number(), DimensionValuePatchRequestDto, Type.Number()])]), result: DimensionValueResponseDto },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.patchDimensionValue),
);
export const deleteDimensionValue = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number()]), Type.Tuple([Type.Number(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/dimensions/server/lib/dimension.service").then((module) => module.deleteDimensionValue),
);

export const operations = {
  createDimensionOrganizationDimensions: createDimension,
  getDimensionOrganizationDimensions: getDimension,
  updateDimensionOrganizationDimensions: updateDimension,
  patchDimensionOrganizationDimensions: patchDimension,
  deleteDimensionOrganizationDimensions: deleteDimension,
  listDimensionsOrganizationDimensions: listDimensions,
  filterDimensionsOrganizationDimensions: filterDimensions,
  searchDimensionsOrganizationDimensions: searchDimensions,
  batchCreateDimensionsOrganizationDimensions: batchCreateDimensions,
  batchGetDimensionsOrganizationDimensions: batchGetDimensions,
  batchUpdateDimensionsOrganizationDimensions: batchUpdateDimensions,
  batchPatchDimensionsOrganizationDimensions: batchPatchDimensions,
  batchDeleteDimensionsOrganizationDimensions: batchDeleteDimensions,
  activateDimensionsOrganizationDimensions: activateDimensions,
  activateDimensionOrganizationDimensions: activateDimension,
  deactivateDimensionsOrganizationDimensions: deactivateDimensions,
  deactivateDimensionOrganizationDimensions: deactivateDimension,
  createDimensionValueOrganizationDimensions: createDimensionValue,
  listDimensionValuesOrganizationDimensions: listDimensionValues,
  patchDimensionValueOrganizationDimensions: patchDimensionValue,
  deleteDimensionValueOrganizationDimensions: deleteDimensionValue,
} as const;
