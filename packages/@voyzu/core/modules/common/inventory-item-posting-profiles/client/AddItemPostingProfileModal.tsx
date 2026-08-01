"use client";

import type { ItemPostingProfileCreateRequestDto } from "@voyzu/core/types/modules/inventory-item-posting-profiles";
import { Badge, Button, Checkbox, Input, SearchableSelect, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./item-posting-profile-form.module.css";

interface AddItemPostingProfileModalProps {
  revenueAccountOptions: Array<{ value: string; label: string; code?: string }>;
  expenseAccountOptions: Array<{ value: string; label: string; code?: string }>;
  isOpen: boolean;
  profileCode: ItemPostingProfileCreateRequestDto["profile_code"];
  profileName: ItemPostingProfileCreateRequestDto["profile_name"];
  description: ItemPostingProfileCreateRequestDto["description"];
  isSold: boolean;
  isPurchased: boolean;
  isConsumed: boolean;
  revenueCode: NonNullable<ItemPostingProfileCreateRequestDto["revenue_code"]>;
  cogsCode: NonNullable<ItemPostingProfileCreateRequestDto["cogs_code"]>;
  purchaseExpenseCode: NonNullable<ItemPostingProfileCreateRequestDto["purchase_expense_code"]>;
  consumptionCode: NonNullable<ItemPostingProfileCreateRequestDto["consumption_code"]>;
  adjustmentGainCode: NonNullable<ItemPostingProfileCreateRequestDto["adjustment_gain_code"]>;
  adjustmentLossCode: NonNullable<ItemPostingProfileCreateRequestDto["adjustment_loss_code"]>;
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  fieldErrors?: Record<string, boolean>;
  revenueCodeDisabled: boolean;
  cogsCodeDisabled: boolean;
  purchaseExpenseCodeDisabled: boolean;
  consumptionCodeDisabled: boolean;
  revenueCodeRequired: boolean;
  cogsCodeRequired: boolean;
  purchaseExpenseCodeRequired: boolean;
  consumptionCodeRequired: boolean;
  onClose: () => void;
  onDismissErrors: () => void;
  onProfileCodeChange: (value: ItemPostingProfileCreateRequestDto["profile_code"]) => void;
  onProfileNameChange: (value: ItemPostingProfileCreateRequestDto["profile_name"]) => void;
  onDescriptionChange: (value: ItemPostingProfileCreateRequestDto["description"]) => void;
  onIsSoldChange: (value: boolean) => void;
  onIsPurchasedChange: (value: boolean) => void;
  onIsConsumedChange: (value: boolean) => void;
  onRevenueCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["revenue_code"]>) => void;
  onCogsCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["cogs_code"]>) => void;
  onPurchaseExpenseCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["purchase_expense_code"]>) => void;
  onConsumptionCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["consumption_code"]>) => void;
  onAdjustmentGainCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["adjustment_gain_code"]>) => void;
  onAdjustmentLossCodeChange: (value: NonNullable<ItemPostingProfileCreateRequestDto["adjustment_loss_code"]>) => void;
  onSubmit: () => void;
}

export function AddItemPostingProfileModal({
  revenueAccountOptions,
  expenseAccountOptions,
  isOpen,
  profileCode,
  profileName,
  description,
  isSold,
  isPurchased,
  isConsumed,
  revenueCode,
  cogsCode,
  purchaseExpenseCode,
  consumptionCode,
  adjustmentGainCode,
  adjustmentLossCode,
  errors,
  showErrors,
  saving,
  fieldErrors = {},
  revenueCodeDisabled,
  cogsCodeDisabled,
  purchaseExpenseCodeDisabled,
  consumptionCodeDisabled,
  revenueCodeRequired,
  cogsCodeRequired,
  purchaseExpenseCodeRequired,
  consumptionCodeRequired,
  onClose,
  onDismissErrors,
  onProfileCodeChange,
  onProfileNameChange,
  onDescriptionChange,
  onIsSoldChange,
  onIsPurchasedChange,
  onIsConsumedChange,
  onRevenueCodeChange,
  onCogsCodeChange,
  onPurchaseExpenseCodeChange,
  onConsumptionCodeChange,
  onAdjustmentGainCodeChange,
  onAdjustmentLossCodeChange,
  onSubmit,
}: AddItemPostingProfileModalProps) {
  if (!isOpen) return null;
  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Posting Profile</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={errors} visible={showErrors} onDismiss={onDismissErrors} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Profile Code</span>
              <Input invalid={fieldErrors.profileCode} value={profileCode} onChange={(event) => onProfileCodeChange(event.target.value)} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Profile Name</span>
              <Input invalid={fieldErrors.profileName} value={profileName} onChange={(event) => onProfileNameChange(event.target.value)} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Description</span>
            <Input invalid={fieldErrors.description} value={description} onChange={(event) => onDescriptionChange(event.target.value)} />
          </label>
          <div className={modalStyles.section}>
            <h4 className={`${typography.sectionHeading} ${modalStyles.compactSectionHeading} ${styles.operationsHeading}`}>Permitted Operations</h4>
            <div className={styles.operationsGrid}>
              <PermissionCheckbox label="Sold" checked={isSold} onChange={onIsSoldChange} />
              <PermissionCheckbox label="Purchased" checked={isPurchased} onChange={onIsPurchasedChange} />
              <PermissionCheckbox label="Consumed" checked={isConsumed} onChange={onIsConsumedChange} />
            </div>
          </div>
          <div className={modalStyles.section}>
            <h4 className={`${typography.sectionHeading} ${modalStyles.compactSectionHeading}`}>GL Account Codes</h4>
            <div className={modalStyles.fieldRow}>
              <PostingCodeField label="Revenue Code" accountType="REVENUE" value={revenueCode} options={revenueAccountOptions} disabled={revenueCodeDisabled} required={revenueCodeRequired} hasError={fieldErrors.revenueCode} onChange={onRevenueCodeChange} />
              <PostingCodeField label="COGS Code" accountType="EXPENSE" value={cogsCode} options={expenseAccountOptions} disabled={cogsCodeDisabled} required={cogsCodeRequired} hasError={fieldErrors.cogsCode} onChange={onCogsCodeChange} />
            </div>
            <div className={modalStyles.fieldRow}>
              <PostingCodeField label="Purchase Expense Code" accountType="EXPENSE" value={purchaseExpenseCode} options={expenseAccountOptions} disabled={purchaseExpenseCodeDisabled} required={purchaseExpenseCodeRequired} hasError={fieldErrors.purchaseExpenseCode} onChange={onPurchaseExpenseCodeChange} />
              <PostingCodeField label="Consumption Code" accountType="EXPENSE" value={consumptionCode} options={expenseAccountOptions} disabled={consumptionCodeDisabled} required={consumptionCodeRequired} hasError={fieldErrors.consumptionCode} onChange={onConsumptionCodeChange} />
            </div>
            <div className={modalStyles.fieldRow}>
              <PostingCodeField label="Adjustment Gain Code" accountType="REVENUE" value={adjustmentGainCode} options={revenueAccountOptions} disabled={false} required={false} hasError={fieldErrors.adjustmentGainCode} onChange={onAdjustmentGainCodeChange} />
              <PostingCodeField label="Adjustment Loss Code" accountType="EXPENSE" value={adjustmentLossCode} options={expenseAccountOptions} disabled={false} required={false} hasError={fieldErrors.adjustmentLossCode} onChange={onAdjustmentLossCodeChange} />
            </div>
          </div>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>{saving ? "Creating..." : "Create Posting Profile"}</Button>
        </div>
      </div>
    </div>
  );
}

function PermissionCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className={modalStyles.fieldGroup}><span className={typography.fieldLabel}>{label}</span><Checkbox checked={checked} onChange={onChange} /></label>;
}

function PostingCodeField({ label, accountType, value, options, disabled, required, hasError, onChange }: { label: string; accountType: "REVENUE" | "EXPENSE"; value: string; options: Array<{ value: string; label: string; code?: string }>; disabled: boolean; required: boolean; hasError?: boolean; onChange: (value: string) => void }) {
  return (
    <label className={modalStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}{required ? "" : " (optional)"} <Badge variant="soft" size="x-small" color="neutral">{accountType}</Badge></span>
      <SearchableSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder="Select a GL account"
        searchPlaceholder="Search GL accounts..."
        clearable
        dropdownWidth="auto"
        disabled={disabled}
        hasError={hasError}
      />
    </label>
  );
}
