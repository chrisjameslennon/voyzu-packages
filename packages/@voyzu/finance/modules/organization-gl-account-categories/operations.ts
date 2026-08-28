import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { GlAccountCategoryBatchPatchRequestDto, GlAccountCategoryBatchUpdateRequestDto, GlAccountCategoryCreateRequestDto, GlAccountCategoryPatchRequestDto, GlAccountCategoryResponseDto, GlAccountCategoryUpdateRequestDto } from "@voyzu/finance/types/modules/gl-account-categories";
import { Filter, ListOptions } from "@voyzu/types/params";



export const createGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([GlAccountCategoryCreateRequestDto]), Type.Tuple([GlAccountCategoryCreateRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.createGlAccountCategory),
);
export const getGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([GlAccountCategoryResponseDto, Type.Null()]) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.getGlAccountCategory),
);
export const updateGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountCategoryUpdateRequestDto]), Type.Tuple([Type.String(), GlAccountCategoryUpdateRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.updateGlAccountCategory),
);
export const patchGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountCategoryPatchRequestDto]), Type.Tuple([Type.String(), GlAccountCategoryPatchRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.patchGlAccountCategory),
);
export const deleteGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deleteGlAccountCategory),
);
export const listGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.listGlAccountCategories),
);
export const filterGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.filterGlAccountCategories),
);
export const searchGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.searchGlAccountCategories),
);
export const batchCreateGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryCreateRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryCreateRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchCreateGlAccountCategories),
);
export const batchGetGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchGetGlAccountCategories),
);
export const batchUpdateGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryBatchUpdateRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchUpdateGlAccountCategories),
);
export const batchPatchGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryBatchPatchRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryBatchPatchRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchPatchGlAccountCategories),
);
export const batchDeleteGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchDeleteGlAccountCategories),
);
export const activateGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.activateGlAccountCategories),
);
export const activateGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.activateGlAccountCategory),
);
export const deactivateGlAccountCategories = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deactivateGlAccountCategories),
);
export const deactivateGlAccountCategory = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deactivateGlAccountCategory),
);

export const operations = {
  createGlAccountCategory,
  getGlAccountCategory,
  updateGlAccountCategory,
  patchGlAccountCategory,
  deleteGlAccountCategory,
  listGlAccountCategories,
  filterGlAccountCategories,
  searchGlAccountCategories,
  batchCreateGlAccountCategories,
  batchGetGlAccountCategories,
  batchUpdateGlAccountCategories,
  batchPatchGlAccountCategories,
  batchDeleteGlAccountCategories,
  activateGlAccountCategories,
  activateGlAccountCategory,
  deactivateGlAccountCategories,
  deactivateGlAccountCategory,
} as const;
