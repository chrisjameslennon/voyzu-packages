import type { NextRequest } from "next/server";
import { ok, serverError } from "@voyzu/capability/http";

import { getAllIceCreamsReport } from "../lib/ice-cream-report.service";

export async function handleAllIceCreamsReport(_request: NextRequest) {
  try {
    return ok(await getAllIceCreamsReport());
  } catch (error) {
    return serverError(error);
  }
}
