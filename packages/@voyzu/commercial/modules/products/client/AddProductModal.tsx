"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, SearchableSelect, ValidationAlert, useFormValidation, required, maxLength, pattern } from "@voyzu/ui-components";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { ProductModal } from "./ProductModal";
import { createProductAction, productCreationInventoryItemsAction } from "../server/actions/product.actions";
export function AddProductModal({ onClose, fromInventory = false }: { onClose: () => void; fromInventory?: boolean }) {
 const router = useRouter(); const [code,setCode] = useState(""); const [name,setName] = useState(""); const [type,setType] = useState("Physical"); const [error,setError] = useState(""); const [pending,startTransition] = useTransition();
 const [items, setItems] = useState<{ id: number; sku: string; name: string }[]>([]);
 const [itemId, setItemId] = useState("");
 const [loading, setLoading] = useState(fromInventory);
 useEffect(() => {
   if (!fromInventory) return;
   let cancelled = false;
   productCreationInventoryItemsAction().then((result) => { if (cancelled) return; if (result.items) setItems(result.items); else setError(result.error ?? "Unable to load inventory items."); }).catch(() => { if (!cancelled) setError("Unable to load inventory items."); }).finally(() => { if (!cancelled) setLoading(false); });
   return () => { cancelled = true; };
 }, [fromInventory]);
 const validation = useFormValidation(() => ({ inventoryItem: { label: "inventory item", value: fromInventory ? itemId : "not-required", rules: [required()] }, code: { label: "product code", value: code, rules: [required(), maxLength(50), pattern(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "Use letters, numbers, hyphens or underscores for the code")] }, name: { label: "name", value: name, rules: [required(), maxLength(200)] } }));
 const save = () => { setError(""); if (!validation.attempt()) return; startTransition(async () => { try { const result = await createProductAction({ code: code.trim(), name: name.trim(), type }, fromInventory ? Number(itemId) : undefined); if (!result.product) { setError(result.error ?? "Unable to create product."); return; } router.push("/commercial/products/" + encodeURIComponent(result.product.code)); router.refresh(); onClose(); } catch { setError("Unable to create product. Please try again."); } }); };
 return <ProductModal title={fromInventory ? "Add from Inventory" : "Add Product"} submitLabel="Create Product" pending={pending || loading} onClose={onClose} onSubmit={save}>
 <ValidationAlert errors={[...(validation.showErrors ? validation.errors : []), ...(error ? [error] : [])]} visible={validation.showErrors || !!error} onDismiss={() => { validation.dismiss(); setError(""); }} />
 {fromInventory && <div className={detail.fieldGroup}><span className={typography.fieldLabel}>Inventory Item</span><SearchableSelect ariaLabel="Inventory item" disabled={pending || loading} hasError={validation.hasError("inventoryItem")} value={itemId} placeholder={loading ? "Loading inventory items..." : "Select an inventory item"} options={items.map((item) => ({ value: String(item.id), label: item.sku + " - " + item.name }))} onChange={(id) => { setItemId(id); const item = items.find((row) => String(row.id) === id); if (item) { setCode(item.sku.toUpperCase().replace(/[^A-Z0-9_-]/g, "-").replace(/^[^A-Z0-9]+/, "").slice(0, 50)); setName(item.name); } }} />{!loading && !items.length && <p className={typography.bodyText}>No active inventory items available.</p>}</div>}
 <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="new-product-code">Product Code</label><Input id="new-product-code" invalid={validation.hasError("code")} disabled={pending} value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} /></div>
 <div className={detail.fieldGroup}><label className={typography.fieldLabel} htmlFor="new-product-name">Name</label><Input id="new-product-name" invalid={validation.hasError("name")} disabled={pending} value={name} onChange={(event) => setName(event.target.value)} /></div>
 <div className={detail.fieldGroup}><span className={typography.fieldLabel}>Type</span><SearchableSelect ariaLabel="Type" searchable={false} disabled={pending} value={type} options={["Physical","Service","Other"].map((value) => ({ value, label: value }))} onChange={setType} /></div>
 </ProductModal>;
}
