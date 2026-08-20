import assert from "node:assert/strict";
import { test } from "node:test";

import { NextRequest } from "next/server";

import { inspectRawRequest } from "../../../modules/ugly/operations";

test("inspectRawRequest returns request metadata while redacting credentials", () => {
  const request = new NextRequest("https://example.test/ugly-package/raw-request-response?view=full", {
    method: "GET",
    headers: {
      authorization: "Bearer secret",
      cookie: "session=secret",
      "x-api-key": "secret-key",
      "x-visible": "visible-value",
    },
  });

  const result = inspectRawRequest(request);

  assert.equal(result.request.method, "GET");
  assert.equal(result.request.nextUrl.pathname, "/ugly-package/raw-request-response");
  assert.equal(result.request.nextUrl.search, "?view=full");
  assert.equal(result.request.headers.authorization, "[redacted]");
  assert.equal(result.request.headers["x-api-key"], "[redacted]");
  assert.equal(result.request.headers["x-visible"], "visible-value");
  assert.deepEqual(result.request.cookies, [{ name: "session", value: "[redacted]" }]);
  assert.equal(result.responseBody.message, "Hello from @voyzu/ugly-package");
  assert.ok(!Number.isNaN(Date.parse(result.responseBody.receivedAt)));
});
