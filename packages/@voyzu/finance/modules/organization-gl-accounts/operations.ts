import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { GlAccountBatchPatchRequestDto, GlAccountBatchUpdateRequestDto, GlAccountCreateRequestDto, GlAccountPatchRequestDto, GlAccountResponseDto, GlAccountUpdateRequestDto } from "@voyzu/finance/types/modules/gl-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";



export const createGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([GlAccountCreateRequestDto]), Type.Tuple([GlAccountCreateRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.createGlAccount),
);
export const getGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([GlAccountResponseDto, Type.Null()]) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.getGlAccount),
);
export const updateGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountUpdateRequestDto]), Type.Tuple([Type.String(), GlAccountUpdateRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.updateGlAccount),
);
export const patchGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountPatchRequestDto]), Type.Tuple([Type.String(), GlAccountPatchRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.patchGlAccount),
);
export const deleteGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deleteGlAccount),
);
export const listGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.listGlAccounts),
);
export const filterGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.filterGlAccounts),
);
export const searchGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.searchGlAccounts),
);
export const batchCreateGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCreateRequestDto)]), Type.Tuple([Type.Array(GlAccountCreateRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchCreateGlAccounts),
);
export const batchGetGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchGetGlAccounts),
);
export const batchUpdateGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountBatchUpdateRequestDto)]), Type.Tuple([Type.Array(GlAccountBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchUpdateGlAccounts),
);
export const batchPatchGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountBatchPatchRequestDto)]), Type.Tuple([Type.Array(GlAccountBatchPatchRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchPatchGlAccounts),
);
export const batchDeleteGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchDeleteGlAccounts),
);
export const activateGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.activateGlAccounts),
);
export const activateGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.activateGlAccount),
);
export const deactivateGlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deactivateGlAccounts),
);
export const deactivateGlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deactivateGlAccount),
);

export const operations = {
  createGlAccountOrganizationGlAccounts: createGlAccount,
  getGlAccountOrganizationGlAccounts: getGlAccount,
  updateGlAccountOrganizationGlAccounts: updateGlAccount,
  patchGlAccountOrganizationGlAccounts: patchGlAccount,
  deleteGlAccountOrganizationGlAccounts: deleteGlAccount,
  listGlAccountsOrganizationGlAccounts: listGlAccounts,
  filterGlAccountsOrganizationGlAccounts: filterGlAccounts,
  searchGlAccountsOrganizationGlAccounts: searchGlAccounts,
  batchCreateGlAccountsOrganizationGlAccounts: batchCreateGlAccounts,
  batchGetGlAccountsOrganizationGlAccounts: batchGetGlAccounts,
  batchUpdateGlAccountsOrganizationGlAccounts: batchUpdateGlAccounts,
  batchPatchGlAccountsOrganizationGlAccounts: batchPatchGlAccounts,
  batchDeleteGlAccountsOrganizationGlAccounts: batchDeleteGlAccounts,
  activateGlAccountsOrganizationGlAccounts: activateGlAccounts,
  activateGlAccountOrganizationGlAccounts: activateGlAccount,
  deactivateGlAccountsOrganizationGlAccounts: deactivateGlAccounts,
  deactivateGlAccountOrganizationGlAccounts: deactivateGlAccount,
} as const;
