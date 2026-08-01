import type { AuditMetadataDto } from "@voyzu-modules/core/types/modules/core";

export interface ApCounterpartyResponseDto {
  id: number;
  companyId: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  countryCode: string | null;
  countryName: string | null;
  taxRegionOrProvince: string | null;
  /** Audit metadata for creation and latest update. */
  audit: AuditMetadataDto;
}
