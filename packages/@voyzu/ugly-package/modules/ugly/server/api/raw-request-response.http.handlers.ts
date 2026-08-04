import { type NextRequest, NextResponse } from "next/server";

const sensitiveHeader = /^(authorization|cookie|proxy-authorization|x-api-key)$/i;

function visibleHeaders(request: NextRequest) {
  return Object.fromEntries(
    [...request.headers.entries()].map(([name, value]) => [
      name,
      sensitiveHeader.test(name) ? "[redacted]" : value,
    ]),
  );
}

export async function handleRawRequestResponse(request: NextRequest): Promise<NextResponse> {
  const requestSnapshot = {
    method: request.method,
    url: request.url,
    nextUrl: {
      origin: request.nextUrl.origin,
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
    },
    headers: visibleHeaders(request),
    cookies: request.cookies.getAll().map(({ name }) => ({ name, value: "[redacted]" })),
  };
  const responseBody = {
    message: "Hello from @voyzu/ugly-package",
    receivedAt: new Date().toISOString(),
  };
  const response = NextResponse.json({ request: requestSnapshot, responseBody });

  response.headers.set("x-ugly-package-demo", "raw-request-response");
  response.cookies.set("ugly-package-demo", "the-package-set-this", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
