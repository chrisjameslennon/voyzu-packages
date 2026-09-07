"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Radio, SearchableSelect } from "@voyzu/ui-components";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import styles from "./add-sales-item-modal.module.css";

type Source = "finance" | "commercial" | "inventory";
const inventoryItems = [
  { value: "COFFEE", code: "COFFEE", label: "Premium Coffee Beans" },
  { value: "BOX", code: "BOX", label: "Gift Shipping Box" },
  { value: "GIFT", code: "GIFT", label: "Coffee Gift Set" },
  { value: "MUG", code: "MUG", label: "Ceramic Coffee Mug" },
];
const commercialProducts = [
  ...inventoryItems,
  { value: "FILTER", code: "FILTER", label: "Reusable Coffee Filter" },
  { value: "TEA", code: "TEA", label: "Earl Grey Tea" },
  { value: "BOTTLE", code: "BOTTLE", label: "Insulated Water Bottle" },
  { value: "DELIVERY", code: "DELIVERY", label: "Local Delivery" },
  { value: "TRAINING", code: "TRAINING", label: "Barista Training Session" },
  { value: "APRON", code: "APRON", label: "Canvas Apron" },
];

export function AddSalesItemModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [product, setProduct] = useState("");
  const [inventoryItem, setInventoryItem] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog ref={dialogRef} className={`${modalStyles.modal} ${styles.dialog}`} aria-labelledby="add-sales-item-title" onCancel={onClose}>
      <div className={modalStyles.header}>
        <h2 id="add-sales-item-title" className={typography.contentTitle}>Add Sales Item</h2>
        <Button variant="plain" icon="close" title="Close" onClick={onClose} />
      </div>
      <div className={modalStyles.body}>
        <section className={styles.option}>
          <label className={styles.optionLabel}><Radio name="sales-item-source" checked={source === "finance"} onChange={() => setSource("finance")} />Finance only item</label>
          <div className={modalStyles.fieldRow}>
            <div className={modalStyles.fieldGroup}>
              <label htmlFor="sales-item-name" className={typography.fieldLabel}>Name</label>
              <Input id="sales-item-name" value={name} onChange={(event) => setName(event.target.value)} disabled={source !== "finance"} />
            </div>
            <div className={modalStyles.fieldGroup}>
              <label htmlFor="sales-item-price" className={typography.fieldLabel}>Price</label>
              <Input id="sales-item-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} disabled={source !== "finance"} />
            </div>
          </div>
        </section>
        <section className={styles.option}>
          <label className={styles.optionLabel}><Radio name="sales-item-source" checked={source === "commercial"} onChange={() => setSource("commercial")} />From Commercial Product</label>
          <SearchableSelect value={product} onChange={setProduct} options={commercialProducts} searchable placeholder="Search commercial products..." searchPlaceholder="Search by code or name..." ariaLabel="Commercial product" disabled={source !== "commercial"} />
        </section>
        <section className={styles.option}>
          <label className={styles.optionLabel}><Radio name="sales-item-source" checked={source === "inventory"} onChange={() => setSource("inventory")} />From Inventory Item</label>
          <SearchableSelect value={inventoryItem} onChange={setInventoryItem} options={inventoryItems} searchable placeholder="Search inventory items..." searchPlaceholder="Search by code or name..." ariaLabel="Inventory item" disabled={source !== "inventory"} />
        </section>
      </div>
      <div className={modalStyles.footer}>
        <Button variant="cancel" onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={source === null}>Add Sales Item</Button>
      </div>
    </dialog>
  );
}
