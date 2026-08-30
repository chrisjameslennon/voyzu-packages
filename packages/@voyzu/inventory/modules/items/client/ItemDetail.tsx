"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/audit/client";
import { Badge, Breadcrumbs, Button, Checkbox, ConfirmDialog, DropdownMenu, Input, SearchableSelect, TabGroup, Toast, ValidationAlert, pattern, required, useFormValidation, type DropdownMenuItem } from "@voyzu/ui-components";
import { DetailBackButton, detailLinkWithBackContext } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { ItemListRow } from "../types/item-list.types";
import type { ItemCategoryOptionDto, ItemComponentDto, ItemPatchRequestDto, ItemResponseDto } from "../types/item.types";
import { UNIT_VALUES } from "../../core/types";
import type { Unit } from "../../core/types";
import styles from "./items.module.css";

const UNIT_OPTIONS = UNIT_VALUES.map((unit) => ({ value: unit, label: unit }));
function isEmptyCustomValue(value: ItemResponseDto["customFields"][number]["value"] | undefined) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

export function ItemDetail({ item, categories, itemOptions }: { item: ItemResponseDto; categories: ItemCategoryOptionDto[]; itemOptions: ItemListRow[]; }) {
  const router = useRouter(); const pathname = usePathname(); const [current, setCurrent] = useState(item);
  const [name, setName] = useState(item.name); const [description, setDescription] = useState(item.description); const [categoryId, setCategoryId] = useState(item.category ? String(item.category.id) : "");
  const [unit, setUnit] = useState<Unit | "">(item.unit ?? ""); const [quantityTracked, setQuantityTracked] = useState(item.quantityTracked);
  const [itemType, setItemType] = useState(item.itemType); const [components, setComponents] = useState<ItemComponentDto[]>(item.components); const [componentId, setComponentId] = useState(""); const [componentQuantity, setComponentQuantity] = useState("1");
  const [editingComponent, setEditingComponent] = useState<ItemComponentDto | null>(null); const [editingQuantity, setEditingQuantity] = useState("");
  const [customValues, setCustomValues] = useState<Record<number, ItemResponseDto["customFields"][number]["value"]>>(Object.fromEntries(item.customFields.map((field) => [field.id, field.value])));
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false); const [showDelete, setShowDelete] = useState(false); const [showNameWarning, setShowNameWarning] = useState(false); const [toast, setToast] = useState("");
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
    unit: { label: "unit", value: unit, enabled: quantityTracked, rules: [required()] },
    components: { label: "assembly components", value: String(components.length), enabled: itemType === "ASSEMBLY", rules: [{ kind: "format" as const, test: (value) => Number(value) >= 2, message: "An assembly must contain at least two components" }] },
  }));
  const componentValidation = useFormValidation(() => ({
    component: { label: "component", value: componentId, rules: [required()] },
    quantity: { label: "quantity", value: componentQuantity, rules: [required(), pattern(/^[1-9]\d*$/, "Quantity must be a positive whole number")] },
  }));
  const editingValidation = useFormValidation(() => ({
    quantity: { label: "quantity", value: editingQuantity, rules: [required(), pattern(/^[1-9]\d*$/, "Quantity must be a positive whole number")] },
  }));
  const request = async (path: string, init: RequestInit) => { setError(""); const response = await fetch(path, init); if (!response.ok) { const body = await response.json().catch(() => null) as { message?: string } | null; setError(body?.message ?? "The operation could not be completed"); return null; } return response; };
  const save = async () => { if (!validation.attempt()) return; const missingCustomFields = current.customFields.filter((field) => field.required && field.status === "ACTIVE" && isEmptyCustomValue(customValues[field.id])); if (missingCustomFields.length) { setError(`Complete required custom field${missingCustomFields.length === 1 ? "" : "s"}: ${missingCustomFields.map(({ name: fieldName }) => fieldName).join(", ")}`); return; }
    setSaving(true); try { const payload: ItemPatchRequestDto = { name: name.trim(), description: description.trim(), categoryId: categoryId ? Number(categoryId) : null, unit: quantityTracked && unit ? unit : null, quantityTracked,
      itemType, components: itemType === "ASSEMBLY" ? components.map(({ itemId, quantity }) => ({ itemId, quantity })) : [],
      customFields: current.customFields.filter(({ status }) => status === "ACTIVE").map((field) => ({ customFieldId: field.id, value: customValues[field.id] ?? null })) };
    const response = await request(`/api/inventory/items/${encodeURIComponent(current.sku)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response) return;
    const changed = await response.json() as ItemResponseDto; setCurrent(changed); setComponents(changed.components); setCustomValues(Object.fromEntries(changed.customFields.map((field) => [field.id, field.value]))); setToast(`Item ${changed.sku} saved`); } finally { setSaving(false); } };
  const requestSave = () => { if (current.inUse && name.trim() !== current.name) setShowNameWarning(true); else void save(); };
  const transition = async (action: "activate" | "deactivate") => { const response = await request(`/api/inventory/items/${encodeURIComponent(current.sku)}/${action}`, { method: "POST" }); if (!response) return; const changed = await response.json() as ItemResponseDto; setCurrent(changed); setToast(`Item ${changed.sku} ${action}d`); };
  const remove = async () => { const response = await request(`/api/inventory/items/${encodeURIComponent(current.sku)}`, { method: "DELETE" }); if (!response) return; window.sessionStorage.setItem("inventory-items-toast", `Item ${current.sku} deleted`); router.push("/inventory/items"); router.refresh(); };
  const addComponent = () => { if (!componentValidation.attempt()) return; const candidate = itemOptions.find(({ id }) => String(id) === componentId); if (!candidate) return;
    if (components.some(({ itemId }) => itemId === candidate.id)) { setError(`${candidate.sku} is already a component`); return; }
    setComponents((values) => [...values, { itemId: candidate.id, sku: candidate.sku, name: candidate.name, quantity: Number(componentQuantity), unit: candidate.unit }]);
    setComponentId(""); setComponentQuantity("1"); setError(""); componentValidation.reset(); };
  const openComponentEditor = (component: ItemComponentDto) => { setEditingComponent(component); setEditingQuantity(String(component.quantity)); editingValidation.reset(); };
  const closeComponentEditor = () => { setEditingComponent(null); setEditingQuantity(""); editingValidation.reset(); };
  const updateComponentQuantity = () => { if (!editingValidation.attempt() || !editingComponent) return; const quantity = Number(editingQuantity);
    setComponents((values) => values.map((component) => component.itemId === editingComponent.itemId ? { ...component, quantity } : component)); closeComponentEditor(); };
  const componentActions = (component: ItemComponentDto): DropdownMenuItem[] => [
    { value: "edit", label: "Edit", icon: "edit", onSelect: () => openComponentEditor(component) },
    { value: "remove", label: "Remove", icon: "delete", variant: "danger", onSelect: () => setComponents((values) => values.filter(({ itemId }) => itemId !== component.itemId)) },
  ];
  const candidates = itemOptions.filter((candidate) => candidate.id !== current.id && candidate.itemType === "SINGLE_ITEM" && candidate.quantityTracked && candidate.status === "ACTIVE" && !components.some(({ itemId }) => itemId === candidate.id));
  const details = <div className={styles.detailStack}><section className={detailStyles.card}><div className={detailStyles.cardHeader}><h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Item Details</h2><div className={detailStyles.cardHeaderActions}><Button variant="secondary" icon="save" disabled={saving} onClick={requestSave}>{saving ? "Saving..." : "Save"}</Button></div></div><div className={detailStyles.formGrid}>
    <div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>SKU</label><Input value={current.sku} disabled /></div>
    <div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Name</label><Input value={name} invalid={validation.hasError("name")} onChange={(event) => setName(event.target.value)} /></div>
    <div className={`${detailStyles.fieldGroup} ${detailStyles.fieldFull}`}><label className={typography.fieldLabel}>Description</label><textarea className={styles.textarea} value={description} rows={3} onChange={(event) => setDescription(event.target.value)} /></div>
    <div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Category</label><SearchableSelect value={categoryId} onChange={setCategoryId} clearable options={categories.map((category) => ({ value: String(category.id), label: category.name, code: category.code }))} placeholder="Uncategorised" /></div>
    <label className={styles.checkboxField}><Checkbox checked={quantityTracked} onChange={(checked) => { setQuantityTracked(checked); if (!checked) setUnit(""); }} /><span>Quantity Tracked</span></label>
    <div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Unit</label><SearchableSelect value={unit} onChange={(value) => setUnit(value as Unit)} options={UNIT_OPTIONS} searchable={false} disabled={!quantityTracked} placeholder={quantityTracked ? "Select a unit" : "Not applicable"} /></div>
  </div></section></div>;
  const assembly = <div className={styles.detailStack}><section className={detailStyles.card}>
    <div className={detailStyles.cardHeader}><h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Assembly Details</h2><div className={detailStyles.cardHeaderActions}><Button variant="secondary" icon="save" disabled={saving} onClick={requestSave}>{saving ? "Saving..." : "Save"}</Button></div></div>
    <div className={detailStyles.formGrid}><div className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>Item Type</label><SearchableSelect value={itemType} onChange={(value) => setItemType(value as "SINGLE_ITEM" | "ASSEMBLY")} searchable={false} options={[{ value: "SINGLE_ITEM", label: "Single Item" }, { value: "ASSEMBLY", label: "Assembly (Multiple Items)" }]} /></div></div>
    <div className={styles.assemblyComponentsSection}>
      {itemType === "ASSEMBLY" ? <>
        <h2 className={`${typography.sectionHeading} ${validation.hasError("components") ? styles.invalidSectionHeading : ""}`}>Assembly Components</h2>
        <div className={styles.componentAdderPanel}><div className={styles.componentAdder}><SearchableSelect value={componentId} onChange={setComponentId} hasError={componentValidation.hasError("component")} options={candidates.map((candidate) => ({ value: String(candidate.id), label: candidate.name, code: candidate.sku }))} placeholder="Select component to add" /><Input type="number" min="1" step="1" invalid={componentValidation.hasError("quantity")} value={componentQuantity} onChange={(event) => setComponentQuantity(event.target.value)} /><Button variant="secondary" icon="add" onClick={addComponent}>Add Component</Button></div></div>
        <div className={`${detailStyles.tableWrap} ${styles.componentTableWrap}`}><table className={detailStyles.table}><thead><tr><th>Item SKU</th><th>Item Name</th><th className={detailStyles.numericCell}>Quantity</th><th>Unit</th><th /></tr></thead><tbody>{components.length ? components.map((component) => <tr key={component.itemId}><td className={detailStyles.strongCell}>{component.sku}</td><td>{component.name}</td><td className={detailStyles.numericCell}>{component.quantity}</td><td>{component.unit ?? "—"}</td><td className={styles.componentActionCell}><DropdownMenu trigger={<Button variant="plain" icon="more_horiz" title={`Actions for ${component.sku}`} />} items={componentActions(component)} alignment="right" width={180} /></td></tr>) : <tr><td colSpan={5} className={styles.emptyCell}>No components have been added.</td></tr>}</tbody></table></div>
      </> : <div className={styles.assemblyNotice}><div><h3 className={typography.sectionHeading}>Assembly components do not apply</h3><p className={typography.bodyText}>Assembly details only apply to assemblies. Change Item Type to Assembly to define component items and quantities.</p></div></div>}
    </div>
  </section></div>;
  const customFields = <section className={detailStyles.card}><div className={detailStyles.cardHeader}><h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Custom Fields</h2><Button variant="secondary" icon="save" disabled={saving || !current.customFields.some(({ status }) => status === "ACTIVE")} onClick={requestSave}>{saving ? "Saving..." : "Save"}</Button></div>
    {current.customFields.length ? <div className={detailStyles.formGrid}>{current.customFields.map((field) => { const disabled = field.status !== "ACTIVE"; const value = customValues[field.id]; const label = `${field.name}${field.required ? " *" : ""}`;
      if (field.dataType === "BOOLEAN") return <label key={field.id} className={styles.checkboxField}><Checkbox checked={value === true} disabled={disabled} onChange={(checked) => setCustomValues((values) => ({ ...values, [field.id]: checked }))} /><span>{label}</span></label>;
      if (field.dataType === "OPTION") return <div key={field.id} className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>{label}</label><SearchableSelect value={typeof value === "number" ? String(value) : ""} onChange={(selected) => setCustomValues((values) => ({ ...values, [field.id]: selected ? Number(selected) : null }))} clearable disabled={disabled} options={field.options.map((option) => ({ value: String(option.id), label: option.value }))} /></div>;
      if (field.dataType === "MULTIPLE_OPTIONS") return <div key={field.id} className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>{label}</label><SearchableSelect multiple value={Array.isArray(value) ? value.map(String) : []} onChange={(selected) => setCustomValues((values) => ({ ...values, [field.id]: selected.map(Number) }))} disabled={disabled} options={field.options.map((option) => ({ value: String(option.id), label: option.value }))} /></div>;
      return <div key={field.id} className={detailStyles.fieldGroup}><label className={typography.fieldLabel}>{label}</label><Input type={field.dataType === "NUMBER" ? "number" : field.dataType === "DATE" ? "date" : "text"} disabled={disabled} value={typeof value === "string" || typeof value === "number" ? value : ""} onChange={(event) => setCustomValues((values) => ({ ...values, [field.id]: field.dataType === "NUMBER" ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value }))} /></div>;
    })}</div> : <p className={typography.bodyText}>No item custom fields are configured for this organization.</p>}
  </section>;

  return <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}><header className={layout.detailHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>box</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{name}</h1></div></div><div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref="/inventory/items" /><div className={detailStyles.headerActionSeparator} /><Button variant="secondary" icon="check_circle" disabled={current.status === "ACTIVE"} onClick={() => { void transition("activate"); }}>Activate</Button><Button variant="secondary" icon="block" disabled={current.status === "INACTIVE"} onClick={() => { void transition("deactivate"); }}>Deactivate</Button><div className={detailStyles.headerActionSeparator} /><Button variant="danger" icon="delete" title={current.inUse ? "In-use items cannot be deleted" : "Delete item"} disabled={current.inUse} onClick={() => setShowDelete(true)} /></div></div><div className={layout.slotAlert}><ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(componentValidation.showErrors ? componentValidation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || componentValidation.showErrors || !!error} onDismiss={() => { validation.dismiss(); componentValidation.dismiss(); setError(""); }} /></div></header>
    <aside className={layout.statusSection}><div className={detailStyles.card}><label className={typography.fieldLabel}>Status</label><Badge variant="soft" size="x-large" color={current.status === "ACTIVE" ? "success" : "neutral"}>{current.status}</Badge>{current.inUse ? <Badge variant="soft" size="medium" color="success">IN USE</Badge> : null}</div><AuditPanel id={current.id} creationDate={current.audit.created.date} updatedDate={current.audit.updated.date} creationActorType={current.audit.created.actorType} creationUser={current.audit.created.user} updatedActorType={current.audit.updated.actorType} updatedUser={current.audit.updated.user} auditHref={(() => { const mutationId = current.audit.updated.mutationId ?? current.audit.created.mutationId; const filter = mutationId ? `mutationId=${encodeURIComponent(mutationId)}` : `entityType=item&entityId=${current.id}`; return detailLinkWithBackContext(`/settings/audit?${filter}`, "audit", pathname); })()} onNavigate={(href) => router.push(href)} /></aside>
    <main className={layout.mainSection}><TabGroup defaultKey="details" tabs={[{ key: "details", label: "Details", content: details }, { key: "assembly", label: "Assembly", content: assembly }, { key: "custom-fields", label: "Custom Fields", content: customFields }]} /></main>
    {editingComponent ? <div className={modalStyles.backdrop}><div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}><div className={modalStyles.header}><h3 className={typography.contentTitle}>Edit Assembly Component</h3><Button variant="plain" icon="close" title="Close" onClick={closeComponentEditor} /></div><div className={modalStyles.body}><ValidationAlert errors={editingValidation.errors} visible={editingValidation.showErrors} onDismiss={editingValidation.dismiss} /><div className={modalStyles.fieldGroup}><label className={typography.fieldLabel}>Item</label><Input value={`${editingComponent.sku} — ${editingComponent.name}`} disabled /></div><div className={modalStyles.fieldGroup}><label className={typography.fieldLabel}>Quantity</label><Input type="number" min="1" step="1" invalid={editingValidation.hasError("quantity")} value={editingQuantity} onChange={(event) => setEditingQuantity(event.target.value)} /></div></div><div className={modalStyles.footer}><Button variant="cancel" onClick={closeComponentEditor}>Cancel</Button><Button variant="primary" onClick={updateComponentQuantity}>Update Quantity</Button></div></div></div> : null}
    <ConfirmDialog isOpen={showDelete} title="Delete Item" message={`Permanently delete ${current.sku} — ${current.name}?`} confirmLabel="Delete" confirmVariant="danger" onClose={() => setShowDelete(false)} onConfirm={() => { void remove(); }} />
    <ConfirmDialog isOpen={showNameWarning} title="Rename In-use Item" message={`This item is in use. Changing its name may affect how it is recognised in existing inventory records. Continue?`} confirmLabel="Continue and Save" onClose={() => setShowNameWarning(false)} onConfirm={() => { setShowNameWarning(false); void save(); }} />
    <Toast isVisible={!!toast} onClose={() => setToast("")} message={toast} />
  </div>;
}
