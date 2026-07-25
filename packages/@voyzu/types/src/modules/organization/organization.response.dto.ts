import type { AuditMetadataDto } from "../core";
import type { Status } from "../core";

export interface OrganizationResponseDto {
  /** Unique numeric identifier for the organization record. */
  id: number;
  /** Business code of the organization. */
  code: string;
  /** Display name of the organization. */
  organizationName: string;
  /** Current lifecycle status of the organization. Defaults to ACTIVE and cannot be changed through the API. */
  status: Status;
  /** True when one or more posted journal headers exist for any company in this organization. */
  hasPostings: boolean;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
