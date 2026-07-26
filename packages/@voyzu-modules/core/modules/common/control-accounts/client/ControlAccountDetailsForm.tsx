"use client";

import type { ControlAccountResponseDto } from "@voyzu-modules/core/types/modules/control-accounts";
import { Input } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface ControlAccountDetailsFormProps {
  account: ControlAccountResponseDto;
}

export function ControlAccountDetailsForm({ account }: ControlAccountDetailsFormProps) {
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
          <span className={typography.fieldLabel}>GL Account</span>
          <Input value={account.glAccount ? `${account.glAccount.code} - ${account.glAccount.name}` : ""} disabled />
        </label>
      </div>
    </section>
  );
}
