"use client";

import { OrganizationAuditPanel as AuditPanel } from "@voyzu-modules/core/organization-audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { getStatusSemanticColor } from "@voyzu-modules/core/common/client";
import { InventoryItemDetailsForm } from "@voyzu-modules/core/common/inventory-items/client";
import { ChangeCodeAvailability, Deactivate } from "@voyzu-modules/core/common/inventory-items/domain/operation-policy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { InventoryCategoryResponseDto } from "@voyzu-modules/core/types/modules/inventory-categories";
import type { InventoryItemPatchRequestDto } from "@voyzu-modules/core/types/modules/inventory-items";
import type { InventoryItemResponseDto } from "@voyzu-modules/core/types/modules/inventory-items";
import { Badge, Breadcrumbs, Button, ConfirmDialog, pattern, required, Toast, useFormValidation, ValidationAlert } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const CODE_PATTERN = /^[A-Z0-9_ -]+$/i;
const UNIT_PATTERN = /^[a-z][a-z0-9_-]*$/i;
const ITEM_TYPE_OPTIONS = [
  { value: "INVENTORY", label: "INVENTORY" },
  { value: "NON_INVENTORY", label: "NON_INVENTORY" },
  { value: "SERVICE", label: "SERVICE" },
];

export function OrganizationInventoryItemDetail({ item, categories, listPath = "/organization/inventory/items" }: { item: InventoryItemResponseDto; categories: InventoryCategoryResponseDto[]; listPath?: string }) {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState(item);
  const [itemCode, setItemCode] = useState(item.item_code);
  const [itemName, setItemName] = useState(item.item_name);
  const [description, setDescription] = useState(item.description);
  const [itemType, setItemType] = useState(item.item_type);
  const [categoryCode, setCategoryCode] = useState(item.category_code);
  const [unitCode, setUnitCode] = useState(item.unit_code);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const categoryOptions = categories
    .filter((category) => category.status === "ACTIVE" || category.code === categoryCode)
    .map((category) => ({ value: category.code, label: category.name, code: category.code }));
  const validation = useFormValidation(() => ({
    item_code: { label: "item code", value: itemCode, rules: [required(), pattern(CODE_PATTERN, "Item code can only contain letters, numbers, spaces, underscores or hyphens")] },
    item_name: { label: "item name", value: itemName, rules: [required()] },
    description: { label: "description", value: description, rules: [required()] },
    category_code: { label: "category", value: categoryCode, rules: [required()] },
    unit_code: { label: "unit", value: unitCode, rules: [required(), pattern(UNIT_PATTERN, "Unit must start with a letter and contain only letters, numbers, underscores or hyphens")] },
  }));

  const save = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: InventoryItemPatchRequestDto = {
        item_code: itemCode.trim(), item_name: itemName.trim(), description: description.trim(), item_type: itemType,
        category_code: categoryCode, unit_code: unitCode.trim(),
      };
      const response = await fetch(`/api/organization/inventory/items/${encodeURIComponent(currentItem.item_code)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      const updated = await response.json() as InventoryItemResponseDto;
      if (updated.item_code !== currentItem.item_code) router.replace(`${listPath}/${encodeURIComponent(updated.item_code)}`);
      setCurrentItem(updated);
      setItemCode(updated.item_code);
      setToastVisible(true);
    } finally { setSaving(false); }
  };

  const changeField = (field: keyof InventoryItemPatchRequestDto, value: string) => {
    if (field === "item_code") setItemCode(value.toUpperCase());
    else if (field === "item_name") setItemName(value);
    else if (field === "description") setDescription(value);
    else if (field === "item_type") setItemType(value as InventoryItemResponseDto["item_type"]);
    else if (field === "category_code") setCategoryCode(value);
    else if (field === "unit_code") setUnitCode(value.toLowerCase());
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    setServerError("");
    const response = await fetch(`/api/organization/inventory/items/${encodeURIComponent(currentItem.item_code)}/${action}`, { method: "POST" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    router.push(listPath);
  };

  const deleteItem = async () => {
    setServerError("");
    const response = await fetch(`/api/organization/inventory/items/${encodeURIComponent(currentItem.item_code)}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      setIsDeleteOpen(false);
      return;
    }
    router.push(listPath);
    router.refresh();
  };

  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>package_2</span></div>
            <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{itemName || currentItem.item_name}</h1>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="secondary" icon="check_circle" disabled={currentItem.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={currentItem.status === "INACTIVE" || Deactivate(currentItem).length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" onClick={() => setIsDeleteOpen(true)} />
          </div>
        </div>
        <div className={layout.slotAlert}><ValidationAlert errors={[...validation.errors, ...(serverError ? [serverError] : [])]} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} /></div>
      </header>

      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(currentItem.status)}>{currentItem.status}</Badge>
          </div>
        </div>
        <AuditPanel
          id={currentItem.id}
          creationDate={currentItem.audit.created.date}
          updatedDate={currentItem.audit.updated.date}
          creationActorType={currentItem.audit.created.actorType}
          creationUser={currentItem.audit.created.user}
          updatedActorType={currentItem.audit.updated.actorType}
          updatedUser={currentItem.audit.updated.user}
          auditHref={`/organization/audit?entityType=inventory_item&entityCode=${encodeURIComponent(currentItem.item_code)}`}
          mutationId={currentItem.audit.updated.mutationId ?? currentItem.audit.created.mutationId}
        />
      </aside>

      <main className={layout.mainSection}>
        <InventoryItemDetailsForm itemCode={itemCode} itemName={itemName} description={description} itemType={itemType} categoryCode={categoryCode} unitCode={unitCode} balances={currentItem} itemTypeOptions={ITEM_TYPE_OPTIONS} categoryOptions={categoryOptions} showBalances={false} codeDisabled={ChangeCodeAvailability(currentItem).length > 0} codeDisabledTitle="Items with postings cannot have their code changed" saving={saving} errors={{ item_code: validation.hasError("item_code"), item_name: validation.hasError("item_name"), description: validation.hasError("description"), category_code: validation.hasError("category_code"), unit_code: validation.hasError("unit_code") }} onChange={changeField} onSave={() => { void save(); }} />
      </main>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Item"
        message={currentItem.hasPostings
          ? `Are you sure you want to permanently delete item ${currentItem.item_code}? This item has postings. Its inventory ledger postings will also be permanently deleted.`
          : `Are you sure you want to permanently delete item ${currentItem.item_code}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => { void deleteItem(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={`Item ${currentItem.item_code} saved`} />
    </div>
  );
}
