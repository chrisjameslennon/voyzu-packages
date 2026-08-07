import "server-only";

import { ApLedgerEntryDetailPage } from "@voyzu/core/ap-subledger-ledger-entries/server";

export function ApLedgerEntryEnquiryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  return (
    <ApLedgerEntryDetailPage
      code={code}
      surface={surface}
      fallbackHref="/finance/subledgers/ap/ledger-entry-enquiry"
      returnSource="apLedgerEntryEnquiry"
    />
  );
}
