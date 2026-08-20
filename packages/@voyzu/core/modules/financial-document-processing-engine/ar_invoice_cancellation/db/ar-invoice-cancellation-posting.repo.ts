import type { DbExecutor } from "@voyzu/capability/db";

export class ArInvoiceCancellationPostingRepo {
  constructor(readonly db: DbExecutor) { }
}
