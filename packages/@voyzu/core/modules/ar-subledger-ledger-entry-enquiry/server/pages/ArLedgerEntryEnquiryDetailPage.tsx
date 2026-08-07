import "server-only";

import { ArLedgerEntryDetailPage } from "@voyzu/core/ar-subledger-ledger-entries/server";

export function ArLedgerEntryEnquiryDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { searchParams?: Record<string, string>; unframed?: boolean };
}) {
  return (
    <ArLedgerEntryDetailPage
      code={code}
      surface={surface}
      fallbackHref="/finance/subledgers/ar/ledger-entry-enquiry"
      returnSource="arLedgerEntryEnquiry"
    />
  );
}
