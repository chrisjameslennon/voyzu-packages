import type { DbExecutor } from "@voyzu/capability/db";

export class ArReceiptPostingRepo {
  constructor(readonly db: DbExecutor) { }
}
