import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { AccountType, GlAccountPointerReference, Status } from "@voyzu/types/modules/core";

export type BankCashAccountType = "BANK" | "CASH" | "OTHER";

export type BankCashAccountLinkedByDto = GlAccountPointerReference;

export interface BankCashAccountResponseDto {
  id: number;
  code: string;
  ledger: "BANK_CASH";
  type: BankCashAccountType;
  glAccountId: number;
  glAccount: {
    code: string;
    name: string;
    accountType: AccountType;
  } | null;
  bankName?: string | null;
  bankBranchName?: string | null;
  bankAccountIdentifier?: string | null;
  cashAccountIdentifier?: string | null;
  status: Status;
  hasPostings: boolean;
  companiesWithPostings: string[];
  linkedBy: BankCashAccountLinkedByDto[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
