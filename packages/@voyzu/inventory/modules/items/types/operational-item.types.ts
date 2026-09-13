import Type, { type Static } from "typebox";
import { InventoryItemOperationalSchema } from "@voyzu/types/business-objects/inventory-item-operational";

export const OperationalItemDto = Type.Object({
  ...InventoryItemOperationalSchema.properties,
  // Preserve this DTO's existing numeric ID and additional-property policy.
  id: Type.Number(),
});

export type OperationalItemDto = Static<typeof OperationalItemDto>;
