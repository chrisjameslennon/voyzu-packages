import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { InventoryControlAccountPatchRequestDto, InventoryControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/inventory-control-accounts";



export const listInventoryControlAccountSettings = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(InventoryControlAccountSettingResponseDto) },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.listInventoryControlAccountSettings),
);
export const getInventoryControlAccountSetting = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([InventoryControlAccountSettingResponseDto, Type.Null()]) },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.getInventoryControlAccountSetting),
);
export const patchInventoryControlAccountSetting = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), InventoryControlAccountPatchRequestDto]), Type.Tuple([Type.String(), InventoryControlAccountPatchRequestDto, Type.Number()])]), result: InventoryControlAccountSettingResponseDto },
  () => import("../common/inventory-control-accounts/server/lib/inventory-control-account.service").then((module) => module.patchInventoryControlAccountSetting),
);

export const operations = {
  listInventoryControlAccountSettings,
  getInventoryControlAccountSetting,
  patchInventoryControlAccountSetting,
} as const;
