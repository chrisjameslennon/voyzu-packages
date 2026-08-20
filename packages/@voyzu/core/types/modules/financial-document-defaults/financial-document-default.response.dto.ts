import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { AccountType, GlAccountPointerReference, Status } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const FinancialDocumentDefaultTargetType = Type.Union([Type.Literal("GENERAL_LEDGER"), Type.Literal("BANK_CASH_ACCOUNT")]);
export type FinancialDocumentDefaultTargetType = Type.Static<typeof FinancialDocumentDefaultTargetType>;
export const FinancialDocumentDefaultOverrideScope = Type.Union([Type.Literal("HEADER"), Type.Literal("LINE"), Type.Literal("HEADER_AND_LINE")]);
export type FinancialDocumentDefaultOverrideScope = Type.Static<typeof FinancialDocumentDefaultOverrideScope>;

export const FinancialDocumentDefaultResponseDto = StrictObject({
  documentCode: BusinessCode,
  code: BusinessCode,
  name: NonBlankText,
  targetType: FinancialDocumentDefaultTargetType,
  allowedAccountTypes: Type.Array(AccountType),
  overridePropertyName: NonBlankText,
  overrideScope: FinancialDocumentDefaultOverrideScope,
  glAccountId: Type.Union([PositiveId, Type.Null()]),
  accountTypeCode: AccountType,
  glAccount: Type.Union([StrictObject({
    code: BusinessCode,
    name: NonBlankText,
    accountType: AccountType,
  }), Type.Null()]),
  isBankLinked: Type.Boolean({ description: "True when this posting code resolves through a Bank / Cash control account." }),
  bankCashControlAccountId: Type.Union([PositiveId, Type.Null()]),
  bankCashControlAccount: Type.Union([StrictObject({
    code: BusinessCode,
    type: Type.String({ description: "Bank / Cash account type." }),
    glAccountId: PositiveId,
    glAccountCode: BusinessCode,
    glAccountName: NonBlankText,
  }), Type.Null()]),
  status: Status,
  linkedBy: Type.Array(GlAccountPointerReference),
  audit: AuditMetadataDto,
});
export type FinancialDocumentDefaultResponseDto = Type.Static<typeof FinancialDocumentDefaultResponseDto>;
