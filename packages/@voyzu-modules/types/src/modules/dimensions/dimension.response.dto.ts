import type { AuditMetadataDto } from "@voyzu/types/modules/core";
import type { DimensionValueResponseDto } from "./dimension-value.response.dto";

export type DimensionStatus = "ACTIVE" | "INACTIVE";

export interface DimensionResponseDto {
  /** Unique numeric identifier of the dimension. */
  id: number;
  /** Business code of the dimension (up to 14 characters). */
  code: string;
  /** Display name of the dimension. */
  name: string;
  /** Current lifecycle status of the dimension. */
  status: DimensionStatus;
  /** The values (members) belonging to this dimension. */
  values?: DimensionValueResponseDto[];
  /** True when one or more posted journal headers include a line dimension for this dimension. */
  hasPostings: boolean;
  /** Company codes with posted journals for this setting. */
  companiesWithPostings: string[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
