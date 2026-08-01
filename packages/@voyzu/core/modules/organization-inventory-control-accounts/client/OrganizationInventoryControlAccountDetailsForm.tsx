"use client";

import type { GlAccountResponseDto } from "@voyzu/core/types/modules/gl-accounts";
import type { InventoryControlAccountSettingResponseDto } from "@voyzu/core/types/modules/inventory-control-accounts";
import { Badge, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface Props { account: InventoryControlAccountSettingResponseDto; glAccounts: GlAccountResponseDto[]; glAccountId: string; disabled: boolean; onGlAccountChange: (value: string) => void; }

export function OrganizationInventoryControlAccountDetailsForm({ account, glAccounts, glAccountId, disabled, onGlAccountChange }: Props) {
  const options = glAccounts.map((item) => ({ value: String(item.id), label: item.name, code: item.code }));
  return <section className={detailStyles.card}><h2 className={typography.sectionHeading}>Control Account Details</h2><div className={detailStyles.formGrid}>
    <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input value={account.code} disabled /></label>
    <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input value={account.name} disabled /></label>
    <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Ledger</span><Input value={account.ledger} disabled /></label>
    <label className={detailStyles.fieldGroup}><span className={`${typography.fieldLabel} ${detailStyles.inlineGroup}`}>GL Account <Badge variant="soft" size="x-small" color="neutral">ASSET</Badge></span><SearchableSelect value={glAccountId} onChange={onGlAccountChange} options={options} placeholder="Select a GL account" searchPlaceholder="Search GL accounts..." dropdownWidth="auto" disabled={disabled} /></label>
  </div></section>;
}
