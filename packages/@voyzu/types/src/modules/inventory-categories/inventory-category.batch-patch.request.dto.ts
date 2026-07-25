import type { InventoryCategoryPatchRequestDto } from "./inventory-category.patch.request.dto";

export interface InventoryCategoryBatchPatchRequestDto extends InventoryCategoryPatchRequestDto {
  code: string;
}
