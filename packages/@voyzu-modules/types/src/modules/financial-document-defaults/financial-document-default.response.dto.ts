import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { AccountType, GlAccountPointerReference, Status } from "@voyzu/types/modules";

export type FinancialDocumentDefaultTargetType = "GENERAL_LEDGER" | "BANK_CASH_ACCOUNT";
export type FinancialDocumentDefaultOverrideScope = "HEADER" | "LINE" | "HEADER_AND_LINE";

export interface FinancialDocumentDefaultResponseDto {
  /** Document processor code this row belongs to. */
  documentCode: string;
  /** Stable financial-document default slot code. */
  code: string;
  /** Display name for this default slot. */
  name: string;
  /** Whether this default resolves directly to GL or through Bank / Cash. */
  targetType: FinancialDocumentDefaultTargetType;
  /** GL account types allowed for this default slot. */
  allowedAccountTypes: AccountType[];
  /** Request property used to override this default. */
  overridePropertyName: string;
  /** Request level where this default can be overridden. */
  overrideScope: FinancialDocumentDefaultOverrideScope;
  /** Unique numeric identifier of the linked GL account. */
  glAccountId: number | null;
  /** First allowed account type, preserved for older list filters. */
  accountTypeCode: AccountType;
  /** The GL account linked to this posting code. */
  glAccount: {
    /** GL account business code. */
    code: string;
    /** GL account display name. */
    name: string;
    /** The accounting type of the GL account. */
    accountType: AccountType;
  } | null;
  /** True when this posting code resolves through a Bank / Cash control account. */
  isBankLinked: boolean;
  /** Bank / Cash control account backing this posting code, when applicable. */
  bankCashControlAccountId: number | null;
  bankCashControlAccount: {
    /** Bank / Cash control account code. */
    code: string;
    /** Bank / Cash account type. */
    type: string;
    /** GL account resolved by the Bank / Cash control account. */
    glAccountId: number;
    /** GL account business code. */
    glAccountCode: string;
    /** GL account display name. */
    glAccountName: string;
  } | null;
  /** Current lifecycle status of the financial-document-default binding. */
  status: Status;
  /** GL account pointers that reference this default. */
  linkedBy: GlAccountPointerReference[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
