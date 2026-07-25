"use client";

import type { GlAccountCreateRequestDto, GlAccountUpdateRequestDto } from "@voyzu/types/modules/gl-accounts";
import { Input, SearchableSelect } from "@voyzu/ui-components";
import { Button } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

export type GlAccountFormAccountType =
  | GlAccountCreateRequestDto["accountType"]
  | GlAccountUpdateRequestDto["accountType"];

interface GlAccountMainFormProps {
  sectionTitle: string;
  accountTypeOptions: Array<{ value: string; label: string }>;
  categoryOptions: Array<{ value: string; label: string; code?: string }>;
  code: string;
  name: string;
  accountType: GlAccountFormAccountType;
  accountCategoryId: string;
  codeHasError?: boolean;
  nameHasError?: boolean;
  codeDisabled?: boolean;
  readOnly?: boolean;
  saveLabel?: string;
  saving?: boolean;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onAccountTypeChange: (value: GlAccountFormAccountType) => void;
  onAccountCategoryIdChange: (value: string) => void;
  onSave?: () => void;
}

export function GlAccountMainForm({
  sectionTitle,
  accountTypeOptions,
  categoryOptions,
  code,
  name,
  accountType,
  accountCategoryId,
  codeHasError = false,
  nameHasError = false,
  codeDisabled = false,
  readOnly = false,
  saveLabel = "Save",
  saving = false,
  onCodeChange,
  onNameChange,
  onAccountTypeChange,
  onAccountCategoryIdChange,
  onSave,
}: GlAccountMainFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>{sectionTitle}</h2>
        {onSave ? (
          <div className={detailStyles.cardHeaderActions}>
            <Button variant="secondary" icon="save" disabled={saving || readOnly} onClick={onSave}>
              {saving ? "Saving..." : saveLabel}
            </Button>
          </div>
        ) : null}
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Code</span>
          <Input
            invalid={codeHasError}
            value={code}
            maxLength={14}
            disabled={codeDisabled || readOnly}
            onChange={(event) => onCodeChange(event.target.value)}
          />
          <span className={typography.fieldHelp}>
            Capital letters, numbers, dash (-) and underscore (_) only. 14 characters max.
          </span>
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Name</span>
          <Input
            invalid={nameHasError}
            value={name}
            disabled={readOnly}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Account Type</span>
          <SearchableSelect
            value={accountType}
            onChange={(value) => onAccountTypeChange(value as GlAccountFormAccountType)}
            options={accountTypeOptions}
            searchable={false}
            disabled={readOnly}
          />
        </label>
        <label className={detailStyles.fieldGroup}>
          <span className={typography.fieldLabel}>Reporting Category</span>
          <SearchableSelect
            value={accountCategoryId}
            onChange={onAccountCategoryIdChange}
            options={categoryOptions}
            placeholder="Select a category"
            searchPlaceholder="Search categories..."
            dropdownWidth="auto"
            disabled={readOnly}
          />
        </label>
      </div>
    </section>
  );
}
