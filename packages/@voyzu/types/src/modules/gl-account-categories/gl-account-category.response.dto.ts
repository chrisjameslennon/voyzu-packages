import type { AuditMetadataDto } from "../core";
import type { AccountType, OperationReference, Status } from "../core";

export interface GlAccountCategoryResponseDto {
  id: number;
  code: string;
  name: string;
  accountType: AccountType;
  sequence: number;
  status: Status;
  hasPostings: boolean;
  companiesWithPostings: string[];
  /** GL accounts that use this reporting category. */
  linkedBy: OperationReference[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
