import type { NextRequest } from "next/server";
import { ok, serverError } from "@voyzu/capability/http";

import { getAllTemplatesReport } from "../lib/template-report.service";

export async function handleAllTemplatesReport(_request: NextRequest) {
  try {
    return ok(await getAllTemplatesReport());
  } catch (error) {
    return serverError(error);
  }
}
