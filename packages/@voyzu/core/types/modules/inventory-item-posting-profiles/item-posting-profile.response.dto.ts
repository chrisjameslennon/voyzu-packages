import type { AuditMetadataDto, OperationReference } from "@voyzu/core/types/modules/core";

export interface ItemPostingProfileGlRefDto {
  code: string;
  name: string;
}

export interface ItemPostingProfileResponseDto {
  id: number;
  profile_code: string;
  profile_name: string;
  description: string;
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  revenue_code: ItemPostingProfileGlRefDto | null;
  cogs_code: ItemPostingProfileGlRefDto | null;
  purchase_expense_code: ItemPostingProfileGlRefDto | null;
  consumption_code: ItemPostingProfileGlRefDto | null;
  adjustment_gain_code: ItemPostingProfileGlRefDto | null;
  adjustment_loss_code: ItemPostingProfileGlRefDto | null;
  status: "ACTIVE" | "INACTIVE";
  linkedBy: OperationReference[];
  audit: AuditMetadataDto;
}
