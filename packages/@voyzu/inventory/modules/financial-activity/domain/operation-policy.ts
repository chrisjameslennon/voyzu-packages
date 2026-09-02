export interface OperationBlocker {
  code: string;
  message: string;
}

// Processing is deliberately idempotent so consumers can safely retry ingestion.
export function MarkProcessed(): OperationBlocker[] {
  return [];
}
