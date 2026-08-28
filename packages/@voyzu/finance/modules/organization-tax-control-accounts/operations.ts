import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { TaxControlAccountPatchRequestDto, TaxControlAccountResponseDto } from "@voyzu/finance/types/modules/tax-control-accounts";



export const listTaxControlAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(TaxControlAccountResponseDto) },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.listTaxControlAccounts),
);
export const getTaxControlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([TaxControlAccountResponseDto, Type.Null()]) },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.getTaxControlAccount),
);
export const patchTaxControlAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), TaxControlAccountPatchRequestDto]), Type.Tuple([Type.String(), TaxControlAccountPatchRequestDto, Type.Number()])]), result: TaxControlAccountResponseDto },
  () => import("../common/tax-control-accounts/server/lib/tax-control-account.service").then((module) => module.patchTaxControlAccount),
);

export const operations = {
  listTaxControlAccountsOrganizationTaxControlAccounts: listTaxControlAccounts,
  getTaxControlAccountOrganizationTaxControlAccounts: getTaxControlAccount,
  patchTaxControlAccountOrganizationTaxControlAccounts: patchTaxControlAccount,
} as const;
