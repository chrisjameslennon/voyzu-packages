"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmDialog,
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
import { Transfer } from "../domain/operation-policy";
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
    "Manually adjust the recorded quantity of a stocked item held in a warehouse.",
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
  const [quantity, setQuantity] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmMovement, setConfirmMovement] = useState(false);
  const [customValues, setCustomValues] = useState<
    Record<number, string | string[] | boolean>
  >({});
  useEffect(() => {
    if (kind !== "issue") return;
    const params = new URLSearchParams(window.location.search);
    const requestedWarehouseId = Number(params.get("warehouseId"));
    const requestedItemIds = new Set(
      (params.get("itemIds") ?? "")
        .split(",")
        .map(Number)
        .filter(Number.isFinite),
    );
    if (!requestedWarehouseId || !requestedItemIds.size) return;
    const requestedPositions = positions.filter(
      (position) =>
        position.warehouseId === requestedWarehouseId &&
        requestedItemIds.has(position.itemId),
    );
    if (!requestedPositions.length) return;
    setWarehouseId(String(requestedWarehouseId));
    setLines(
      requestedPositions.map((position) => ({
        id: position.id,
        itemId: String(position.itemId),
        sku: position.sku,
        itemName: position.itemName,
        onHand: position.onHand,
        reserved: position.reserved,
        available: position.available,
        quantity: 1,
        quantityChange: "",
        warehouseId: String(position.warehouseId),
        warehouse: position.warehouseName,
      })),
    );
  }, [kind, positions]);
  useEffect(() => {
    if (kind !== "adjust") return;
    const params = new URLSearchParams(window.location.search);
    const requestedWarehouseId = Number(params.get("warehouseId"));
    const requestedItemId = Number(params.get("itemId"));
    if (!requestedWarehouseId || !requestedItemId) return;
    const requestedPosition = positions.find(
      (position) =>
        position.warehouseId === requestedWarehouseId &&
        position.itemId === requestedItemId,
    );
    if (!requestedPosition) return;
    setItemId(String(requestedItemId));
    setWarehouseId(String(requestedWarehouseId));
  }, [kind, positions]);
  useEffect(() => {
    if (kind !== "reserve") return;
    const requestedItemId = Number(
      new URLSearchParams(window.location.search).get("itemId"),
    );
    if (!requestedItemId || !items.some((item) => item.id === requestedItemId))
      return;
    setItemId(String(requestedItemId));
  }, [items, kind]);
  useEffect(() => {
    if (kind !== "transfer") return;
    const params = new URLSearchParams(window.location.search);
    const requestedItemId = Number(params.get("itemId"));
    const requestedWarehouseId = Number(params.get("warehouseId"));
    if (!requestedItemId || !requestedWarehouseId) return;
    if (
      !positions.some(
        (position) =>
          position.itemId === requestedItemId &&
          position.warehouseId === requestedWarehouseId,
      )
    )
      return;
    setItemId(String(requestedItemId));
    setWarehouseId(String(requestedWarehouseId));
    setToWarehouseId(String(requestedWarehouseId));
  }, [kind, positions]);
  const receiveMovementColumns: EditableGridColumn<Line>[] = [
    {
      key: "itemId",
      label: "Item",
      type: "select",
      width: 260,
      options: items.map((i) => ({
        value: String(i.id),
        label: i.name,
        code: i.code,
      })),
    },
    {
      key: "quantity",
      label: "Quantity",
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
  const issueWarehouses = useMemo(
    () =>
      warehouses.filter((warehouse) =>
        positions.some(
          (position) =>
            position.warehouseId === warehouse.id && position.available > 0,
        ),
      ),
    [positions, warehouses],
  );
  const issueMovementColumns: EditableGridColumn<Line>[] = [
    {
      key: "itemId",
      label: "Item",
      type: "select",
      width: 320,
      options: positions
        .filter(
          (position) =>
            position.warehouseId === Number(warehouseId) &&
            position.available > 0,
        )
        .map((position) => ({
          value: String(position.itemId),
          label: position.itemName,
          code: position.sku,
        })),
    },
    {
      key: "available",
      label: "Available",
      type: "number",
      readOnly: true,
      width: 120,
      calculate: (line) =>
        positions.find(
          (position) =>
            position.warehouseId === Number(warehouseId) &&
            position.itemId === Number(line.itemId),
        )?.available ?? 0,
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "number",
      width: 140,
    },
  ];
  const createMovementLine = (selectedWarehouseId: string): Line => ({
    id: Date.now() + Math.random(),
    itemId: "",
    sku: "",
    itemName: "",
    onHand: 0,
    reserved: 0,
    available: 0,
    quantity: "",
    quantityChange: "",
    warehouseId: selectedWarehouseId,
    warehouse:
      warehouses.find(
        (warehouse) => warehouse.id === Number(selectedWarehouseId),
      )?.name ?? "",
  });
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
  const adjustmentWarehouses = warehouses.filter((warehouse) =>
    positions.some(
      (position) =>
        position.itemId === Number(itemId) &&
        position.warehouseId === warehouse.id,
    ),
  );
  const adjustmentPosition = positions.find(
    (position) =>
      position.itemId === Number(itemId) &&
      position.warehouseId === Number(warehouseId),
  );
  const validate = () => {
    if (
      (kind !== "reserve" && !warehouseId) ||
      (kind === "transfer" && (!itemId || !toWarehouseId || !quantity)) ||
      (kind === "reserve" && !itemId) ||
      (kind === "adjust" && (!itemId || quantity === ""))
    ) {
      setError("Complete all required fields");
      return false;
    }
    if (kind === "transfer") {
      const blockers = Transfer(Number(warehouseId), Number(toWarehouseId));
      if (blockers.length) {
        setError(blockers[0]!.message);
        return false;
      }
    }
    if (
      (kind === "receive" || kind === "issue") &&
      !lines.some((l) => l.itemId && Number(l.quantity) > 0)
    ) {
      setError("Add at least one item and quantity");
      return false;
    }
    if (
      kind === "reserve" &&
      !lines.some((line) => Number(line.quantity) > 0)
    ) {
      setError("Enter a quantity for at least one warehouse");
      return false;
    }
    if (kind === "adjust") {
      if (!adjustmentPosition) {
        setError("Select an item and warehouse with recorded stock");
        return false;
      }
      const revisedQuantity = Number(quantity);
      if (!Number.isFinite(revisedQuantity) || revisedQuantity < 0) {
        setError("Revised quantity must be zero or greater");
        return false;
      }
      if (revisedQuantity === adjustmentPosition.onHand) {
        setError("Revised quantity must be different from the recorded quantity");
        return false;
      }
    }
    return true;
  };
  const submit = async () => {
    if (!validate()) return;
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
      const optionalReference = reference.trim() || undefined;
      if (kind === "receive" || kind === "issue")
        body = {
          date,
          warehouseId: Number(warehouseId),
          reference: optionalReference,
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
          reference: optionalReference,
        };
      else if (kind === "reserve")
        body = {
          itemId: Number(itemId),
          reference: optionalReference,
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
          reference: optionalReference,
          lines: [
            {
              itemId: Number(itemId),
              quantityChange:
                Number(quantity) - (adjustmentPosition?.onHand ?? 0),
            },
          ],
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
  const requestSubmit = () => {
    if (!validate()) return;
    setError("");
    setConfirmMovement(true);
  };
  const title = titles[kind][0];
  const selectedItem = items.find((i) => i.id === Number(itemId));
  const confirmLines = lines.filter(
    (line) => line.itemId && Number(line.quantity) > 0,
  );
  const confirmUnitCount = confirmLines.reduce(
    (total, line) => total + Number(line.quantity),
    0,
  );
  const confirmWarehouse = warehouses.find(
    (warehouse) => warehouse.id === Number(warehouseId),
  );
  const confirmToWarehouse = warehouses.find(
    (warehouse) => warehouse.id === Number(toWarehouseId),
  );
  const confirmReserveLines = lines.filter(
    (line) => Number(line.quantity) > 0,
  );
  const confirmReserveUnitCount = confirmReserveLines.reduce(
    (total, line) => total + Number(line.quantity),
    0,
  );
  const confirmDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  const confirmReference = reference.trim();
  const confirmReferenceDisplay =
    confirmReference.length > 40
      ? `${confirmReference.slice(0, 39)}…`
      : (confirmReference || "—");
  const customFieldControls = customFields.map((field) => (
    <div className={styles.field} key={field.id}>
      <label className={typography.fieldLabel}>
        {field.name}
        {field.required ? " *" : ""}
      </label>
      {field.dataType === "BOOLEAN" ? (
        <Checkbox
          checked={Boolean(customValues[field.id])}
          onChange={(value) =>
            setCustomValues((current) => ({
              ...current,
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
            setCustomValues((current) => ({
              ...current,
              [field.id]: value,
            }))
          }
          options={field.options.map((option) => ({
            value: String(option.id),
            label: option.value,
          }))}
        />
      ) : field.dataType === "OPTION" ? (
        <SearchableSelect
          value={String(customValues[field.id] ?? "")}
          onChange={(value) =>
            setCustomValues((current) => ({
              ...current,
              [field.id]: value,
            }))
          }
          options={field.options.map((option) => ({
            value: String(option.id),
            label: option.value,
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
          onChange={(event) =>
            setCustomValues((current) => ({
              ...current,
              [field.id]: event.target.value,
            }))
          }
        />
      )}
    </div>
  ));
  return (
    <div
      className={`${layout.detailView} ${
        kind === "receive" ||
        kind === "issue" ||
        kind === "transfer" ||
        kind === "reserve" ||
        kind === "adjust"
          ? layout.detailViewWithStatusRail
          : ""
      }`}
    >
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={styles.titleTextBlock}>
            <h1
              className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
            >
              {title}
            </h1>
            <p className={typography.headingByline}>
              {titles[kind][1]}
              {kind === "adjust" ? (
                <>
                  {" "}Generally quantity adjustment should be done as part of
                  a{" "}
                  <a
                    className={styles.stockCountLink}
                    href="/inventory/stock-counts"
                  >
                    Stock Count
                  </a>
                  .
                </>
              ) : null}
            </p>
          </div>
        </div>
        {kind === "receive" ||
        kind === "issue" ||
        kind === "transfer" ||
        kind === "reserve" ||
        kind === "adjust" ? (
          <div className={layout.slotActions}>
            <div className={detailStyles.headerActions}>
              <Button
                variant="cancel"
                onClick={() => router.push("/inventory/stock")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={saving}
                onClick={requestSubmit}
              >
                {saving
                  ? kind === "receive"
                    ? "Receiving..."
                    : kind === "transfer"
                      ? "Transferring..."
                      : kind === "reserve"
                        ? "Reserving..."
                        : kind === "adjust"
                          ? "Adjusting..."
                          : "Issuing..."
                  : titles[kind][0]}
              </Button>
            </div>
          </div>
        ) : null}
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={error ? [error] : []}
            visible={!!error}
            onDismiss={() => setError("")}
          />
        </div>
      </header>
      {kind === "receive" ||
      kind === "issue" ||
      kind === "transfer" ||
      kind === "reserve" ||
      kind === "adjust" ? (
        <aside className={layout.statusSection}>
          <div className={styles.documentPanel}>
            <div className={styles.documentPanelLabel}>
              {kind === "transfer"
                ? "Transfer document"
                : kind === "receive"
                  ? "Receipt document"
                  : kind === "reserve"
                    ? "Reservation document"
                    : kind === "adjust"
                      ? "Adjustment document"
                      : "Issue document"}
            </div>
            <div className={styles.documentPanelFields}>
              {kind !== "reserve" ? (
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>
              ) : null}
              <div className={styles.field}>
                <label className={typography.fieldLabel}>
                  Reference (optional)
                </label>
                <Input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
            </div>
          </div>
          {(kind === "receive" || kind === "issue" || kind === "adjust") &&
          customFields.length ? (
            <div className={detailStyles.card}>
              <h2 className={typography.sectionHeading}>Custom Fields</h2>
              <div className={styles.railCustomFields}>
                {customFieldControls}
              </div>
            </div>
          ) : null}
        </aside>
      ) : null}
      <main className={`${layout.mainSection} ${styles.stack}`}>
          <>
            {kind === "issue" || kind === "receive" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>
                  {kind === "issue" ? "Issue Details" : "Receipt Details"}
                </h2>
                <div className={styles.issueWarehouseField}>
                  <label className={typography.fieldLabel}>Warehouse</label>
                  <SearchableSelect
                    value={warehouseId}
                    hasError={
                      error === "Complete all required fields" && !warehouseId
                    }
                    onChange={(value) => {
                      setWarehouseId(value);
                      setItemId("");
                      setQuantity("");
                      setLines(value ? [createMovementLine(value)] : []);
                    }}
                    options={(
                      kind === "issue" ? issueWarehouses : warehouses
                    ).map((warehouse) => ({
                      value: String(warehouse.id),
                      label: warehouse.name,
                      code: warehouse.code,
                    }))}
                    placeholder={
                      kind === "issue"
                        ? "Select a warehouse with available stock"
                        : "Select a warehouse"
                    }
                  />
                </div>
                <div className={styles.issueItemsSection}>
                  <h2 className={typography.sectionHeading}>Items</h2>
                  {warehouseId ? (
                    <EditableGrid
                      key={`${kind}-${warehouseId}`}
                      columns={
                        kind === "issue"
                          ? issueMovementColumns
                          : receiveMovementColumns
                      }
                      initialRows={lines}
                      allowAddRows
                      allowDeleteRows
                      createRow={() => createMovementLine(warehouseId)}
                      onRowsChange={setLines}
                      addRowLabel="Add Item"
                      emptyText="No items have been added"
                      ariaLabel={`${kind} stock items`}
                    />
                  ) : (
                    <p className={styles.issueItemsHint}>
                      Select a warehouse to add items.
                    </p>
                  )}
                </div>
              </section>
            ) : kind === "transfer" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Transfer Details</h2>
                <div className={styles.transferStory}>
                  <div className={styles.transferSentence}>
                    <span>Transfer</span>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                    />
                    <span>units of</span>
                    <SearchableSelect
                      value={itemId}
                      onChange={setItemId}
                      options={items.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                        code: item.code,
                      }))}
                      ariaLabel="Item to transfer"
                      placeholder="Select an item"
                    />
                  </div>
                  <div className={styles.transferWarehouses}>
                    <span>from</span>
                    <SearchableSelect
                      value={warehouseId}
                      onChange={setWarehouseId}
                      options={warehouses.map((warehouse) => ({
                        value: String(warehouse.id),
                        label: warehouse.name,
                        code: warehouse.code,
                      }))}
                      ariaLabel="From warehouse"
                      placeholder="Select source warehouse"
                    />
                    <span
                      className={`material-symbols-outlined ${styles.transferArrow}`}
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                    <span>to</span>
                    <SearchableSelect
                      value={toWarehouseId}
                      onChange={setToWarehouseId}
                      options={warehouses.map((warehouse) => ({
                        value: String(warehouse.id),
                        label: warehouse.name,
                        code: warehouse.code,
                      }))}
                      ariaLabel="To warehouse"
                      placeholder="Select destination warehouse"
                    />
                  </div>
                </div>
              </section>
            ) : kind === "reserve" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Reserve Item</h2>
                <div className={styles.reserveItemForm}>
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Item</label>
                    <SearchableSelect
                      value={itemId}
                      onChange={setItemId}
                      options={items.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                        code: item.code,
                      }))}
                      placeholder="Select an item"
                    />
                  </div>
                  {selectedItem ? (
                    <EditableGrid
                      key={itemId}
                      className={styles.gridWithoutHeaderIcons}
                      columns={reserveColumns}
                      initialRows={positionRows}
                      onRowsChange={setLines}
                      ariaLabel="Reserve item by warehouse"
                    />
                  ) : (
                    <p className={styles.issueItemsHint}>
                      Select an item to view available stock by warehouse.
                    </p>
                  )}
                </div>
              </section>
            ) : kind === "adjust" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>
                  Adjustment Details
                </h2>
                <div className={styles.adjustmentFields}>
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Item</label>
                    <SearchableSelect
                      value={itemId}
                      onChange={(value) => {
                        setItemId(value);
                        setWarehouseId("");
                        setQuantity("");
                      }}
                      options={items
                        .filter((item) =>
                          positions.some(
                            (position) => position.itemId === item.id,
                          ),
                        )
                        .map((item) => ({
                          value: String(item.id),
                          label: item.name,
                          code: item.code,
                        }))}
                      placeholder="Select an item"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Warehouse</label>
                    <SearchableSelect
                      value={warehouseId}
                      onChange={(value) => {
                        setWarehouseId(value);
                        setQuantity("");
                      }}
                      disabled={!itemId}
                      options={adjustmentWarehouses.map((warehouse) => ({
                        value: String(warehouse.id),
                        label: warehouse.name,
                        code: warehouse.code,
                      }))}
                      placeholder={
                        itemId
                          ? "Select a warehouse"
                          : "Select an item first"
                      }
                    />
                  </div>
                </div>
                {adjustmentPosition ? (
                  <div className={styles.adjustmentQuantities}>
                    <h2 className={typography.sectionHeading}>
                      Recorded Quantities
                    </h2>
                    <dl className={styles.quantityFacts}>
                      <div>
                        <dt>On Hand</dt>
                        <dd>{adjustmentPosition.onHand}</dd>
                      </div>
                      <div>
                        <dt>Reserved</dt>
                        <dd>{adjustmentPosition.reserved}</dd>
                      </div>
                      <div>
                        <dt>Available</dt>
                        <dd>{adjustmentPosition.available}</dd>
                      </div>
                    </dl>
                    <div className={styles.revisedQuantityField}>
                      <label className={typography.fieldLabel}>
                        Revised Quantity
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}
            {customFields.length &&
            kind !== "receive" &&
            kind !== "issue" &&
            kind !== "adjust" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Custom Fields</h2>
                <div className={styles.customFields}>
                  {customFieldControls}
                </div>
              </section>
            ) : null}
          </>
      </main>
      <ConfirmDialog
        isOpen={confirmMovement}
        title={`Confirm ${titles[kind][0]}`}
        confirmLabel={titles[kind][0]}
        confirmVariant="primary"
        onClose={() => setConfirmMovement(false)}
        onConfirm={() => {
          setConfirmMovement(false);
          void submit();
        }}
        message={
          <div className={styles.issueConfirmDocument}>
            <div className={styles.issueConfirmBox}>
              <p className={styles.issueConfirmSummary}>
                {kind === "transfer" ? (
                  <>
                    Transfer <strong>{quantity}</strong> units of{" "}
                    <strong>{selectedItem?.name ?? "the selected item"}</strong>{" "}
                    from <strong>{confirmWarehouse?.name}</strong> to{" "}
                    <strong>{confirmToWarehouse?.name}</strong>.
                  </>
                ) : kind === "reserve" ? (
                  <>
                    Reserve <strong>{confirmReserveUnitCount}</strong> units of{" "}
                    <strong>{selectedItem?.name ?? "the selected item"}</strong>
                    {confirmReserveLines.length > 1
                      ? ` across ${confirmReserveLines.length} warehouses`
                      : ""}
                    .
                  </>
                ) : kind === "adjust" ? (
                  <>
                    Adjust{" "}
                    <strong>{selectedItem?.name ?? "the selected item"}</strong>{" "}
                    in <strong>{confirmWarehouse?.name}</strong> from{" "}
                    <strong>{adjustmentPosition?.onHand}</strong> to{" "}
                    <strong>{quantity}</strong> units.
                  </>
                ) : (
                  <>
                    {kind === "receive" ? "Receive" : "Issue"}{" "}
                    <strong>{confirmUnitCount}</strong> units{" "}
                    {kind === "receive" ? "into" : "from"}{" "}
                    <strong>
                      {confirmWarehouse?.name ?? "the selected warehouse"}
                    </strong>
                    .
                  </>
                )}
              </p>
              <dl className={styles.issueConfirmMetadata}>
                {kind !== "reserve" ? (
                  <div>
                    <dt>Date</dt>
                    <dd>{confirmDate}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Reference</dt>
                  <dd title={confirmReference || undefined}>
                    {confirmReferenceDisplay}
                  </dd>
                </div>
              </dl>
            </div>
            <div className={`${styles.issueConfirmBox} ${styles.issueConfirmItems}`}>
              <div className={styles.issueConfirmItemsScroll}>
                <table className={styles.issueConfirmItemsTable}>
                  <thead>
                    {kind === "reserve" ? (
                      <tr>
                        <th>Warehouse</th>
                        <th>Quantity</th>
                      </tr>
                    ) : kind === "adjust" ? (
                      <tr>
                        <th>Item</th>
                        <th>Recorded</th>
                        <th>Revised</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {kind === "reserve" ? (
                      confirmReserveLines.map((line) => (
                        <tr key={line.id}>
                          <td>{line.warehouse}</td>
                          <td>{line.quantity}</td>
                        </tr>
                      ))
                    ) : kind === "transfer" ? (
                      <tr>
                        <td>{selectedItem?.name}</td>
                        <td>{quantity}</td>
                      </tr>
                    ) : kind === "adjust" ? (
                      <tr>
                        <td>{selectedItem?.name}</td>
                        <td>{adjustmentPosition?.onHand}</td>
                        <td>{quantity}</td>
                      </tr>
                    ) : (
                      confirmLines.map((line) => {
                        const item = items.find(
                          (candidate) => candidate.id === Number(line.itemId),
                        );
                        return (
                          <tr key={line.id}>
                            <td>{item?.name ?? line.itemName}</td>
                            <td>{line.quantity}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
