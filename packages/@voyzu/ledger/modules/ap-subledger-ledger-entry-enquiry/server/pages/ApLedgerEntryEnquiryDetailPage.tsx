import { type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { ApLedgerEntryDetailPage } from "../../../ap-subledger-ledger-entries/server/index";

export function ApLedgerEntryEnquiryDetailPage({ context }: PageProps) {
  return (
    <ApLedgerEntryDetailPage
      context={context}
    />
  );
}
