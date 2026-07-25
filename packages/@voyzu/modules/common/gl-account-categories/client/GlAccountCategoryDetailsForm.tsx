"use client";

import type { GlAccountCategoryPatchRequestDto, GlAccountCategoryResponseDto } from "@voyzu/types/modules/gl-account-categories";
import { Input } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface GlAccountCategoryDetailsFormProps {
  code: GlAccountCategoryResponseDto["code"];
  name: NonNullable<GlAccountCategoryPatchRequestDto["name"]>;
  accountType: NonNullable<GlAccountCategoryPatchRequestDto["accountType"]>;
  sequence: NonNullable<GlAccountCategoryPatchRequestDto["sequence"]>;
  readOnly?: boolean;
  nameHasError?: boolean;
  onNameChange: (value: NonNullable<GlAccountCategoryPatchRequestDto["name"]>) => void;
}

export function GlAccountCategoryDetailsForm({
  code,
  name,
  accountType,
  sequence,
  readOnly = false,
  nameHasError = false,
  onNameChange,
}: GlAccountCategoryDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <h2 className={typography.sectionHeading}>Reporting Category Details</h2>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Code</span>
          <Input value={code} disabled />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Name</span>
          <Input invalid={nameHasError} value={name} disabled={readOnly} onChange={(event) => onNameChange(event.target.value)} />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Account Type</span>
          <Input value={accountType} disabled />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Sequence</span>
          <Input value={sequence} disabled />
        </label>
      </div>
    </section>
  );
}
