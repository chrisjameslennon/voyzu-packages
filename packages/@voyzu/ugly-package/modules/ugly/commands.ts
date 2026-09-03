import "server-only";

import { command } from "@voyzu/capability/commands";
import { RawRequestResponseDto } from "@voyzu/ugly-package/types";
import Type from "typebox";

export const inspectRawRequest = command.defineLazy(
  { parameters: Type.Tuple([Type.Any()]), result: RawRequestResponseDto },
  () => import("./server/lib/raw-request-response.service")
    .then((module) => module.inspectRawRequest),
);

export const commands = {
  inspectRawRequest,
} as const;
