import type { AuditMetadataDto } from "../core";
import type { AccountType, GlAccountPointerReference, Status } from "../core";

export interface ControlAccountResponseDto {
  /** Business code of the control account. */
  code: string;
  /** Ledger this control account belongs to. */
  ledger: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
  /** Display name of the control account. */
  name: string;
  /** Unique numeric identifier of the linked GL account. */
  glAccountId: number;
  /** The GL account linked to this control account. */
  glAccount: {
    /** GL account business code. */
    code: string;
    /** GL account display name. */
    name: string;
    /** The accounting type of the GL account. */
    accountType: AccountType;
  } | null;
  /** Current lifecycle status of the control account. */
  status: Status;
  /** True when one or more posted journal headers include a line for this control account's linked GL account. */
  hasPostings: boolean;
  /** Company codes with posted journals for this setting. */
  companiesWithPostings: string[];
  /** GL account pointers that reference this control account. */
  linkedBy: GlAccountPointerReference[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
