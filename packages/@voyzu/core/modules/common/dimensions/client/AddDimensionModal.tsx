"use client";

import type { DimensionCreateRequestDto } from "@voyzu/core/types/modules/dimensions";
import { Button, Input, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

interface AddDimensionModalProps {
  isOpen: boolean;
  code: DimensionCreateRequestDto["code"];
  name: DimensionCreateRequestDto["name"];
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  codeHasError?: boolean;
  nameHasError?: boolean;
  onClose: () => void;
  onDismissErrors: () => void;
  onCodeChange: (value: DimensionCreateRequestDto["code"]) => void;
  onNameChange: (value: DimensionCreateRequestDto["name"]) => void;
  onSubmit: () => void;
}

export function AddDimensionModal({
  isOpen,
  code,
  name,
  errors,
  showErrors,
  saving,
  codeHasError = false,
  nameHasError = false,
  onClose,
  onDismissErrors,
  onCodeChange,
  onNameChange,
  onSubmit,
}: AddDimensionModalProps) {
  if (!isOpen) return null;

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Dimension</h3>
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
                onChange={(event) => onCodeChange(event.target.value)}
              />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name</span>
              <Input
                invalid={nameHasError}
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
              />
            </label>
          </div>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>
            {saving ? "Creating..." : "Create Dimension"}
          </Button>
        </div>
      </div>
    </div>
  );
}
