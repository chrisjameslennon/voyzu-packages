import type { NextRequest } from "next/server";

import type { RawRequestResponseDto } from "@voyzu/ugly-package/types";

const sensitiveHeader = /^(authorization|cookie|proxy-authorization|x-api-key)$/i;

function visibleHeaders(request: NextRequest): Record<string, string> {
  return Object.fromEntries(
    [...request.headers.entries()].map(([name, value]) => [
      name,
      sensitiveHeader.test(name) ? "[redacted]" : value,
    ]),
  );
}

export function inspectRawRequest(request: NextRequest): RawRequestResponseDto {
  return {
    request: {
      method: request.method,
      url: request.url,
      nextUrl: {
        origin: request.nextUrl.origin,
        pathname: request.nextUrl.pathname,
        search: request.nextUrl.search,
      },
      headers: visibleHeaders(request),
      cookies: request.cookies.getAll().map(({ name }) => ({ name, value: "[redacted]" })),
    },
    responseBody: {
      message: "Hello from @voyzu/ugly-package",
      receivedAt: new Date().toISOString(),
    },
  };
}
