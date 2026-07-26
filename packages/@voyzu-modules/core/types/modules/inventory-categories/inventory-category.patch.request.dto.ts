import type { InventoryCategoryUpdateRequestDto } from "./inventory-category.update.request.dto";

export type InventoryCategoryPatchRequestDto = Partial<InventoryCategoryUpdateRequestDto> & {
  code?: string;
};
