import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { BankCashAccountBatchPatchRequestDto, BankCashAccountBatchUpdateRequestDto, BankCashAccountCreateRequestDto, BankCashAccountPatchRequestDto, BankCashAccountResponseDto, BankCashAccountUpdateRequestDto } from "@voyzu/finance/types/modules/bank-cash-accounts";
import { Filter, ListOptions } from "@voyzu/types/params";
import { BankCashDetailsRequestDto, BankCashJournalDetailsDto } from "@voyzu/finance/types/modules/financial-document-processing-engine";

const OptionalBankCashDetailsDto = Type.Union([BankCashDetailsRequestDto, Type.Null(), Type.Undefined()]);
const OptionalBankCashJournalDetailsDto = Type.Union([BankCashJournalDetailsDto, Type.Null(), Type.Undefined()]);
const JournalBankCashFieldsDto = Type.Partial(Type.Object({
  bank_cash_account_id: Type.Number(), bank_cash_code: Type.String(), bank_cash_type: Type.String(),
  bank_cash_gl_account_id: Type.Number(), bank_cash_gl_account_code: Type.String(), bank_cash_gl_account_name: Type.String(),
  bank_cash_bank_name: Type.Union([Type.String(), Type.Null()]), bank_cash_bank_branch_name: Type.Union([Type.String(), Type.Null()]),
  bank_cash_account_identifier: Type.Union([Type.String(), Type.Null()]), bank_cash_cash_account_identifier: Type.Union([Type.String(), Type.Null()]),
  bank_cash_tx_id: Type.Union([Type.String(), Type.Null()]), bank_cash_tx_code: Type.Union([Type.String(), Type.Null()]),
  bank_cash_tx_ref: Type.Union([Type.String(), Type.Null()]), bank_cash_tx_details: Type.Union([Type.String(), Type.Null()]),
  bank_cash_payment_ref: Type.Union([Type.String(), Type.Null()]),
}));



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
  { parameters: Type.Tuple([Type.Number(), Type.String(), OptionalBankCashDetailsDto]), result: Type.Union([BankCashJournalDetailsDto, Type.Null()]) },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.resolveBankCashDetails),
);
export const toJournalBankCashFields = platformOperation.defineLazy(
  { parameters: Type.Tuple([OptionalBankCashJournalDetailsDto]), result: JournalBankCashFieldsDto },
  () => import("../common/bank-cash-accounts/server/lib/bank-cash-account.service").then((module) => module.toJournalBankCashFields),
);

export const operations = {
  listBankCashAccountsCompanyBankCashAccounts: listBankCashAccounts,
  filterBankCashAccountsCompanyBankCashAccounts: filterBankCashAccounts,
  searchBankCashAccountsCompanyBankCashAccounts: searchBankCashAccounts,
  getBankCashAccountCompanyBankCashAccounts: getBankCashAccount,
  createBankCashAccountCompanyBankCashAccounts: createBankCashAccount,
  patchBankCashAccountCompanyBankCashAccounts: patchBankCashAccount,
  updateBankCashAccountCompanyBankCashAccounts: updateBankCashAccount,
  deleteBankCashAccountCompanyBankCashAccounts: deleteBankCashAccount,
  batchGetBankCashAccountsCompanyBankCashAccounts: batchGetBankCashAccounts,
  batchCreateBankCashAccountsCompanyBankCashAccounts: batchCreateBankCashAccounts,
  batchUpdateBankCashAccountsCompanyBankCashAccounts: batchUpdateBankCashAccounts,
  batchPatchBankCashAccountsCompanyBankCashAccounts: batchPatchBankCashAccounts,
  batchDeleteBankCashAccountsCompanyBankCashAccounts: batchDeleteBankCashAccounts,
  activateBankCashAccountCompanyBankCashAccounts: activateBankCashAccount,
  deactivateBankCashAccountCompanyBankCashAccounts: deactivateBankCashAccount,
  activateBankCashAccountsCompanyBankCashAccounts: activateBankCashAccounts,
  deactivateBankCashAccountsCompanyBankCashAccounts: deactivateBankCashAccounts,
  resolveBankCashDetailsCompanyBankCashAccounts: resolveBankCashDetails,
  toJournalBankCashFieldsCompanyBankCashAccounts: toJournalBankCashFields,
} as const;
