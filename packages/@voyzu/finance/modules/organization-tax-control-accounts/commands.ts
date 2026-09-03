import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { TaxControlAccountPatchRequestDto, TaxControlAccountResponseDto } from "@voyzu/finance/types/modules/tax-control-accounts";



export const listTaxControlAccounts = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(TaxControlAccountResponseDto) },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.listTaxControlAccounts),
);
export const getTaxControlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([TaxControlAccountResponseDto, Type.Null()]) },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.getTaxControlAccount),
);
export const patchTaxControlAccount = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), TaxControlAccountPatchRequestDto]), Type.Tuple([Type.String(), TaxControlAccountPatchRequestDto, Type.Number()])]), result: TaxControlAccountResponseDto },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.patchTaxControlAccount),
);

export const commands = {
  listTaxControlAccountsOrganizationTaxControlAccounts: listTaxControlAccounts,
  getTaxControlAccountOrganizationTaxControlAccounts: getTaxControlAccount,
  patchTaxControlAccountOrganizationTaxControlAccounts: patchTaxControlAccount,
} as const;
