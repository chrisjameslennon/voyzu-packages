"use client";

import { useRouter } from "next/navigation";

import { ControlAccountSummaryPanel } from "@voyzu/finance/common/control-accounts/client";
import type { ControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/control-accounts";

import styles from "./control-account-summary-panels.module.css";

interface OrganizationApControlAccountSummaryPanelsProps {
  accounts: ControlAccountSettingResponseDto[];
  basePath: string;
}

function accountBlurb(account: ControlAccountSettingResponseDto): string {
  if (account.code.endsWith("TRADE_PAYABLES")) {
    return "Used when supplier invoices are posted but not yet paid.";
  }
  if (account.code.endsWith("UNAPPLIED_PAYMENTS")) {
    return "Used when a supplier payment has been recorded but not yet matched to a supplier invoice.";
  }
  return "Supporting ledger control account.";
}

export function OrganizationApControlAccountSummaryPanels({ accounts, basePath }: OrganizationApControlAccountSummaryPanelsProps) {
  const router = useRouter();

  return (
    <div className={styles.panelGrid}>
      {accounts.map((account) => (
        <ControlAccountSummaryPanel
          key={account.code}
          title={account.name}
          code={account.code}
          description={accountBlurb(account)}
          supportingLedger={account.supportingLedger}
          glAccountName={account.glAccount?.name}
          glAccountCode={account.glAccount?.code}
          hasPostings={account.hasPostings}
          onViewEdit={() => router.push(`${basePath}/${encodeURIComponent(account.code)}`)}
        />
      ))}
    </div>
  );
}
