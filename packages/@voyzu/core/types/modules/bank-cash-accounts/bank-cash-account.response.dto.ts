import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { AccountType, GlAccountPointerReference, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const BankCashAccountType = Type.Union([Type.Literal("BANK"), Type.Literal("CASH"), Type.Literal("OTHER")]);
export type BankCashAccountType = Type.Static<typeof BankCashAccountType>;

export const BankCashAccountLinkedByDto = GlAccountPointerReference;
export type BankCashAccountLinkedByDto = Type.Static<typeof BankCashAccountLinkedByDto>;

export const BankCashAccountResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  ledger: Type.Literal("BANK_CASH"),
  type: BankCashAccountType,
  glAccountId: PositiveId,
  glAccount: Type.Union([StrictObject({
    code: BusinessCode,
    name: NonBlankText,
    accountType: AccountType,
  }), Type.Null()]),
  bankName: Type.Optional(Type.Union([NonBlankText, Type.Null()])),
  bankBranchName: Type.Optional(Type.Union([NonBlankText, Type.Null()])),
  bankAccountIdentifier: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  cashAccountIdentifier: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  status: Status,
  hasPostings: Type.Boolean(),
  companiesWithPostings: Type.Array(Type.String()),
  linkedBy: Type.Array(BankCashAccountLinkedByDto),
  audit: AuditMetadataDto,
});
export type BankCashAccountResponseDto = Type.Static<typeof BankCashAccountResponseDto>;
