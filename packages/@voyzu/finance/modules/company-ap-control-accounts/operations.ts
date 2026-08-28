import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { ControlAccountPatchRequestDto, ControlAccountResponseDto, ControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/control-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";



export const getControlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([ControlAccountResponseDto, Type.Null()]) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.getControlAccount),
);
export const listControlAccountSettings = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(ControlAccountSettingResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccountSettings),
);
export const listControlAccountSettingsByLedger = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Any()]), Type.Tuple([Type.Any(), Type.Number()])]), result: Type.Array(ControlAccountSettingResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccountSettingsByLedger),
);
export const getControlAccountByLedger = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), Type.Any()]), Type.Tuple([Type.String(), Type.Any(), Type.Number()])]), result: Type.Union([ControlAccountResponseDto, Type.Null()]) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.getControlAccountByLedger),
);
export const listControlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccounts),
);
export const filterControlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.filterControlAccounts),
);
export const searchControlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.searchControlAccounts),
);
export const patchControlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), ControlAccountPatchRequestDto]), Type.Tuple([Type.String(), ControlAccountPatchRequestDto, Type.Number()])]), result: ControlAccountResponseDto },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.patchControlAccount),
);

export const operations = {
  getControlAccountCompanyApControlAccounts: getControlAccount,
  listControlAccountSettingsCompanyApControlAccounts: listControlAccountSettings,
  listControlAccountSettingsByLedgerCompanyApControlAccounts: listControlAccountSettingsByLedger,
  getControlAccountByLedgerCompanyApControlAccounts: getControlAccountByLedger,
  listControlAccountsCompanyApControlAccounts: listControlAccounts,
  filterControlAccountsCompanyApControlAccounts: filterControlAccounts,
  searchControlAccountsCompanyApControlAccounts: searchControlAccounts,
  patchControlAccountCompanyApControlAccounts: patchControlAccount,
} as const;
