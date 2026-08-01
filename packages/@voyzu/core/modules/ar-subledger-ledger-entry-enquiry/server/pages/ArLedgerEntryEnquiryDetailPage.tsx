import "server-only";

import { ArLedgerEntryDetailPage } from "@voyzu/core/ar-subledger-ledger-entries/server";

export function ArLedgerEntryEnquiryDetailPage({ code }: { code?: string }) {
  return <ArLedgerEntryDetailPage code={code} />;
}
