import "server-only";

import * as service from "./server/lib/ice-cream-report.service";

function operation<TArgs extends unknown[], TResult>(serviceMethod: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => serviceMethod(...args);
}

export const getAllIceCreamsReport = operation(service.getAllIceCreamsReport);

export const operations = {
  getAllIceCreamsReport,
} as const;
