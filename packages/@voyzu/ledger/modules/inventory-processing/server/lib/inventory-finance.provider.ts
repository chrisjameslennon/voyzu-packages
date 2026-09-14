import type { ProcessInventoryMovementRequest } from "../../types/index";
import { processInventoryMovement as processMovement } from "./processing-rules-engine";

export async function processInventoryMovement(input: {
  organizationId: number;
  movement: ProcessInventoryMovementRequest;
}) {
  const activity = await processMovement(input.organizationId, input.movement);
  return {
    financeInventoryActivityId: activity.id,
    processingStatus: activity.processingStatus,
  };
}
