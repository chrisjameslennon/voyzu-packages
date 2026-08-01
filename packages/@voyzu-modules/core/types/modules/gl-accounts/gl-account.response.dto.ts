import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";
import type { AccountType, GlAccountPointerReference } from "@voyzu-modules/core/types/modules/core";

export type GlAccountStatus = "ACTIVE" | "INACTIVE";

export type GlAccountLinkedByDto = GlAccountPointerReference;

export interface GlAccountResponseDto {
  /** Unique numeric identifier of the GL account. */
  id: number;
  /** Business code of the GL account (up to 14 characters). */
  code: string;
  /** Display name of the GL account. */
  name: string;
  /** The accounting type of this GL account (e.g. ASSET, LIABILITY). */
  accountType: AccountType;
  /** ID of the GL account category this account belongs to. */
  accountCategoryId?: number;
  /** The category this account belongs to. */
  category?: {
    /** Category business code. */
    code: string;
    /** Category display name. */
    name: string;
  };
  /** Current lifecycle status of the GL account. */
  status: GlAccountStatus;
  /** Control account records that currently link to this GL account. */
  linkedBy: GlAccountLinkedByDto[];
  /** True when one or more posted journal headers include a line for this GL account. */
  hasPostings: boolean;
  /** Company codes with posted journals for this setting. */
  companiesWithPostings: string[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
