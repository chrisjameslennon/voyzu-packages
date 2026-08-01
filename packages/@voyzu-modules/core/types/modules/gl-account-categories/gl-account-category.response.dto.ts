import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";
import type { AccountType, OperationReference, Status } from "@voyzu-modules/core/types/modules/core";

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
