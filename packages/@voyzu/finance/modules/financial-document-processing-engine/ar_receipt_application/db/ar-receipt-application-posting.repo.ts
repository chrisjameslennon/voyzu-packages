import type { DbExecutor } from "@voyzu/capability/db";

export class ArReceiptApplicationPostingRepo {
  constructor(readonly db: DbExecutor) { }
}
