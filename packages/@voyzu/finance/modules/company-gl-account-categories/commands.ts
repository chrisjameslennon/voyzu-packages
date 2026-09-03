import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { GlAccountCategoryBatchPatchRequestDto, GlAccountCategoryBatchUpdateRequestDto, GlAccountCategoryCreateRequestDto, GlAccountCategoryPatchRequestDto, GlAccountCategoryResponseDto, GlAccountCategoryUpdateRequestDto } from "@voyzu/finance/types/modules/gl-account-categories";
import { Filter, ListOptions } from "@voyzu/types/params";



export const createGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([GlAccountCategoryCreateRequestDto]), Type.Tuple([GlAccountCategoryCreateRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.createGlAccountCategory),
);
export const getGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([GlAccountCategoryResponseDto, Type.Null()]) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.getGlAccountCategory),
);
export const updateGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountCategoryUpdateRequestDto]), Type.Tuple([Type.String(), GlAccountCategoryUpdateRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.updateGlAccountCategory),
);
export const patchGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountCategoryPatchRequestDto]), Type.Tuple([Type.String(), GlAccountCategoryPatchRequestDto, Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.patchGlAccountCategory),
);
export const deleteGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deleteGlAccountCategory),
);
export const listGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.listGlAccountCategories),
);
export const filterGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.filterGlAccountCategories),
);
export const searchGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.searchGlAccountCategories),
);
export const batchCreateGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryCreateRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryCreateRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchCreateGlAccountCategories),
);
export const batchGetGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchGetGlAccountCategories),
);
export const batchUpdateGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryBatchUpdateRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchUpdateGlAccountCategories),
);
export const batchPatchGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCategoryBatchPatchRequestDto)]), Type.Tuple([Type.Array(GlAccountCategoryBatchPatchRequestDto), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchPatchGlAccountCategories),
);
export const batchDeleteGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.batchDeleteGlAccountCategories),
);
export const activateGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.activateGlAccountCategories),
);
export const activateGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.activateGlAccountCategory),
);
export const deactivateGlAccountCategories = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountCategoryResponseDto) },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deactivateGlAccountCategories),
);
export const deactivateGlAccountCategory = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountCategoryResponseDto },
  () => import("../common/gl-account-categories/server/lib/gl-account-category.service").then((module) => module.deactivateGlAccountCategory),
);

export const commands = {
  createGlAccountCategoryCompanyGlAccountCategories: createGlAccountCategory,
  getGlAccountCategoryCompanyGlAccountCategories: getGlAccountCategory,
  updateGlAccountCategoryCompanyGlAccountCategories: updateGlAccountCategory,
  patchGlAccountCategoryCompanyGlAccountCategories: patchGlAccountCategory,
  deleteGlAccountCategoryCompanyGlAccountCategories: deleteGlAccountCategory,
  listGlAccountCategoriesCompanyGlAccountCategories: listGlAccountCategories,
  filterGlAccountCategoriesCompanyGlAccountCategories: filterGlAccountCategories,
  searchGlAccountCategoriesCompanyGlAccountCategories: searchGlAccountCategories,
  batchCreateGlAccountCategoriesCompanyGlAccountCategories: batchCreateGlAccountCategories,
  batchGetGlAccountCategoriesCompanyGlAccountCategories: batchGetGlAccountCategories,
  batchUpdateGlAccountCategoriesCompanyGlAccountCategories: batchUpdateGlAccountCategories,
  batchPatchGlAccountCategoriesCompanyGlAccountCategories: batchPatchGlAccountCategories,
  batchDeleteGlAccountCategoriesCompanyGlAccountCategories: batchDeleteGlAccountCategories,
  activateGlAccountCategoriesCompanyGlAccountCategories: activateGlAccountCategories,
  activateGlAccountCategoryCompanyGlAccountCategories: activateGlAccountCategory,
  deactivateGlAccountCategoriesCompanyGlAccountCategories: deactivateGlAccountCategories,
  deactivateGlAccountCategoryCompanyGlAccountCategories: deactivateGlAccountCategory,
} as const;
