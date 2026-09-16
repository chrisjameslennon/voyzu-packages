"use client";
import { LinkButton } from "@voyzu/ui-components";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import { AuditPanel } from "@voyzu/ui-business-components";
import { useRouter } from "next/navigation";
import { ValidationAlert, useFormValidation, required, maxLength, Badge, Breadcrumbs, Button, ConfirmDialog, DropdownMenu, Input, SearchableSelect, TabGroup, Textarea, Toast, ToggleSwitch } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import modal from "@voyzu/ui-style/css-modules/modal.module.css";
import type { ProductDetail, ProductEditDto, ProductOption, ProductVariant } from "../types/product-detail.dto";
import type { ProductConfigurationRowDto } from "../types/product-configuration.dto";
import { combinationKey, generateVariants, variantMatchesOptions } from "../domain/product-variants";
import type { InventoryItem, InventoryItemAvailability } from "@voyzu/types/business-objects/inventory-item";
import { saveProductInventoryAction, saveProductAction, transitionProductAction } from "../server/actions/product.actions";
import styles from "./product-detail.module.css";
import { productTabFields } from "./product-form-validation";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className={detail.fieldGroup}><span className={typography.fieldLabel}>{label}</span>{children}</div>;
}
function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className={styles.dialog} onCancel={close} aria-label={title}>
    <div className={modal.header}><h2 className={typography.sectionHeading}>{title}</h2><Button variant="plain" icon="close" aria-label="Close dialog" onClick={close} /></div>
    <div className={modal.body}>{children}</div>
  </dialog>;
}
const selectOptions = (values: string[]) => [...new Set(values)].map((value) => ({ value, label: value }));

export function ProductDetailView({ initial, lists, categories, optionLists, pricingCategories, inventoryItems, inventoryAvailability, initialInventoryLinks }: {
  pricingCategories: { code: string; name: string; status: string }[];
  inventoryAvailability: InventoryItemAvailability[];
  inventoryItems: InventoryItem[] | null; initialInventoryLinks: Record<string, number>;
  initial: ProductDetail; lists: ProductConfigurationRowDto[]; categories: ProductConfigurationRowDto[]; optionLists: ProductConfigurationRowDto[];
}) {
  const router = useRouter();
  const [product, setProduct] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [tab, setTab] = useState("details");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [inventoryLinks, setInventoryLinks] = useState(initialInventoryLinks);
  const [imageEditor, setImageEditor] = useState<{ id: string; path: string } | null>(null);
  const imageValidation = useFormValidation(() => ({ path: { label: "image override path", value: imageEditor?.path ?? "", rules: [maxLength(2000)] } }));
  const [optionEditor, setOptionEditor] = useState<ProductOption | null>(null);
  const [optionError, setOptionError] = useState("");
  const [optionSource, setOptionSource] = useState("custom");
  const [variantEditor, setVariantEditor] = useState<Record<string, string> | null>(null);
  const [variantSku, setVariantSku] = useState("");
  const [variantError, setVariantError] = useState("");
  const validation = useFormValidation(() => productTabFields(product, tab));
  const optionValidation = useFormValidation(() => ({
    name: { label: "option name", value: optionEditor?.name ?? "", rules: [required(), maxLength(100)], enabled: optionSource === "custom" },
    list: { label: "product option list", value: optionEditor?.sourceListCode ?? "", rules: [required()], enabled: optionSource === "shared" },
    values: { label: "value for the option", value: optionEditor?.values.filter((value) => value.trim()).join("\n") ?? "", rules: [required(), {
      kind: "format", test: () => !optionEditor || optionEditor.values.every((value) => value.trim().length <= 100),
      message: "Each option value must be 100 characters or less",
    }] },
  }));
  const variantValidation = useFormValidation(() => ({
    sku: { label: "variant SKU", value: variantSku, rules: [required(), maxLength(100)] },
    ...Object.fromEntries(product.options.map((option) => [option.id, { label: option.name.toLowerCase(), value: variantEditor?.[option.id] ?? "", rules: [required()] }])),
  }));
  const change = <K extends keyof ProductEditDto>(key: K, value: ProductEditDto[K]) => {
    setProduct((current) => ({ ...current, [key]: value })); setMessage("");
  };
  const save = (saveTab: "details" | "images" | "variants" | "pricing" | "custom") => {
    setError(""); setMessage("");
    if (!validation.attempt()) return;
    startTransition(async () => {
      try {
        const { id: _id, code: _code, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = product;
        const result = await saveProductAction(product.code, saveTab, input);
        if (result.error || !result.product) { setError(result.error ?? "Unable to save product."); return; }
        const keys: Record<typeof saveTab, (keyof ProductEditDto)[]> = {
          details: ["name", "type", "category", "brand", "manufacturer", "salesUnit", "shortDescription", "description"],
          images: ["images"], variants: ["variantPricing", "useVariants", "options", "variants"], pricing: ["basePrice", "pricingCategoryCode"], custom: ["customFields"],
        };
        const patch = Object.fromEntries(keys[saveTab].map((key) => [key, result.product![key]]));
        setProduct((current) => ({ ...current, ...patch, updatedAt: result.product!.updatedAt }));
        setSaved((current) => ({ ...current, ...patch, updatedAt: result.product!.updatedAt }));
        const tabName = { details: "Details", images: "Images", variants: "Variants", pricing: "Pricing", custom: "Custom Fields" }[saveTab];
        validation.reset();
        setMessage(`${tabName} saved`); router.refresh();
      } catch { setError("The product could not be saved. Please try again."); }
    });
  };
  const transition = (operation: "activate" | "deactivate" | "delete") => {
    setError(""); setMessage("");
    startTransition(async () => {
      try {
        const result = await transitionProductAction(product.code, operation);
        if (result.error) { setError(result.error); return; }
        if (operation === "delete") { router.push("/commercial/products"); router.refresh(); return; }
        if (result.product) {
          const { status, updatedAt } = result.product;
          setProduct((current) => ({ ...current, status, updatedAt }));
          setSaved((current) => ({ ...current, status, updatedAt }));
          setMessage(operation === "activate" ? "Product activated." : "Product deactivated.");
        }
        router.refresh();
      } catch { setError("The operation could not be completed. Please try again."); }
    });
  };
  const saveButton = (saveTab: "details" | "images" | "variants" | "pricing" | "custom") =>
    <Button variant="secondary" icon="save" disabled={pending} onClick={() => save(saveTab)}>{pending ? "Saving…" : "Save"}</Button>;
  const generate = () => {
    try { change("variants", generateVariants(product.code, product.options, product.variants, product.basePrice)); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to generate variants."); }
  };
  const openOption = (option?: ProductOption) => {
    optionValidation.reset();
    setOptionError(""); setOptionSource(!option || option.sourceListCode ? "shared" : "custom");
    setOptionEditor(option ? structuredClone(option) : { id: crypto.randomUUID(), name: "", sourceListCode: null, values: [  ] });
  };
  const saveOption = () => {
    if (!optionEditor || !optionValidation.attempt()) return;
    const option = { ...optionEditor, name: optionEditor.name.trim(), values: [...new Set((optionSource === "shared" ? optionLists.find((list) => list.code === optionEditor.sourceListCode)?.values ?? [] : optionEditor.values).map((value) => value.trim()).filter(Boolean))] };
    if (!option.name || !option.values.length) { setOptionError("Enter an option name and at least one value."); return; }
    if (optionSource === "shared" && !option.sourceListCode) { setOptionError("Choose a shared product option list."); return; }
    if (product.options.some((existing) => existing.id !== option.id && existing.name.toLowerCase() === option.name.toLowerCase())) { setOptionError("This product already has an option with that name."); return; }
    const options = [...product.options.filter((existing) => existing.id !== option.id), option];
    try {
      const variants = generateVariants(product.code, options, product.variants, product.basePrice).filter((variant) => !Object.keys(variant.options).length || variantMatchesOptions(variant, options));
      setProduct((current) => ({ ...current, options, variants }));
      setOptionEditor(null);
    } catch (cause) { setOptionError(cause instanceof Error ? cause.message : "Unable to generate variants."); }
  };
  const updateVariant = (id: string, patch: Partial<ProductVariant>) => change("variants", product.variants.map((variant) => variant.id === id ? { ...variant, ...patch } : variant));
  const addVariant = () => {
    if (!variantEditor || !variantValidation.attempt()) return;
    if (!variantSku.trim() || product.options.some((option) => !option.values.includes(variantEditor[option.id]))) { setVariantError("Choose a value for every option and enter a SKU."); return; }
    const previous = product.variants.find((variant) => combinationKey(variant.options) === combinationKey(variantEditor));
    if (previous) { setVariantError("This combination already exists."); return; }
    change("variants", [...product.variants, { id: crypto.randomUUID(), sku: variantSku.trim(), basePrice: product.basePrice, status: "ACTIVE", options: variantEditor, imagePath: "" }]);
    setVariantEditor(null);
  };
  const referenceSelect = (label: string, key: "category" | "brand" | "manufacturer" | "salesUnit", values: string[]) =>
    <Field label={label}><SearchableSelect ariaLabel={label} value={product[key] ?? ""} clearable options={selectOptions([...(product[key] ? [product[key]!] : []), ...values])} onChange={(value) => change(key, key === "manufacturer" ? value : value || null)} /></Field>;
  const optionsContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Product Options</h3><Button variant="secondary" icon="add" onClick={() => openOption()}>Add Option</Button></div>
    {!product.options.length && <div className={styles.emptyOptions}>Add options to generate a variant matrix.</div>}
    {product.options.length > 0 && <div><table className={`${detail.table} ${styles.optionsTable}`}><thead><tr><th>Product Option</th><th /></tr></thead><tbody>
    {product.options.map((option) => <tr key={option.id}>
      <td>{option.name}</td><td><DropdownMenu trigger={<Button variant="plain" icon="more_horiz" aria-label={option.name + " actions"} />} alignment="right" items={[
        { value: "edit", label: "Edit Option", icon: "edit", onSelect: () => openOption(option) },
        { value: "remove", label: "Remove Option", icon: "delete", onSelect: () => { const options = product.options.filter((row) => row.id !== option.id); change("options", options); } },
      ]} /></td>
    </tr>)}
    </tbody></table></div>}
  </div>;
  const detailsContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Product Details</h3>{saveButton("details")}</div>
    <div className={detail.formGrid}>
      <Field label="Product Code"><Input aria-label="Product Code" disabled value={product.code} /></Field>
      <Field label="Name"><Input invalid={validation.hasError("name")} aria-label="Name" value={product.name} onChange={(event) => change("name", event.target.value)} /></Field>
      <Field label="Type"><SearchableSelect ariaLabel="Type" searchable={false} options={selectOptions(["Physical", "Service", "Other"])} value={product.type} onChange={(value) => change("type", value as ProductEditDto["type"])} /></Field>
      {referenceSelect("Category", "category", categories.filter((row) => row.status === "ACTIVE").map((row) => row.name))}
      {referenceSelect("Brand", "brand", lists.find((row) => row.code === "BRAND" && row.status === "ACTIVE")?.values ?? [])}
      {referenceSelect("Manufacturer", "manufacturer", lists.find((row) => row.code === "MANUFACTURER" && row.status === "ACTIVE")?.values ?? [])}
      {referenceSelect("Sales Unit", "salesUnit", lists.find((row) => row.code === "SALES-UNIT" && row.status === "ACTIVE")?.values ?? [])}
      <Field label="Status"><Input aria-label="Status" value={product.status} disabled /></Field>
    </div>
    <Field label="Short Description"><Textarea invalid={validation.hasError("shortDescription")} aria-label="Short Description" rows={2} value={product.shortDescription} onChange={(event) => change("shortDescription", event.target.value)} /></Field>
    <Field label="Description"><Textarea invalid={validation.hasError("description")} aria-label="Description" rows={6} value={product.description} onChange={(event) => change("description", event.target.value)} /></Field>
  </div>;
  const imagesContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Images</h3><div className={detail.cardHeaderActions}><Button variant="secondary" icon="add" onClick={() => change("images", [...product.images, { path: "", primary: !product.images.length }])}>Add Image Path</Button>{saveButton("images")}</div></div>
    <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Image Path</th><th>Primary</th><th /></tr></thead><tbody>
      {product.images.map((image, index) => <tr key={index}><td><Input invalid={validation.hasError("image-" + index)} aria-label={"Image path " + (index + 1)} value={image.path} onChange={(event) => change("images", product.images.map((row, i) => i === index ? { ...row, path: event.target.value } : row))} /></td>
        <td><input type="radio" aria-label={"Use image " + (index + 1) + " as primary"} name="primary-image" checked={image.primary} onChange={() => change("images", product.images.map((row, i) => ({ ...row, primary: i === index })))} /></td>
        <td><Button variant="plain" icon="delete" aria-label="Remove image" onClick={() => { const next = product.images.filter((_, i) => i !== index); if (image.primary && next[0]) next[0] = { ...next[0], primary: true }; change("images", next); }} /></td></tr>)}
      {!product.images.length && <tr><td colSpan={3} className={detail.emptyCell}>No images yet.</td></tr>}
    </tbody></table></div>
  </div>;
  const matrixRows = product.variants.filter((variant) => Object.keys(variant.options).length > 0);
  const variantsContent = <div className={detail.stack}>
    <div className={styles.variantSaveRow}>{saveButton("variants")}</div>
      <div className={styles.variantControls}>
        <div className={detail.fieldGroup}><h3 id="use-variants-heading" className={typography.fieldLabel}>Use Variants</h3><div role="group" aria-labelledby="use-variants-heading"><ToggleSwitch checked={product.useVariants} onChange={(checked) => change("useVariants", checked)} /></div></div>
        <Field label="Variant Pricing"><SearchableSelect ariaLabel="Variant Pricing" searchable={false} disabled={!product.useVariants} value={product.variantPricing} options={[{ value: "BASE_PRICE", label: "All variants use the base price" }, { value: "OWN_PRICES", label: "Variants have their own prices" }]} onChange={(value) => change("variantPricing", value as ProductEditDto["variantPricing"])} /></Field>
      </div>
    <hr className={styles.variantDivider} />
    {product.useVariants && <>
    {optionsContent}
    {matrixRows.length > 0 && <div className={detail.dividedStack}>
      <h3 className={typography.sectionHeading}>Variant Matrix</h3>
      <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Variant</th><th>SKU</th>{product.variantPricing === "OWN_PRICES" && <th>Price</th>}<th>Status</th><th /></tr></thead><tbody>
        {matrixRows.map((variant) => <tr key={variant.id}>
          <td>{Object.values(variant.options).join(" / ") || "Default"}</td><td><Input invalid={validation.hasError("sku-" + variant.id)} aria-label={"SKU for " + variant.id} value={variant.sku} onChange={(event) => updateVariant(variant.id, { sku: event.target.value })} /></td>
          {product.variantPricing === "OWN_PRICES" && <td><Input aria-label={"Price for " + variant.sku} invalid={validation.hasError("variant-price-" + variant.id)} type="number" decimalPlaces={2} min={0} step="0.01" value={Number.isFinite(variant.basePrice) ? variant.basePrice! : ""} onChange={(event) => updateVariant(variant.id, { basePrice: event.target.value.trim() === "" ? NaN : Number(event.target.value) })} /></td>}
          <td><Badge variant="soft" size="x-small" color={variant.status === "ACTIVE" ? "success" : "neutral"}>{variant.status}</Badge></td>
          <td><div className={detail.cardHeaderActions}><Button variant="secondary-destructive" icon="delete" aria-label={"Delete variant " + variant.sku} onClick={() => change("variants", product.variants.filter((row) => row.id !== variant.id))} /><Button variant="secondary" icon="image" aria-label={"Image override for " + variant.sku} onClick={() => { imageValidation.reset(); setImageEditor({ id: variant.id, path: variant.imagePath }); }} /></div></td></tr>)}
      </tbody></table></div>
      <p className={styles.muted}>{matrixRows.length} variants</p>
    </div>}
    {product.options.length > 0 && <div className={detail.actions}>
      <Button variant="secondary" icon="refresh" onClick={generate}>Regenerate Variants</Button>
      <Button variant="secondary" icon="add" onClick={() => { variantValidation.reset(); setVariantError(""); setVariantSku(""); setVariantEditor({}); }}>Add Variant</Button>
    </div>}
    </>}
  </div>;
  const pricingContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Pricing</h3>{saveButton("pricing")}</div>
    <div className={detail.formGrid}><Field label="Base Price"><Input invalid={validation.hasError("basePrice")} aria-label="Base Price" type="number" decimalPlaces={2} min={0} step="0.01" value={Number.isFinite(product.basePrice) ? product.basePrice : ""} onChange={(event) => change("basePrice", event.target.value.trim() === "" ? NaN : Number(event.target.value))} /></Field></div>
    <Field label="Pricing Category"><SearchableSelect ariaLabel="Pricing Category" clearable value={product.pricingCategoryCode ?? ""} options={pricingCategories.filter((row) => row.status === "ACTIVE" || row.code === product.pricingCategoryCode).map((row) => ({ value: row.code, label: row.name }))} onChange={(value) => change("pricingCategoryCode", value || null)} /></Field>
    <p className={typography.bodyText}>Products in Voyzu have a base price. If you are using variants each variant can optionally have its own base price. Pricing categories can be used to <a className={typography.link} href="/commercial/products/pricing-categories">bulk adjust pricing</a>. Customers can optionally receive pricing discounts based on Customer Price Lists.</p>
  </div>;
  const inventoryVariants = product.variants.filter((variant) => product.useVariants ? Object.keys(variant.options).length > 0 : Object.keys(variant.options).length === 0);
  const saveInventory = () => {
    setError(""); setMessage("");
    startTransition(async () => {
      try {
        const links = Object.fromEntries(Object.entries(inventoryLinks).filter(([id]) => product.variants.some((variant) => variant.id === id)));
        const result = await saveProductInventoryAction(product.code, links);
        if (result.error || !result.links) { setError(result.error ?? "Unable to save inventory links."); return; }
        setInventoryLinks(result.links); setMessage("Inventory saved"); router.refresh();
      } catch { setError("Inventory links could not be saved. Please try again."); }
    });
  };
  const inventoryContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Inventory</h3><Button variant="secondary" icon="save" disabled={pending} onClick={saveInventory}>Save</Button></div>
    {inventoryVariants.map((variant) => {
      const item = inventoryItems?.find((row) => row.id === inventoryLinks[variant.id]);
      return <section key={variant.id} className={styles.optionCard}>
        {product.useVariants && <h3 className={typography.sectionHeading}>{Object.values(variant.options).join(" / ")}</h3>}
        <Field label="Inventory Item"><SearchableSelect ariaLabel={"Inventory item for " + variant.sku} clearable placeholder="Select an inventory item" value={String(inventoryLinks[variant.id] ?? "")} options={(inventoryItems ?? []).filter((row) => row.status === "ACTIVE").map((row) => ({ value: String(row.id), label: row.sku + " - " + row.name }))} onChange={(value) => setInventoryLinks((current) => { const next = { ...current }; if (value) next[variant.id] = Number(value); else delete next[variant.id]; return next; })} /></Field>
        {item ? <div className={styles.inventoryInfo}>
          <div className={styles.inventoryInfoHeader}><span><strong>SKU:</strong> {item.sku}</span><span><strong>Unit:</strong> {item.unit ?? "None"}</span><LinkButton className={styles.inventoryLink} href={"/inventory/items/" + encodeURIComponent(item.sku)}>View inventory item</LinkButton></div>
          <h4 className={typography.sectionHeading}>Availability by Warehouse</h4>
          {item.quantityTracked ? <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Warehouse</th><th>On Hand</th><th>Reserved</th><th>Available</th></tr></thead><tbody>
            {inventoryAvailability.filter((position) => position.itemId === item.id).map((position) => <tr key={position.warehouseId}><td>{position.warehouseName}</td><td>{position.onHand.toLocaleString()}</td><td>{position.reserved.toLocaleString()}</td><td>{position.available.toLocaleString()}</td></tr>)}
            {!inventoryAvailability.some((position) => position.itemId === item.id) && <tr><td colSpan={4} className={detail.emptyCell}>No stock recorded for this item.</td></tr>}
          </tbody></table></div> : <p>Quantities are not tracked for this item.</p>}
        </div> : inventoryLinks[variant.id] ? <p>The linked inventory item is no longer available. Select another item or clear the link.</p> : null}
      </section>;
    })}
    {!inventoryVariants.length && <div className={styles.emptyOptions}>Add and save variants before linking inventory items.</div>}
  </div>;
  const customFieldsContent = <div className={detail.stack}>
    <div className={detail.cardHeader}><h3 className={typography.sectionHeading}>Custom Fields</h3><div className={detail.cardHeaderActions}><Button variant="secondary" icon="add" onClick={() => change("customFields", [...product.customFields, { name: "", value: "" }])}>Add Field</Button>{saveButton("custom")}</div></div>
    <table className={detail.table}><thead><tr><th>Field</th><th>Value</th><th /></tr></thead><tbody>{product.customFields.map((field, index) => <tr key={index}><td><Input invalid={validation.hasError("custom-name-" + index)} aria-label="Field name" value={field.name} onChange={(event) => change("customFields", product.customFields.map((row, i) => i === index ? { ...row, name: event.target.value } : row))} /></td><td><Input invalid={validation.hasError("custom-value-" + index)} aria-label={"Value for " + field.name} value={field.value} onChange={(event) => change("customFields", product.customFields.map((row, i) => i === index ? { ...row, value: event.target.value } : row))} /></td><td><Button variant="plain" icon="delete" aria-label="Remove custom field" onClick={() => change("customFields", product.customFields.filter((_, i) => i !== index))} /></td></tr>)}
    {!product.customFields.length && <tr><td colSpan={3} className={detail.emptyCell}>No custom fields yet.</td></tr>}</tbody></table>
  </div>;
  return <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
    <header className={layout.detailHeader}>
      <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
      <div className={layout.slotTitle}><div className={detail.titleIcon}><span className={"material-symbols-outlined " + detail.titleIconSymbol}>inventory_2</span></div><div><h1 className={typography.pageTitle}>{saved.name}</h1></div></div>
      <div className={layout.slotActions}><div className={detail.headerActions}>
        <DetailBackButton fallbackHref="/commercial/products" /><div className={detail.headerActionSeparator} />
        <Button variant="secondary" icon="check_circle" disabled={pending || saved.status === "ACTIVE"} onClick={() => transition("activate")}>Activate</Button>
        <Button variant="secondary" icon="block" disabled={pending || saved.status === "INACTIVE"} onClick={() => transition("deactivate")}>Deactivate</Button>
        <div className={detail.headerActionSeparator} />
        <Button variant="danger" icon="delete" aria-label="Delete product" title="Delete product" disabled={pending} onClick={() => setConfirmDelete(true)} />
      </div></div>
    </header>
    <div className={layout.slotAlert}><ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} /></div>
    <Toast isVisible={!!message} message={message} onClose={() => setMessage("")} />
    <main className={layout.mainSection}><fieldset disabled={pending} className={detail.fieldset}><TabGroup activeKey={tab} onChange={(key) => { setTab(key); validation.reset(); setError(""); }} tabs={[
      { key: "details", label: "Details", content: <section className={detail.card}>{detailsContent}</section> }, { key: "pricing", label: "Pricing", content: <section className={detail.card}>{pricingContent}</section> }, 
      { key: "variants", label: "Variants", content: <section className={detail.card}>{variantsContent}</section> },
      ...(inventoryItems !== null ? [{ key: "inventory", label: "Inventory", content: <section className={detail.card}>{inventoryContent}</section> }] : []),
       { key: "images", label: "Images", content: <section className={detail.card}>{imagesContent}</section> }, { key: "custom", label: "Custom Fields", content: <section className={detail.card}>{customFieldsContent}</section> },
    ]} /></fieldset></main>
    <aside className={layout.statusSection}>
      <section className={detail.card}>
        <span className={typography.fieldLabel}>Status</span>
        <Badge variant="soft" size="x-large" color={product.status === "ACTIVE" ? "success" : "neutral"}>{product.status}</Badge>
      </section>
      <AuditPanel id={product.id} creationDate={new Date(product.createdAt).toISOString()} updatedDate={product.updatedAt ? new Date(product.updatedAt).toISOString() : ""} auditHref={`/settings/audit?entityType=product&entityId=${product.id}`} onNavigate={(href) => router.push(href)} />
    </aside>
    <ConfirmDialog isOpen={confirmDelete} title="Delete product" message={`Delete ${saved.name}?`} confirmLabel="Delete" onClose={() => setConfirmDelete(false)} onConfirm={() => { setConfirmDelete(false); transition("delete"); }} />
    {optionEditor && <Modal title="Add / Edit Option" close={() => setOptionEditor(null)}>
      <ValidationAlert errors={[...(optionValidation.showErrors ? optionValidation.errors : []), ...(optionError ? [optionError] : [])]} visible={optionValidation.showErrors || !!optionError} onDismiss={() => { optionValidation.dismiss(); setOptionError(""); }} />
      <Field label="Option Source"><SearchableSelect ariaLabel="Option Source" searchable={false} value={optionSource} options={[{ value: "shared", label: "Use a shared product option list" }, { value: "custom", label: "Create a product option list just for this product" }]} onChange={(value) => { setOptionSource(value); setOptionEditor({ ...optionEditor, sourceListCode: null, values: [] }); }} /></Field>
      {optionSource === "shared" ? <>
        <Field label="Product Option List"><SearchableSelect hasError={optionValidation.hasError("list")} ariaLabel="Product Option List" value={optionEditor.sourceListCode ?? ""} options={optionLists.filter((row) => row.status === "ACTIVE").map((row) => ({ value: row.code, label: row.name }))} onChange={(code) => { const list = optionLists.find((row) => row.code === code)!; setOptionEditor({ ...optionEditor, name: list.name, sourceListCode: code, values: [...list.values] }); }} /></Field>
        {!optionLists.length && <p>No shared option lists are available. Add sample data or create a product-specific option.</p>}
      </> : <>
        <Field label="Name"><Input invalid={optionValidation.hasError("name")} aria-label="Option name" value={optionEditor.name} onChange={(event) => setOptionEditor({ ...optionEditor, name: event.target.value })} /></Field>
        <Field label="Values (one per line)"><Textarea invalid={optionValidation.hasError("values")} aria-label="Option values" rows={5} value={optionEditor.values.join("\n")} onChange={(event) => setOptionEditor({ ...optionEditor, values: event.target.value.split("\n") })} /></Field>
      </>}
      <div className={detail.actions}><Button variant="cancel" onClick={() => setOptionEditor(null)}>Cancel</Button><Button variant="primary" onClick={saveOption}>Apply Option</Button></div>
    </Modal>}
    {imageEditor && <Modal title="Variant Image Override" close={() => setImageEditor(null)}>
      <ValidationAlert errors={imageValidation.errors} visible={imageValidation.showErrors} onDismiss={imageValidation.dismiss} />
      <p className={typography.bodyText}>Override the product image base path for this variant. Leave blank to use the product image.</p>
      <Field label="Image Override Path"><Input invalid={imageValidation.hasError("path")} aria-label="Image Override Path" value={imageEditor.path} onChange={(event) => setImageEditor({ ...imageEditor, path: event.target.value })} /></Field>
      <div className={detail.actions}><Button variant="cancel" onClick={() => setImageEditor(null)}>Cancel</Button><Button variant="primary" onClick={() => { if (!imageValidation.attempt()) return; updateVariant(imageEditor.id, { imagePath: imageEditor.path.trim() }); setImageEditor(null); }}>Apply</Button></div>
    </Modal>}
    {variantEditor && <Modal title="Add Individual Variant" close={() => setVariantEditor(null)}>
      <ValidationAlert errors={[...(variantValidation.showErrors ? variantValidation.errors : []), ...(variantError ? [variantError] : [])]} visible={variantValidation.showErrors || !!variantError} onDismiss={() => { variantValidation.dismiss(); setVariantError(""); }} />
      {product.options.map((option) => <Field key={option.id} label={option.name}><SearchableSelect hasError={variantValidation.hasError(option.id)} ariaLabel={option.name} value={variantEditor[option.id] ?? ""} options={selectOptions(option.values)} onChange={(value) => setVariantEditor({ ...variantEditor, [option.id]: value })} /></Field>)}
      <Field label="SKU"><Input invalid={variantValidation.hasError("sku")} aria-label="Variant SKU" value={variantSku} onChange={(event) => setVariantSku(event.target.value)} /></Field>
      <div className={detail.actions}><Button variant="cancel" onClick={() => setVariantEditor(null)}>Cancel</Button><Button variant="primary" onClick={addVariant}>Add Variant</Button></div>
    </Modal>}
  </div>;
}
