import "server-only";

import { inspectRawRequest as inspectRawRequestService } from "./server/lib/raw-request-response.service";

export const inspectRawRequest = (
  ...args: Parameters<typeof inspectRawRequestService>
): ReturnType<typeof inspectRawRequestService> => inspectRawRequestService(...args);

export const operations = {
  inspectRawRequest,
} as const;
