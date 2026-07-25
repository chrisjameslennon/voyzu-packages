import "server-only";

import { ArLedgerEntryDetailPage } from "@voyzu/modules/ar-subledger-ledger-entries/server";

export function ArLedgerEntryEnquiryDetailPage({ code }: { code?: string }) {
  return <ArLedgerEntryDetailPage code={code} />;
}
