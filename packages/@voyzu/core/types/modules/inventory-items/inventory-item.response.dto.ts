import type { AuditMetadataDto } from "@voyzu/core/types/modules/core";

export interface InventoryItemResponseDto {
  id: number;
  item_code: string;
  item_name: string;
  description: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  category_code: string;
  unit_code: string;
  status: "ACTIVE" | "INACTIVE";
  hasPostings: boolean;
  quantity_on_hand_derived: number | null;
  book_value_derived: number | null;
  avg_unit_book_value_derived: number | null;
  audit: AuditMetadataDto;
}
