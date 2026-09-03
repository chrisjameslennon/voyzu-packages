import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { InventoryControlAccountPatchRequestDto, InventoryControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/inventory-control-accounts";



export const listInventoryControlAccountSettings = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(InventoryControlAccountSettingResponseDto) },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.listInventoryControlAccountSettings),
);
export const getInventoryControlAccountSetting = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([InventoryControlAccountSettingResponseDto, Type.Null()]) },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.getInventoryControlAccountSetting),
);
export const patchInventoryControlAccountSetting = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), InventoryControlAccountPatchRequestDto]), Type.Tuple([Type.String(), InventoryControlAccountPatchRequestDto, Type.Number()])]), result: InventoryControlAccountSettingResponseDto },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.patchInventoryControlAccountSetting),
);

export const commands = {
  listInventoryControlAccountSettingsCompanyInventoryControlAccounts: listInventoryControlAccountSettings,
  getInventoryControlAccountSettingCompanyInventoryControlAccounts: getInventoryControlAccountSetting,
  patchInventoryControlAccountSettingCompanyInventoryControlAccounts: patchInventoryControlAccountSetting,
} as const;
