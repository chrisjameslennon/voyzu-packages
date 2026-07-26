import type { InventoryItemResponseDto } from "./inventory-item.response.dto";

export type InventoryItemUpdateRequestDto = Omit<InventoryItemResponseDto, "id" | "item_code" | "status" | "hasPostings" | "audit">;
