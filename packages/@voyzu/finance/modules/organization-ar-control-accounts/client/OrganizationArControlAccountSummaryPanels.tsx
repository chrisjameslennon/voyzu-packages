"use client";

import { useRouter } from "next/navigation";

import { ControlAccountSummaryPanel } from "@voyzu/finance/common/control-accounts/client";
import type { ControlAccountSettingResponseDto } from "@voyzu/finance/types/modules/control-accounts";

import styles from "./control-account-summary-panels.module.css";

interface OrganizationArControlAccountSummaryPanelsProps {
  accounts: ControlAccountSettingResponseDto[];
  basePath: string;
}

function accountBlurb(account: ControlAccountSettingResponseDto): string {
  if (account.code.endsWith("TRADE_RECEIVABLES")) {
    return "Used when customer invoices are posted but not yet paid.";
  }
  if (account.code.endsWith("UNAPPLIED_CASH")) {
    return "Used when customer receipts are posted but not yet applied to invoices.";
  }
  return "Supporting ledger control account.";
}

export function OrganizationArControlAccountSummaryPanels({ accounts, basePath }: OrganizationArControlAccountSummaryPanelsProps) {
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
