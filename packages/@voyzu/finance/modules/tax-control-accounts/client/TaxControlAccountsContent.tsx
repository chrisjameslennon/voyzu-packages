"use client";

import { useRouter } from "next/navigation";
import { ControlAccountSummaryPanel } from "../../control-accounts/client/index";
import type { TaxControlAccountResponseDto } from "../types/index";
import styles from "./control-account-summary-panels.module.css";

interface Props { controlAccounts: TaxControlAccountResponseDto[]; basePath: string; }

export function TaxControlAccountsContent({ controlAccounts, basePath }: Props) {
  const router = useRouter();
  return <div className={styles.panelGrid}>{controlAccounts.map((account) => <ControlAccountSummaryPanel key={account.code} title={account.name} code={account.code} description={account.description} supportingLedger="Tax" glAccountName={account.glAccount.name} glAccountCode={account.glAccount.code} hasPostings={account.hasPostings} onViewEdit={() => router.push(`${basePath}/${encodeURIComponent(account.code)}`)} />)}</div>;
}
