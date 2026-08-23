import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DrCr } from "@voyzu/finance/types/modules/core";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const BankCashMovementLineDto = StrictObject({
  id: Type.String(),
  journalId: PositiveId,
  journalCode: BusinessCode,
  documentTypeCode: BusinessCode,
  documentTypeLabel: Type.String(),
  documentId: Type.String(),
  postingDate: IsoDate,
  documentDate: IsoDate,
  bankCashCode: BusinessCode,
  bankCashType: Type.String(),
  bankCashGlAccountCode: BusinessCode,
  bankCashGlAccountName: NonBlankText,
  txId: Type.Union([Type.String(), Type.Null()]),
  txCode: Type.Union([BusinessCode, Type.Null()]),
  txRef: Type.Union([Type.String(), Type.Null()]),
  txDetails: Type.Union([Type.String(), Type.Null()]),
  paymentRef: Type.Union([Type.String(), Type.Null()]),
  drCr: DrCr,
  amount: Type.Number(),
});
export type BankCashMovementLineDto = Type.Static<typeof BankCashMovementLineDto>;

export const BankCashMovementResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  bankCashFilter: StrictObject({
    code: Type.Union([BusinessCode, Type.Null()]),
    label: Type.String(),
  }),
  lines: Type.Array(BankCashMovementLineDto),
  trialBalanceReconciled: Type.Boolean(),
});
export type BankCashMovementResponseDto = Type.Static<typeof BankCashMovementResponseDto>;
