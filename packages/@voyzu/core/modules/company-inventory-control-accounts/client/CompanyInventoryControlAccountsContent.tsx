"use client";

import { useRouter } from "next/navigation";
import { ControlAccountSummaryPanel } from "@voyzu/core/common/control-accounts/client";
import type { InventoryControlAccountSettingResponseDto } from "@voyzu/core/types/modules/inventory-control-accounts";
import styles from "./control-account-summary-panels.module.css";

interface Props { controlAccounts: InventoryControlAccountSettingResponseDto[]; basePath: string; }

export function CompanyInventoryControlAccountsContent({ controlAccounts, basePath }: Props) {
  const router = useRouter();
  return <div className={styles.panelGrid}>{controlAccounts.map((account) => <ControlAccountSummaryPanel key={account.code} title={account.name} code={account.code} description={account.description} supportingLedger="Inventory" glAccountName={account.glAccount.name} glAccountCode={account.glAccount.code} hasPostings={account.hasPostings} onViewEdit={() => router.push(`${basePath}/${encodeURIComponent(account.code)}`)} />)}</div>;
}
