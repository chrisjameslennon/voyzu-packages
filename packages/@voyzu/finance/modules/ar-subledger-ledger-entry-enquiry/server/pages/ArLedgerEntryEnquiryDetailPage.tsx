import { type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { ArLedgerEntryDetailPage } from "../../../ar-subledger-ledger-entries/server/index";

export function ArLedgerEntryEnquiryDetailPage({ context }: PageProps) {
  return (
    <ArLedgerEntryDetailPage
      context={context}
    />
  );
}
