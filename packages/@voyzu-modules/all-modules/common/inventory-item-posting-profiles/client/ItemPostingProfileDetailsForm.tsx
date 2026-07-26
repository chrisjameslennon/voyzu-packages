"use client";

import type { ItemPostingProfilePatchRequestDto, ItemPostingProfileResponseDto } from "@voyzu-modules/types/modules/inventory-item-posting-profiles";
import { Badge, Button, Checkbox, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./item-posting-profile-form.module.css";

type Option = { value: string; label: string; code?: string };

interface ItemPostingProfileDetailsFormProps {
  profileCode: ItemPostingProfileResponseDto["profile_code"];
  profileName: NonNullable<ItemPostingProfilePatchRequestDto["profile_name"]>;
  description: NonNullable<ItemPostingProfilePatchRequestDto["description"]>;
  isSold: boolean;
  isPurchased: boolean;
  isConsumed: boolean;
  revenueCode: NonNullable<ItemPostingProfilePatchRequestDto["revenue_code"]>;
  cogsCode: NonNullable<ItemPostingProfilePatchRequestDto["cogs_code"]>;
  purchaseExpenseCode: NonNullable<ItemPostingProfilePatchRequestDto["purchase_expense_code"]>;
  consumptionCode: NonNullable<ItemPostingProfilePatchRequestDto["consumption_code"]>;
  adjustmentGainCode: NonNullable<ItemPostingProfilePatchRequestDto["adjustment_gain_code"]>;
  adjustmentLossCode: NonNullable<ItemPostingProfilePatchRequestDto["adjustment_loss_code"]>;
  revenueAccountOptions: Option[];
  expenseAccountOptions: Option[];
  saving?: boolean;
  readOnly?: boolean;
  fieldErrors?: Record<string, boolean>;
  revenueCodeDisabled: boolean;
  cogsCodeDisabled: boolean;
  purchaseExpenseCodeDisabled: boolean;
  consumptionCodeDisabled: boolean;
  onProfileCodeChange: (value: ItemPostingProfileResponseDto["profile_code"]) => void;
  onProfileNameChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["profile_name"]>) => void;
  onDescriptionChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["description"]>) => void;
  onIsSoldChange: (value: boolean) => void;
  onIsPurchasedChange: (value: boolean) => void;
  onIsConsumedChange: (value: boolean) => void;
  onRevenueCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["revenue_code"]>) => void;
  onCogsCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["cogs_code"]>) => void;
  onPurchaseExpenseCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["purchase_expense_code"]>) => void;
  onConsumptionCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["consumption_code"]>) => void;
  onAdjustmentGainCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["adjustment_gain_code"]>) => void;
  onAdjustmentLossCodeChange: (value: NonNullable<ItemPostingProfilePatchRequestDto["adjustment_loss_code"]>) => void;
  onSave: () => void;
}

export function ItemPostingProfileDetailsForm({
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
  revenueAccountOptions,
  expenseAccountOptions,
  saving = false,
  readOnly = false,
  fieldErrors = {},
  revenueCodeDisabled,
  cogsCodeDisabled,
  purchaseExpenseCodeDisabled,
  consumptionCodeDisabled,
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
  onSave,
}: ItemPostingProfileDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Posting Profile Details</h2>
        <div className={detailStyles.cardHeaderActions}>
          <Button variant="secondary" icon="save" disabled={saving || readOnly} onClick={onSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Profile Code</span><Input className={listStyles.codeCell} invalid={fieldErrors.profileCode} value={profileCode} maxLength={40} disabled={readOnly} onChange={(event) => onProfileCodeChange(event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Profile Name</span><Input invalid={fieldErrors.profileName} value={profileName} disabled={readOnly} onChange={(event) => onProfileNameChange(event.target.value)} /></label>
        <label className={`${detailStyles.fieldGroup} ${styles.fullRow}`}><span className={typography.fieldLabel}>Description</span><Input invalid={fieldErrors.description} value={description} disabled={readOnly} onChange={(event) => onDescriptionChange(event.target.value)} /></label>
      </div>
      <h3 className={`${typography.sectionHeading} ${styles.operationsHeading}`}>Permitted Operations</h3>
      <div className={styles.operationsGrid}>
        <PermissionCheckbox label="Sold" checked={isSold} disabled={readOnly} onChange={onIsSoldChange} />
        <PermissionCheckbox label="Purchased" checked={isPurchased} disabled={readOnly} onChange={onIsPurchasedChange} />
        <PermissionCheckbox label="Consumed" checked={isConsumed} disabled={readOnly} onChange={onIsConsumedChange} />
      </div>
      <h3 className={typography.sectionHeading}>GL Account Codes</h3>
      <div className={detailStyles.formGrid}>
        <PostingAccountSelect label="Revenue Code" accountType="REVENUE" value={revenueCode} options={revenueAccountOptions} disabled={readOnly || revenueCodeDisabled} hasError={fieldErrors.revenueCode} onChange={onRevenueCodeChange} />
        <PostingAccountSelect label="COGS Code" accountType="EXPENSE" value={cogsCode} options={expenseAccountOptions} disabled={readOnly || cogsCodeDisabled} hasError={fieldErrors.cogsCode} onChange={onCogsCodeChange} />
        <PostingAccountSelect label="Purchase Expense Code" accountType="EXPENSE" value={purchaseExpenseCode} options={expenseAccountOptions} disabled={readOnly || purchaseExpenseCodeDisabled} hasError={fieldErrors.purchaseExpenseCode} onChange={onPurchaseExpenseCodeChange} />
        <PostingAccountSelect label="Consumption Code" accountType="EXPENSE" value={consumptionCode} options={expenseAccountOptions} disabled={readOnly || consumptionCodeDisabled} hasError={fieldErrors.consumptionCode} onChange={onConsumptionCodeChange} />
        <PostingAccountSelect label="Adjustment Gain Code" accountType="REVENUE" value={adjustmentGainCode} options={revenueAccountOptions} disabled={readOnly} hasError={fieldErrors.adjustmentGainCode} onChange={onAdjustmentGainCodeChange} />
        <PostingAccountSelect label="Adjustment Loss Code" accountType="EXPENSE" value={adjustmentLossCode} options={expenseAccountOptions} disabled={readOnly} hasError={fieldErrors.adjustmentLossCode} onChange={onAdjustmentLossCodeChange} />
      </div>
    </section>
  );
}

function PermissionCheckbox({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={typography.fieldLabel}>{label}</span>
      <Checkbox checked={checked} disabled={disabled} onChange={onChange} />
    </label>
  );
}

function PostingAccountSelect({
  label,
  accountType,
  value,
  options,
  disabled,
  hasError,
  onChange,
}: {
  label: string;
  accountType: "REVENUE" | "EXPENSE";
  value: string;
  options: Option[];
  disabled: boolean;
  hasError?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={detailStyles.fieldGroup}>
      <span className={`${typography.fieldLabel} ${detailStyles.inlineGroup}`}>{label} <Badge variant="soft" size="x-small" color="neutral">{accountType}</Badge></span>
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
