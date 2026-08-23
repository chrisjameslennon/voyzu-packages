"use client";

import type { ControlAccountResponseDto } from "@voyzu/finance/types/modules/control-accounts";
import type { GlAccountResponseDto } from "@voyzu/finance/types/modules/gl-accounts";
import { Badge, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface OrganizationApControlAccountDetailsFormProps {
  account: ControlAccountResponseDto;
  glAccounts: GlAccountResponseDto[];
  glAccountId: string;
  disabled: boolean;
  onGlAccountChange: (value: string) => void;
}

export function OrganizationApControlAccountDetailsForm({
  account,
  glAccounts,
  glAccountId,
  disabled,
  onGlAccountChange,
}: OrganizationApControlAccountDetailsFormProps) {
  const options = glAccounts.map((glAccount) => ({ value: String(glAccount.id), label: glAccount.name, code: glAccount.code }));

  return (
    <section className={detailStyles.card}>
      <h2 className={typography.sectionHeading}>Control Account Details</h2>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Code</span>
          <Input value={account.code} disabled />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Name</span>
          <Input value={account.name} disabled />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Ledger</span>
          <Input value={account.ledger} disabled />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={`${typography.fieldLabel} ${detailStyles.inlineGroup}`}>GL Account <Badge variant="soft" size="x-small" color="neutral">LIABILITY</Badge></span>
          <SearchableSelect value={glAccountId} onChange={onGlAccountChange} options={options} placeholder="Select a GL account" searchPlaceholder="Search GL accounts..." dropdownWidth="auto" disabled={disabled} />
        </label>
      </div>
    </section>
  );
}
