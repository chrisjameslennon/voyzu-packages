import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { BankCashAccountBatchPatchRequestDto, BankCashAccountBatchUpdateRequestDto, BankCashAccountCreateRequestDto, BankCashAccountPatchRequestDto, BankCashAccountResponseDto, BankCashAccountUpdateRequestDto } from "@voyzu/finance/types/modules/bank-cash-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";



export const listBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([]), Type.Tuple([Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.listBankCashAccounts),
);
export const filterBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Filter)]), Type.Tuple([Type.Array(Filter), ListOptions]), Type.Tuple([Type.Array(Filter), ListOptions, Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.filterBankCashAccounts),
);
export const searchBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), ListOptions]), Type.Tuple([Type.String(), ListOptions, Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.searchBankCashAccounts),
);
export const getBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Union([BankCashAccountResponseDto, Type.Null()]) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.getBankCashAccount),
);
export const createBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([BankCashAccountCreateRequestDto]), Type.Tuple([BankCashAccountCreateRequestDto, Type.Number()])]), result: BankCashAccountResponseDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.createBankCashAccount),
);
export const patchBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), BankCashAccountPatchRequestDto]), Type.Tuple([Type.String(), BankCashAccountPatchRequestDto, Type.Number()])]), result: BankCashAccountResponseDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.patchBankCashAccount),
);
export const updateBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String(), BankCashAccountUpdateRequestDto]), Type.Tuple([Type.String(), BankCashAccountUpdateRequestDto, Type.Number()])]), result: BankCashAccountResponseDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.updateBankCashAccount),
);
export const deleteBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.deleteBankCashAccount),
);
export const batchGetBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.batchGetBankCashAccounts),
);
export const batchCreateBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(BankCashAccountCreateRequestDto)]), Type.Tuple([Type.Array(BankCashAccountCreateRequestDto), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.batchCreateBankCashAccounts),
);
export const batchUpdateBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(BankCashAccountBatchUpdateRequestDto)]), Type.Tuple([Type.Array(BankCashAccountBatchUpdateRequestDto), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.batchUpdateBankCashAccounts),
);
export const batchPatchBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(BankCashAccountBatchPatchRequestDto)]), Type.Tuple([Type.Array(BankCashAccountBatchPatchRequestDto), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.batchPatchBankCashAccounts),
);
export const batchDeleteBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Undefined() },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.batchDeleteBankCashAccounts),
);
export const activateBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: BankCashAccountResponseDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.activateBankCashAccount),
);
export const deactivateBankCashAccount = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.String()]), Type.Tuple([Type.String(), Type.Number()])]), result: BankCashAccountResponseDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.deactivateBankCashAccount),
);
export const activateBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.activateBankCashAccounts),
);
export const deactivateBankCashAccounts = platformOperation.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Array(Type.String())]), Type.Tuple([Type.Array(Type.String()), Type.Number()])]), result: Type.Array(BankCashAccountResponseDto) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.deactivateBankCashAccounts),
);
export const resolveBankCashDetails = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.Union([Type.Any(), Type.Null(), Type.Undefined()])]), result: Type.Union([Type.Any(), Type.Null()]) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.resolveBankCashDetails),
);
export const toJournalBankCashFields = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Union([Type.Any(), Type.Null(), Type.Undefined()])]), result: Type.Any() },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.toJournalBankCashFields),
);

export const operations = {
  listBankCashAccounts,
  filterBankCashAccounts,
  searchBankCashAccounts,
  getBankCashAccount,
  createBankCashAccount,
  patchBankCashAccount,
  updateBankCashAccount,
  deleteBankCashAccount,
  batchGetBankCashAccounts,
  batchCreateBankCashAccounts,
  batchUpdateBankCashAccounts,
  batchPatchBankCashAccounts,
  batchDeleteBankCashAccounts,
  activateBankCashAccount,
  deactivateBankCashAccount,
  activateBankCashAccounts,
  deactivateBankCashAccounts,
  resolveBankCashDetails,
  toJournalBankCashFields,
} as const;
