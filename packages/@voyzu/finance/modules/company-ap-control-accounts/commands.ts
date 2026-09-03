import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ControlAccountPatchRequestDto, ControlAccountResponseDto, ControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/control-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";
const ControlAccountLedgerDto = Type.Union([Type.Literal("ACCOUNTS_PAYABLE"), Type.Literal("ACCOUNTS_RECEIVABLE")]);



export const getControlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([ControlAccountResponseDto, Type.Null()]) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.getControlAccount),
);
export const listControlAccountSettings = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(ControlAccountSettingResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccountSettings),
);
export const listControlAccountSettingsByLedger = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ControlAccountLedgerDto]), Type.Tuple([ControlAccountLedgerDto, Type.Number()])]), result: Type.Array(ControlAccountSettingResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccountSettingsByLedger),
);
export const getControlAccountByLedger = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), ControlAccountLedgerDto]), Type.Tuple([Type.String(), ControlAccountLedgerDto, Type.Number()])]), result: Type.Union([ControlAccountResponseDto, Type.Null()]) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.getControlAccountByLedger),
);
export const listControlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.listControlAccounts),
);
export const filterControlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.filterControlAccounts),
);
export const searchControlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(ControlAccountResponseDto) },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.searchControlAccounts),
);
export const patchControlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), ControlAccountPatchRequestDto]), Type.Tuple([Type.String(), ControlAccountPatchRequestDto, Type.Number()])]), result: ControlAccountResponseDto },
  () => import("../common/control-accounts/server/lib/control-account.service").then((module) => module.patchControlAccount),
);

export const commands = {
  getControlAccountCompanyApControlAccounts: getControlAccount,
  listControlAccountSettingsCompanyApControlAccounts: listControlAccountSettings,
  listControlAccountSettingsByLedgerCompanyApControlAccounts: listControlAccountSettingsByLedger,
  getControlAccountByLedgerCompanyApControlAccounts: getControlAccountByLedger,
  listControlAccountsCompanyApControlAccounts: listControlAccounts,
  filterControlAccountsCompanyApControlAccounts: filterControlAccounts,
  searchControlAccountsCompanyApControlAccounts: searchControlAccounts,
  patchControlAccountCompanyApControlAccounts: patchControlAccount,
} as const;
