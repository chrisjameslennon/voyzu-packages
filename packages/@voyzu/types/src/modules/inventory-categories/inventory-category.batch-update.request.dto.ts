import type { InventoryCategoryUpdateRequestDto } from "./inventory-category.update.request.dto";

export interface InventoryCategoryBatchUpdateRequestDto extends InventoryCategoryUpdateRequestDto {
  code: string;
}
