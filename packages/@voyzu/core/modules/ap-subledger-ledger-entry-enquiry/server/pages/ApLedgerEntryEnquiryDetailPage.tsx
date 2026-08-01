import "server-only";

import { ApLedgerEntryDetailPage } from "@voyzu/core/ap-subledger-ledger-entries/server";

export function ApLedgerEntryEnquiryDetailPage({ code }: { code?: string }) {
  return <ApLedgerEntryDetailPage code={code} />;
}
