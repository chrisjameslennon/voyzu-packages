"use client";

import type { GlAccountCreateRequestDto } from "@voyzu/types/modules/gl-accounts";
import { Button, Input, SearchableSelect, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface AddGlAccountModalProps {
  isOpen: boolean;
  code: string;
  name: string;
  accountType: GlAccountCreateRequestDto["accountType"];
  accountCategoryId: string;
  accountTypeOptions: Array<{ value: string; label: string }>;
  categoryOptions: Array<{ value: string; label: string; code?: string }>;
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  codeHasError?: boolean;
  nameHasError?: boolean;
  accountCategoryHasError?: boolean;
  onClose: () => void;
  onDismissErrors: () => void;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onAccountTypeChange: (value: GlAccountCreateRequestDto["accountType"]) => void;
  onAccountCategoryIdChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddGlAccountModal({
  isOpen,
  code,
  name,
  accountType,
  accountCategoryId,
  accountTypeOptions,
  categoryOptions,
  errors,
  showErrors,
  saving,
  codeHasError = false,
  nameHasError = false,
  accountCategoryHasError = false,
  onClose,
  onDismissErrors,
  onCodeChange,
  onNameChange,
  onAccountTypeChange,
  onAccountCategoryIdChange,
  onSubmit,
}: AddGlAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add General Ledger Account</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={errors} visible={showErrors} onDismiss={onDismissErrors} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Code</span>
              <Input
                invalid={codeHasError}
                value={code}
                maxLength={14}
                onChange={(event) => onCodeChange(event.target.value)}
              />
              <span className={typography.fieldHelp}>
                Capital letters, numbers, dash (-) and underscore (_) only. 14 characters max.
              </span>
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name</span>
              <Input invalid={nameHasError} value={name} onChange={(event) => onNameChange(event.target.value)} />
            </label>
          </div>
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Account Type</span>
              <SearchableSelect value={accountType} onChange={(value) => onAccountTypeChange(value as GlAccountCreateRequestDto["accountType"])} options={accountTypeOptions} searchable={false} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Reporting Category</span>
              <SearchableSelect
                value={accountCategoryId}
                onChange={onAccountCategoryIdChange}
                options={categoryOptions}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                dropdownWidth="auto"
                hasError={accountCategoryHasError}
              />
            </label>
          </div>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>{saving ? "Creating..." : "Create Account"}</Button>
        </div>
      </div>
    </div>
  );
}
