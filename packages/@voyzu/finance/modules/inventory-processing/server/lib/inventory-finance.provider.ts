import type { ProcessInventoryMovementRequest } from "../../types/index";
import { processInventoryMovement } from "./processing-rules-engine";

export async function processInventoryMovementCapability(input: {
  organizationId: number;
  movement: ProcessInventoryMovementRequest;
}) {
  const activity = await processInventoryMovement(input.organizationId, input.movement);
  return {
    financeInventoryActivityId: activity.id,
    processingStatus: activity.processingStatus,
  };
}
