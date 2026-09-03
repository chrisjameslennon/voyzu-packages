import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { GlAccountBatchPatchRequestDto, GlAccountBatchUpdateRequestDto, GlAccountCreateRequestDto, GlAccountPatchRequestDto, GlAccountResponseDto, GlAccountUpdateRequestDto } from "@voyzu/finance/types/modules/gl-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";



export const createGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([GlAccountCreateRequestDto]), Type.Tuple([GlAccountCreateRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.createGlAccount),
);
export const getGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([GlAccountResponseDto, Type.Null()]) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.getGlAccount),
);
export const updateGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountUpdateRequestDto]), Type.Tuple([Type.String(), GlAccountUpdateRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.updateGlAccount),
);
export const patchGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), GlAccountPatchRequestDto]), Type.Tuple([Type.String(), GlAccountPatchRequestDto, Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.patchGlAccount),
);
export const deleteGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deleteGlAccount),
);
export const listGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.listGlAccounts),
);
export const filterGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.filterGlAccounts),
);
export const searchGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.searchGlAccounts),
);
export const batchCreateGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountCreateRequestDto)]), Type.Tuple([Type.Array(GlAccountCreateRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchCreateGlAccounts),
);
export const batchGetGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchGetGlAccounts),
);
export const batchUpdateGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountBatchUpdateRequestDto)]), Type.Tuple([Type.Array(GlAccountBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchUpdateGlAccounts),
);
export const batchPatchGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(GlAccountBatchPatchRequestDto)]), Type.Tuple([Type.Array(GlAccountBatchPatchRequestDto), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchPatchGlAccounts),
);
export const batchDeleteGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.batchDeleteGlAccounts),
);
export const activateGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.activateGlAccounts),
);
export const activateGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.activateGlAccount),
);
export const deactivateGlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(GlAccountResponseDto) },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deactivateGlAccounts),
);
export const deactivateGlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: GlAccountResponseDto },
  () => import("../common/gl-accounts/server/lib/gl-account.service").then((module) => module.deactivateGlAccount),
);

export const commands = {
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
