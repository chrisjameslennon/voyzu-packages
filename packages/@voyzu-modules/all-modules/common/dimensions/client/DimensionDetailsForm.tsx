"use client";

import type { DimensionPatchRequestDto } from "@voyzu-modules/types/modules/dimensions";
import { Button, Input } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface DimensionDetailsFormProps {
  code: NonNullable<DimensionPatchRequestDto["code"]>;
  name: NonNullable<DimensionPatchRequestDto["name"]>;
  saving?: boolean;
  readOnly?: boolean;
  codeDisabled?: boolean;
  codeHasError?: boolean;
  nameHasError?: boolean;
  onCodeChange: (value: NonNullable<DimensionPatchRequestDto["code"]>) => void;
  onNameChange: (value: NonNullable<DimensionPatchRequestDto["name"]>) => void;
  onSave: () => void;
}

export function DimensionDetailsForm({
  code,
  name,
  saving = false,
  readOnly = false,
  codeDisabled = false,
  codeHasError = false,
  nameHasError = false,
  onCodeChange,
  onNameChange,
  onSave,
}: DimensionDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Dimension Details</h2>
        <div className={detailStyles.cardHeaderActions}>
          <Button variant="secondary" icon="save" disabled={saving || readOnly} onClick={onSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Code</span>
          <Input
            invalid={codeHasError}
            maxLength={14}
            value={code}
            disabled={readOnly || codeDisabled}
            onChange={(event) => onCodeChange(event.target.value)}
          />
          <span className={typography.fieldHelp}>Capital letters, numbers, dashes and underscores only. 14 characters max.</span>
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Name</span>
          <Input invalid={nameHasError} value={name} disabled={readOnly} onChange={(event) => onNameChange(event.target.value)} />
        </label>
      </div>
    </section>
  );
}
