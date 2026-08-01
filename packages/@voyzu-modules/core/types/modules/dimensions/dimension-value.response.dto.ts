import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";

export type DimensionValueStatus = "ACTIVE" | "INACTIVE";

export interface DimensionValueResponseDto {
  /** Unique numeric identifier of the dimension value. */
  id: number;
  /** Unique numeric identifier of the parent dimension. */
  dimensionId: number;
  /** Display name of the dimension value. */
  name: string;
  /** Current lifecycle status of the dimension value. */
  status: DimensionValueStatus;
  /** True when one or more posted journal headers include this dimension value. */
  hasPostings: boolean;
  /** Company codes with posted journals that use this value. */
  companiesWithPostings: string[];
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
