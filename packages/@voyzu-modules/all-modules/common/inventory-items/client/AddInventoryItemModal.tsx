"use client";

import type { InventoryItemCreateRequestDto } from "@voyzu-modules/types/modules/inventory-items";
import { Button, Input, SearchableSelect, ValidationAlert } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

type Option = { value: string; label: string; code?: string };

interface AddInventoryItemModalProps {
  isOpen: boolean;
  itemCode: string;
  itemName: string;
  description: string;
  itemType: InventoryItemCreateRequestDto["item_type"];
  categoryCode: string;
  unitCode: string;
  itemTypeOptions: Option[];
  categoryOptions: Option[];
  errors: string[];
  showErrors: boolean;
  saving: boolean;
  fieldErrors?: Record<string, boolean>;
  onClose: () => void;
  onDismissErrors: () => void;
  onItemCodeChange: (value: string) => void;
  onItemNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemTypeChange: (value: InventoryItemCreateRequestDto["item_type"]) => void;
  onCategoryCodeChange: (value: string) => void;
  onUnitCodeChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddInventoryItemModal({
  isOpen,
  itemCode,
  itemName,
  description,
  itemType,
  categoryCode,
  unitCode,
  itemTypeOptions,
  categoryOptions,
  errors,
  showErrors,
  saving,
  fieldErrors = {},
  onClose,
  onDismissErrors,
  onItemCodeChange,
  onItemNameChange,
  onDescriptionChange,
  onItemTypeChange,
  onCategoryCodeChange,
  onUnitCodeChange,
  onSubmit,
}: AddInventoryItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>Add Item</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={errors} visible={showErrors} onDismiss={onDismissErrors} />
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Item Code</span>
              <Input invalid={fieldErrors.itemCode} value={itemCode} onChange={(event) => onItemCodeChange(event.target.value)} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Item Name</span>
              <Input invalid={fieldErrors.itemName} value={itemName} onChange={(event) => onItemNameChange(event.target.value)} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Description</span>
            <Input invalid={fieldErrors.description} value={description} onChange={(event) => onDescriptionChange(event.target.value)} />
          </label>
          <div className={modalStyles.fieldRow}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Item Type</span>
              <SearchableSelect value={itemType} onChange={(value) => onItemTypeChange(value as InventoryItemCreateRequestDto["item_type"])} options={itemTypeOptions} searchable={false} />
            </label>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Unit Code</span>
              <Input invalid={fieldErrors.unitCode} value={unitCode} onChange={(event) => onUnitCodeChange(event.target.value)} />
            </label>
          </div>
          <label className={modalStyles.fieldGroup}>
            <span className={typography.fieldLabel}>Category</span>
            <SearchableSelect value={categoryCode} onChange={onCategoryCodeChange} options={categoryOptions} placeholder="Select a category" searchPlaceholder="Search categories..." hasError={fieldErrors.categoryCode} />
          </label>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>{saving ? "Creating..." : "Create Item"}</Button>
        </div>
      </div>
    </div>
  );
}
