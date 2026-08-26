import "server-only";

import { operation } from "@voyzu/capability/operations";
import { RawRequestResponseDto } from "@voyzu/ugly-package/types";
import Type from "typebox";

export const inspectRawRequest = operation.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: RawRequestResponseDto },
  () => import("./server/lib/raw-request-response.service")
    .then((module) => module.inspectRawRequest),
);

export const operations = {
  inspectRawRequest,
} as const;
