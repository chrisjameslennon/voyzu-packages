import "server-only";

import { ApLedgerEntryDetailPage } from "@voyzu/modules/ap-subledger-ledger-entries/server";

export function ApLedgerEntryEnquiryDetailPage({ code }: { code?: string }) {
  return <ApLedgerEntryDetailPage code={code} />;
}
