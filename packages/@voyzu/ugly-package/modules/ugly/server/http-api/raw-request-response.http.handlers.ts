import { type NextRequest, NextResponse } from "next/server";

import { inspectRawRequest } from "../lib/raw-request-response.service";

export async function handleRawRequestResponse(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(inspectRawRequest(request));

  response.headers.set("x-ugly-package-demo", "raw-request-response");
  response.cookies.set("ugly-package-demo", "the-package-set-this", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
