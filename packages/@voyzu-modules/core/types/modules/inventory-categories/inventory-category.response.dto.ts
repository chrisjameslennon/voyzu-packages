import type { AuditMetadataDto, OperationReference } from "@voyzu-modules/core/types/modules/core";

export interface InventoryCategoryResponseDto {
  id: number;
  code: string;
  name: string;
  description: string;
  posting_profile_code: string;
  status: "ACTIVE" | "INACTIVE";
  numberOfItems: {
    total: number;
    active: number;
    inactive: number;
  };
  linkedBy: OperationReference[];
  audit: AuditMetadataDto;
}
