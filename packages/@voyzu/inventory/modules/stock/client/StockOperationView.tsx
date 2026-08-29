"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  EditableGrid,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  type EditableGridColumn,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { ConfigurationDetail } from "../../configuration/types/configuration.types";
import type { StockOption, StockPosition } from "../types/stock.types";
import styles from "./stock.module.css";
type Kind = "receive" | "issue" | "transfer" | "reserve" | "adjust";
type Line = {
  id: number;
  itemId: string;
  sku: string;
  itemName: string;
  onHand: number;
  reserved: number;
  available: number;
  quantity: number | "";
  quantityChange: number | "";
  warehouseId: string;
  warehouse: string;
};
const titles = {
  receive: ["Receive Stock", "Record stock received into a warehouse."],
  issue: [
    "Issue Stock",
    "Record stock issued from a warehouse. This logistical activity does not change the Company Financial Ledger.",
  ],
  transfer: ["Transfer Stock", "Move stock between warehouses."],
  reserve: ["Reserve Stock", "Reserve available stock for an item."],
  adjust: [
    "Adjust Quantity",
    "Adjust the recorded quantity of stock held in a warehouse.",
  ],
} as const;
export function StockOperationView({
  kind,
  positions,
  items,
  warehouses,
  customFields,
}: {
  kind: Kind;
  positions: StockPosition[];
  items: StockOption[];
  warehouses: StockOption[];
  customFields: ConfigurationDetail[];
}) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [warehouseId, setWarehouseId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");
  const [itemId, setItemId] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [customValues, setCustomValues] = useState<
    Record<number, string | string[] | boolean>
  >({});
  const movementColumns: EditableGridColumn<Line>[] = [
    {
      key: "itemId",
      label: "Item",
      type: "select",
      width: 260,
      options: items.map((i) => ({
        value: String(i.id),
        label: `${i.code} — ${i.name}`,
      })),
    },
    {
      key: "quantity",
      label: kind === "receive" ? "Quantity Received" : "Quantity Issued",
      type: "number",
      width: 160,
    },
  ];
  const positionRows = useMemo(
    () =>
      positions
        .filter((p) =>
          kind === "reserve"
            ? p.itemId === Number(itemId)
            : p.warehouseId === Number(warehouseId),
        )
        .map((p) => ({
          id: p.itemId * 100000 + p.warehouseId,
          itemId: String(p.itemId),
          sku: p.sku,
          itemName: p.itemName,
          onHand: p.onHand,
          reserved: p.reserved,
          available: p.available,
          quantity: "" as const,
          quantityChange: "" as const,
          warehouseId: String(p.warehouseId),
          warehouse: p.warehouseName,
        })),
    [positions, itemId, warehouseId, kind],
  );
  const reserveColumns: EditableGridColumn<Line>[] = [
    {
      key: "warehouse",
      label: "Warehouse",
      type: "text",
      readOnly: true,
      width: 220,
    },
    {
      key: "onHand",
      label: "On Hand",
      type: "number",
      readOnly: true,
      width: 100,
    },
    {
      key: "reserved",
      label: "Currently Reserved",
      type: "number",
      readOnly: true,
      width: 150,
    },
    {
      key: "available",
      label: "Available",
      type: "number",
      readOnly: true,
      width: 100,
    },
    { key: "quantity", label: "Reserve", type: "number", width: 110 },
  ];
  const adjustColumns: EditableGridColumn<Line>[] = [
    { key: "sku", label: "SKU", type: "text", readOnly: true, width: 150 },
    {
      key: "itemName",
      label: "Item Name",
      type: "text",
      readOnly: true,
      width: 240,
    },
    {
      key: "onHand",
      label: "On Hand",
      type: "number",
      readOnly: true,
      width: 100,
    },
    {
      key: "reserved",
      label: "Currently Reserved",
      type: "number",
      readOnly: true,
      width: 150,
    },
    {
      key: "quantityChange",
      label: "Adjust Quantity",
      type: "number",
      width: 140,
    },
  ];
  const validate = () => {
    if (
      (kind !== "reserve" && !warehouseId) ||
      !reference.trim() ||
      (kind === "transfer" && (!itemId || !toWarehouseId || !quantity)) ||
      (kind === "reserve" && !itemId)
    ) {
      setError("Complete all required fields");
      return false;
    }
    if (
      (kind === "receive" || kind === "issue") &&
      !lines.some((l) => l.itemId && Number(l.quantity) > 0)
    ) {
      setError("Add at least one item and quantity");
      return false;
    }
    return true;
  };
  const submit = async () => {
    if (!validate()) return;
    if (kind === "adjust" && step < 3) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    setError("");
    try {
      let path = kind;
      let body: unknown;
      const customFieldPayload = customFields
        .map((field) => {
          const raw = customValues[field.id];
          const value =
            field.dataType === "BOOLEAN"
              ? Boolean(raw)
              : field.dataType === "NUMBER"
                ? raw === undefined || raw === ""
                  ? null
                  : Number(raw)
                : field.dataType === "OPTION"
                  ? raw
                    ? Number(raw)
                    : null
                  : field.dataType === "MULTIPLE_OPTIONS"
                    ? Array.isArray(raw)
                      ? raw.map(Number)
                      : []
                    : raw === undefined
                      ? null
                      : String(raw);
          return { customFieldId: field.id, value };
        })
        .filter(({ value }) => value !== null && value !== "");
      if (kind === "receive" || kind === "issue")
        body = {
          date,
          warehouseId: Number(warehouseId),
          reference,
          notes,
          lines: lines
            .filter((l) => l.itemId && Number(l.quantity) > 0)
            .map((l) => ({
              itemId: Number(l.itemId),
              quantity: Number(l.quantity),
            })),
          customFields: customFieldPayload,
        };
      else if (kind === "transfer")
        body = {
          date,
          itemId: Number(itemId),
          fromWarehouseId: Number(warehouseId),
          toWarehouseId: Number(toWarehouseId),
          quantity: Number(quantity),
          reference,
          notes,
        };
      else if (kind === "reserve")
        body = {
          itemId: Number(itemId),
          reference,
          notes,
          lines: lines
            .filter((l) => Number(l.quantity) > 0)
            .map((l) => ({
              warehouseId: Number(l.warehouseId),
              quantity: Number(l.quantity),
            })),
        };
      else
        body = {
          date,
          warehouseId: Number(warehouseId),
          reference,
          notes,
          lines: lines
            .filter((l) => Number(l.quantityChange) !== 0)
            .map((l) => ({
              itemId: Number(l.itemId),
              quantityChange: Number(l.quantityChange),
            })),
        };
      const response = await fetch(`/api/inventory/stock/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const b = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setError(b?.message ?? "The stock operation could not be completed");
        return;
      }
      setToast(`${titles[kind][0]} completed`);
      window.setTimeout(() => {
        router.push("/inventory/stock");
        router.refresh();
      }, 600);
    } finally {
      setSaving(false);
    }
  };
  const title =
    step === 3 && kind === "adjust"
      ? "Review Quantity Adjustments"
      : titles[kind][0];
  const selectedItem = items.find((i) => i.id === Number(itemId));
  const review = lines.filter((l) => Number(l.quantityChange) !== 0);
  return (
    <div className={layout.detailView}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            {title}
          </h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>{titles[kind][1]}</p>
          </div>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={error ? [error] : []}
            visible={!!error}
            onDismiss={() => setError("")}
          />
        </div>
      </header>
      <main className={`${layout.mainSection} ${styles.stack}`}>
        {kind === "adjust" && step === 3 ? (
          <section className={detailStyles.card}>
            <p className={styles.reviewWarning}>
              Completing these adjustments updates stock quantities. Any future
              Finance integration can use the resulting adjustment transaction.
            </p>
            <div className={styles.summary}>
              <span>
                Warehouse:{" "}
                {warehouses.find((w) => w.id === Number(warehouseId))?.name}
              </span>
              <span>Reference: {reference}</span>
            </div>
            <EditableGrid
              columns={[
                ...adjustColumns.slice(0, 3),
                {
                  key: "quantityChange",
                  label: "Adjustment",
                  type: "number",
                  readOnly: true,
                  width: 120,
                },
              ]}
              initialRows={review}
              ariaLabel="Quantity adjustment review"
            />
          </section>
        ) : (
          <>
            <section className={detailStyles.card}>
              <h2 className={typography.sectionHeading}>
                {kind === "transfer"
                  ? "Transfer Details"
                  : kind === "reserve"
                    ? "Reservation Details"
                    : kind === "adjust"
                      ? "Adjustment Details"
                      : kind === "receive"
                        ? "Receipt Details"
                        : "Issue Details"}
              </h2>
              <div className={styles.fields}>
                {kind !== "reserve" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                ) : null}
                {kind === "reserve" || kind === "transfer" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Item</label>
                    <SearchableSelect
                      value={itemId}
                      onChange={setItemId}
                      options={items.map((i) => ({
                        value: String(i.id),
                        label: i.name,
                        code: i.code,
                      }))}
                    />
                  </div>
                ) : null}
                {kind !== "reserve" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>
                      {kind === "transfer" ? "From Warehouse" : "Warehouse"}
                    </label>
                    <SearchableSelect
                      value={warehouseId}
                      onChange={(value) => {
                        setWarehouseId(value);
                        if (kind === "adjust") setLines([]);
                      }}
                      options={warehouses.map((w) => ({
                        value: String(w.id),
                        label: w.name,
                        code: w.code,
                      }))}
                    />
                  </div>
                ) : null}
                {kind === "transfer" ? (
                  <>
                    <div className={styles.field}>
                      <label className={typography.fieldLabel}>
                        To Warehouse
                      </label>
                      <SearchableSelect
                        value={toWarehouseId}
                        onChange={setToWarehouseId}
                        options={warehouses
                          .filter((w) => String(w.id) !== warehouseId)
                          .map((w) => ({
                            value: String(w.id),
                            label: w.name,
                            code: w.code,
                          }))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={typography.fieldLabel}>Quantity</label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </>
                ) : null}
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Reference</label>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
                <div className={`${styles.field} ${styles.wide}`}>
                  <label className={typography.fieldLabel}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </section>
            {kind === "receive" || kind === "issue" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Items</h2>
                <EditableGrid
                  columns={movementColumns}
                  initialRows={lines}
                  allowAddRows
                  allowDeleteRows
                  createRow={() => ({
                    id: Date.now() + Math.random(),
                    itemId: "",
                    sku: "",
                    itemName: "",
                    onHand: 0,
                    reserved: 0,
                    available: 0,
                    quantity: "" as const,
                    quantityChange: "" as const,
                    warehouseId: "",
                    warehouse: "",
                  })}
                  onRowsChange={setLines}
                  addRowLabel="Add Item"
                  ariaLabel={`${kind} stock items`}
                />
              </section>
            ) : null}
            {kind === "reserve" && selectedItem ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>
                  Stock by Warehouse
                </h2>
                <EditableGrid
                  key={itemId}
                  columns={reserveColumns}
                  initialRows={positionRows}
                  onRowsChange={setLines}
                  ariaLabel="Reserve stock by warehouse"
                />
              </section>
            ) : null}
            {kind === "adjust" && warehouseId && step === 2 ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Set Quantities</h2>
                <EditableGrid
                  key={warehouseId}
                  columns={adjustColumns}
                  initialRows={positionRows}
                  onRowsChange={setLines}
                  ariaLabel="Adjust stock quantities"
                />
              </section>
            ) : null}
            {customFields.length ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Custom Fields</h2>
                <div className={styles.customFields}>
                  {customFields.map((field) => (
                    <div className={styles.field} key={field.id}>
                      <label className={typography.fieldLabel}>
                        {field.name}
                        {field.required ? " *" : ""}
                      </label>
                      {field.dataType === "BOOLEAN" ? (
                        <Checkbox
                          checked={Boolean(customValues[field.id])}
                          onChange={(value) =>
                            setCustomValues((c) => ({
                              ...c,
                              [field.id]: value,
                            }))
                          }
                        />
                      ) : field.dataType === "MULTIPLE_OPTIONS" ? (
                        <SearchableSelect
                          multiple
                          value={
                            Array.isArray(customValues[field.id])
                              ? (customValues[field.id] as string[])
                              : []
                          }
                          onChange={(value) =>
                            setCustomValues((c) => ({
                              ...c,
                              [field.id]: value,
                            }))
                          }
                          options={field.options.map((o) => ({
                            value: String(o.id),
                            label: o.value,
                          }))}
                        />
                      ) : field.dataType === "OPTION" ? (
                        <SearchableSelect
                          value={String(customValues[field.id] ?? "")}
                          onChange={(value) =>
                            setCustomValues((c) => ({
                              ...c,
                              [field.id]: value,
                            }))
                          }
                          options={field.options.map((o) => ({
                            value: String(o.id),
                            label: o.value,
                          }))}
                        />
                      ) : (
                        <Input
                          type={
                            field.dataType === "DATE"
                              ? "date"
                              : field.dataType === "NUMBER"
                                ? "number"
                                : "text"
                          }
                          value={String(customValues[field.id] ?? "")}
                          onChange={(e) =>
                            setCustomValues((c) => ({
                              ...c,
                              [field.id]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() =>
              step > 1 ? setStep(step - 1) : router.push("/inventory/stock")
            }
          >
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button
            variant="primary"
            disabled={saving}
            onClick={() => void submit()}
          >
            {kind === "adjust" && step === 1
              ? "Proceed to Adjust Quantity"
              : kind === "adjust" && step === 2
                ? "Review Quantity Adjustments"
                : saving
                  ? "Completing..."
                  : titles[kind][0]}
          </Button>
        </div>
      </main>
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
