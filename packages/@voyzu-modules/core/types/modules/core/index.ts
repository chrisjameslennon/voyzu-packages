export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export type DrCr = "DR" | "CR";

export type EntryType = "DEBIT" | "CREDIT";

export type Ledger =
  | "ACCOUNTS_PAYABLE"
  | "ACCOUNTS_RECEIVABLE"
  | "GENERAL"
  | "TAX"
  | "INVENTORY"
  | "BANK_CASH";

export type GlAccountPointerName =
  | "Accounts Payable Control Accounts"
  | "Accounts Receivable Control Accounts"
  | "Bank / Cash Accounts"
  | "Tax Control Accounts"
  | "Inventory Control Accounts"
  | "Financial Document Defaults"
  | "Item Posting Profiles";

export interface OperationReference {
  type: string;
  code: string;
}

export interface GlAccountPointerReference extends OperationReference {
  type: GlAccountPointerName;
  code: string;
}

export type {
  ActorType,
  AuditMetadataDto,
  AuditStampDto,
  AuditUserDto,
  OperationBlocker,
  Status,
} from "@voyzu/types/modules/core";
