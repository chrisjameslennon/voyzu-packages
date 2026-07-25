import type { InventoryItemResponseDto } from "./inventory-item.response.dto";

export type InventoryItemCreateRequestDto = Omit<InventoryItemResponseDto, "id" | "status" | "hasPostings" | "audit">;
