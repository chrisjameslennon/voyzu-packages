import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType, GlAccountPointerReference, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ControlAccountSettingResponseDto = StrictObject({
  code: BusinessCode,
  ledger: Type.Union([Type.Literal("ACCOUNTS_RECEIVABLE"), Type.Literal("ACCOUNTS_PAYABLE")]),
  name: NonBlankText,
  supportingLedger: Type.Union([Type.Literal("Accounts Payable"), Type.Literal("Accounts Receivable"), Type.Literal("Tax Ledger")]),
  requiredAccountType: AccountType,
  glAccountId: Type.Union([PositiveId, Type.Null()]),
  glAccount: Type.Union([StrictObject({
    code: BusinessCode,
    name: NonBlankText,
    accountType: AccountType,
  }), Type.Null()]),
  status: Type.Union([Status, Type.Null()]),
  hasPostings: Type.Boolean({ description: "True when the linked control account has associated posted journal lines." }),
  companiesWithPostings: Type.Array(Type.String()),
  linkedBy: Type.Array(GlAccountPointerReference),
});
export type ControlAccountSettingResponseDto = Type.Static<typeof ControlAccountSettingResponseDto>;
