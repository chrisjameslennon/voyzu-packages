"use client";

import type { InventoryItemPatchRequestDto, InventoryItemResponseDto } from "@voyzu/core/types/modules/inventory-items";
import { Button, Input, SearchableSelect } from "@voyzu/ui-components";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function displayValue(value: number | null) {
  return value == null ? "" : moneyFormat.format(value);
}

interface InventoryItemDetailsFormProps {
  itemCode: string;
  itemName: string;
  description: string;
  itemType: InventoryItemResponseDto["item_type"];
  categoryCode: string;
  unitCode: string;
  balances: Pick<InventoryItemResponseDto, "quantity_on_hand_derived" | "book_value_derived" | "avg_unit_book_value_derived">;
  itemTypeOptions: Array<{ value: string; label: string }>;
  categoryOptions: Array<{ value: string; label: string; code?: string }>;
  showBalances?: boolean;
  codeDisabled?: boolean;
  codeDisabledTitle?: string;
  saving?: boolean;
  errors?: Partial<Record<keyof InventoryItemPatchRequestDto, boolean>>;
  onChange: (field: keyof InventoryItemPatchRequestDto, value: string) => void;
  onSave: () => void;
}

export function InventoryItemDetailsForm({
  itemCode,
  itemName,
  description,
  itemType,
  categoryCode,
  unitCode,
  balances,
  itemTypeOptions,
  categoryOptions,
  showBalances = true,
  codeDisabled = false,
  codeDisabledTitle,
  saving = false,
  errors = {},
  onChange,
  onSave,
}: InventoryItemDetailsFormProps) {
  return (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Item Details</h2>
        <div className={detailStyles.cardHeaderActions}>
          <Button variant="secondary" icon="save" disabled={saving} onClick={onSave}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
      <div className={detailStyles.formGrid}>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Item Code</span><Input invalid={errors.item_code} value={itemCode} disabled={codeDisabled} title={codeDisabled ? codeDisabledTitle : undefined} onChange={(event) => onChange("item_code", event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Item Name</span><Input invalid={errors.item_name} value={itemName} onChange={(event) => onChange("item_name", event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Description</span><Input invalid={errors.description} value={description} onChange={(event) => onChange("description", event.target.value)} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Item Type</span><SearchableSelect value={itemType} onChange={(value) => onChange("item_type", value)} options={itemTypeOptions} searchable={false} /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Category</span><SearchableSelect value={categoryCode} onChange={(value) => onChange("category_code", value)} options={categoryOptions} hasError={errors.category_code} placeholder="Select a category" searchPlaceholder="Search categories..." /></label>
        <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Unit</span><Input invalid={errors.unit_code} value={unitCode} onChange={(event) => onChange("unit_code", event.target.value)} /></label>
        {showBalances ? <>
          <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Quantity On Hand</span><Input value={displayValue(balances.quantity_on_hand_derived)} disabled /></label>
          <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Book Value</span><Input value={displayValue(balances.book_value_derived)} disabled /></label>
          <label className={detailStyles.fieldGroup}><span className={typography.fieldLabel}>Avg Unit Book Value</span><Input value={displayValue(balances.avg_unit_book_value_derived)} disabled /></label>
        </> : null}
      </div>
    </section>
  );
}
