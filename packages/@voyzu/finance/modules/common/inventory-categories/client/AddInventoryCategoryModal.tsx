"use client";

import type { InventoryCategoryCreateRequestDto } from "@voyzu/finance/types/modules/inventory-categories";
import { Button, Input, SearchableSelect, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface AddInventoryCategoryModalProps {
  isOpen: boolean;
  code: InventoryCategoryCreateRequestDto["code"];
  name: InventoryCategoryCreateRequestDto["name"];
  description: InventoryCategoryCreateRequestDto["description"];
  postingProfileCode: InventoryCategoryCreateRequestDto["posting_profile_code"];
  postingProfileOptions: Array<{ value: string; label: string; code?: string }>;
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  codeHasError?: boolean;
  nameHasError?: boolean;
  descriptionHasError?: boolean;
  postingProfileHasError?: boolean;
  onClose: () => void;
  onDismissErrors: () => void;
  onCodeChange: (value: InventoryCategoryCreateRequestDto["code"]) => void;
  onNameChange: (value: InventoryCategoryCreateRequestDto["name"]) => void;
  onDescriptionChange: (value: InventoryCategoryCreateRequestDto["description"]) => void;
  onPostingProfileChange: (value: InventoryCategoryCreateRequestDto["posting_profile_code"]) => void;
  onSubmit: () => void;
}

export function AddInventoryCategoryModal({
  isOpen,
  code,
  name,
  description,
  postingProfileCode,
  postingProfileOptions,
  errors,
  showErrors,
  saving,
  codeHasError = false,
  nameHasError = false,
  descriptionHasError = false,
  postingProfileHasError = false,
  onClose,
  onDismissErrors,
  onCodeChange,
  onNameChange,
  onDescriptionChange,
  onPostingProfileChange,
  onSubmit,
}: AddInventoryCategoryModalProps) {
  if (!isOpen) return null;
  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Category</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={errors} visible={showErrors} onDismiss={onDismissErrors} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Code</span>
              <Input invalid={codeHasError} value={code} onChange={(event) => onCodeChange(event.target.value)} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name</span>
              <Input invalid={nameHasError} value={name} onChange={(event) => onNameChange(event.target.value)} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Description</span>
            <Input invalid={descriptionHasError} value={description} onChange={(event) => onDescriptionChange(event.target.value)} />
          </label>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Posting Profile</span>
            <SearchableSelect value={postingProfileCode} onChange={onPostingProfileChange} options={postingProfileOptions} hasError={postingProfileHasError} placeholder="Select a posting profile" searchPlaceholder="Search posting profiles..." />
          </label>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>{saving ? "Creating..." : "Create Category"}</Button>
        </div>
      </div>
    </div>
  );
}
