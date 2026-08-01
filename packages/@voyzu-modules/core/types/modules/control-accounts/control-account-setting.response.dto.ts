import type { AccountType, GlAccountPointerReference, Status } from "@voyzu-modules/core/types/modules/core";

export interface ControlAccountSettingResponseDto {
  /** Engine-facing control account code. */
  code: string;
  /** Ledger this control account belongs to. */
  ledger: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
  /** Display name for this fixed control account role. */
  name: string;
  /** Supporting ledger group shown in the configuration screen. */
  supportingLedger: "Accounts Payable" | "Accounts Receivable" | "Tax Ledger";
  /** Required GL account type for this control account. */
  requiredAccountType: AccountType;
  /** Linked GL account ID when configured. */
  glAccountId: number | null;
  /** Linked GL account when configured. */
  glAccount: {
    code: string;
    name: string;
    accountType: AccountType;
  } | null;
  /** Current lifecycle status when the row exists. */
  status: Status | null;
  /** True when the linked control account has associated posted journal lines. */
  hasPostings: boolean;
  /** Company codes with posted journals for this setting. */
  companiesWithPostings: string[];
  /** GL account pointers that reference this control account. */
  linkedBy: GlAccountPointerReference[];
}
