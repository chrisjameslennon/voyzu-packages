import "server-only";

import * as service from "./server/lib/raw-request-response.service";

function operation<TArgs extends unknown[], TResult>(serviceMethod: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => serviceMethod(...args);
}

export const inspectRawRequest = operation(service.inspectRawRequest);

export const operations = {
  inspectRawRequest,
} as const;
