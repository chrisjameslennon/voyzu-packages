"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  DatePicker,
  EditableGrid,
  SearchableSelect,
  Toast,
  ValidationAlert,
  type EditableGridColumn,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  StockCountDetail,
  StockOption,
  StockPosition,
} from "../types/stock.types";
import styles from "./stock.module.css";
type Row = {
  id: number;
  itemId: number | string;
  sku: string;
  itemName: string;
  expectedQuantity: number;
  countedQuantity: number | "";
  variance: number | string;
};
export function StockCountEditor({
  record: initial,
  positions,
  warehouses,
}: {
  record?: StockCountDetail;
  positions: StockPosition[];
  warehouses: StockOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [record, setRecord] = useState(initial);
  const [warehouseId, setWarehouseId] = useState(
    initial ? String(initial.warehouseId) : "",
  );
  const [countDate, setCountDate] = useState(
    initial?.countDate ?? new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [rows, setRows] = useState<Row[]>(
    initial?.lines.map((l) => ({
      ...l,
      countedQuantity: l.countedQuantity ?? "",
      variance: l.variance ?? "—",
    })) ?? [],
  );
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const calculated = rows.map((row) => {
    const expectedQuantity = record
      ? row.expectedQuantity
      : (positions.find(
          (position) =>
            position.warehouseId === Number(warehouseId) &&
            position.itemId === Number(row.itemId),
        )?.onHand ?? 0);
    return {
      ...row,
      expectedQuantity,
      variance:
        row.countedQuantity === ""
          ? "—"
          : Number(row.countedQuantity) - expectedQuantity,
    };
  });
  const changes = calculated.filter(
    (row) => row.countedQuantity !== "" && Number(row.variance) !== 0,
  );
  const columns: EditableGridColumn<Row>[] = [
    { key: "sku", label: "SKU", type: "text", readOnly: true, width: 160 },
    {
      key: "itemName",
      label: "Item Name",
      type: "text",
      readOnly: true,
      width: 260,
    },
    {
      key: "expectedQuantity",
      label: "On Hand",
      type: "number",
      readOnly: true,
      width: 110,
    },
    {
      key: "countedQuantity",
      label: "Actual Quantity",
      type: "number",
      readOnly: record?.status === "COMPLETED",
      width: 150,
    },
    {
      key: "variance",
      label: "Variance",
      type: "text",
      readOnly: true,
      width: 100,
      valueClassName: styles.varianceValue,
      calculate: (row) =>
        row.countedQuantity === ""
          ? "—"
          : Number(row.countedQuantity) - row.expectedQuantity,
    },
  ];
  const warehouseRows = (selectedWarehouseId: string): Row[] =>
    positions
      .filter(
        (position) =>
          position.warehouseId === Number(selectedWarehouseId),
      )
      .map((position) => ({
        id: position.id,
        itemId: position.itemId,
        sku: position.sku,
        itemName: position.itemName,
        expectedQuantity: position.onHand,
        countedQuantity: "",
        variance: "—",
      }));
  const payload = () => ({
    warehouseId: Number(warehouseId),
    countDate,
    notes,
    lines: calculated.filter((row) => row.itemId).map((row) => ({
      itemId: Number(row.itemId),
      countedQuantity:
        row.countedQuantity === "" ? null : Number(row.countedQuantity),
    })),
  });
  const request = async (path: string, init: RequestInit) => {
    setError("");
    const response = await fetch(path, init);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(
        body?.message ?? "The stocktake operation could not be completed",
      );
      return null;
    }
    return response;
  };
  const save = async (status: "DRAFT" | "IN_PROGRESS") => {
    if (!warehouseId) {
      setError("Warehouse is required");
      return;
    }
    if (!countDate) {
      setError("Count Date is required");
      return;
    }
    if (!rows.some((row) => row.itemId)) {
      setError("Add at least one item");
      return;
    }
    const selectedItemIds = rows
      .filter((row) => row.itemId)
      .map((row) => Number(row.itemId));
    if (new Set(selectedItemIds).size !== selectedItemIds.length) {
      setError("Each item can only be added once");
      return;
    }
    setSaving(true);
    const response = await request(
      record
        ? `/api/inventory/stock-counts/${record.id}`
        : "/api/inventory/stock-counts",
      {
        method: record ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record ? { ...payload(), status } : payload()),
      },
    );
    setSaving(false);
    if (!response) return;
    const changed = (await response.json()) as StockCountDetail;
    if (status === "DRAFT") {
      router.push(
        `/inventory/stock-counts?toast=${encodeURIComponent("Stocktake saved as draft")}`,
      );
      return changed;
    }
    setRecord(changed);
    setRows(
      changed.lines.map((l) => ({
        ...l,
        countedQuantity: l.countedQuantity ?? "",
        variance: l.variance ?? "—",
      })),
    );
    setToast("Stocktake saved");
    return changed;
  };
  const complete = async () => {
    if (
      !rows.some(
        (row) => row.itemId && row.countedQuantity !== "",
      )
    ) {
      setError("Enter an actual quantity for at least one item");
      return;
    }
    const current = await save("IN_PROGRESS");
    if (!current) return;
    const response = await request(
      `/api/inventory/stock-counts/${current.id}/complete`,
      { method: "POST" },
    );
    if (!response) return;
    setRecord((await response.json()) as StockCountDetail);
    setReview(false);
    setToast("Stocktake completed");
  };
  const reviewStocktake = () => {
    setError("");
    if (!warehouseId) {
      setError("Warehouse is required");
      return;
    }
    if (!countDate) {
      setError("Count Date is required");
      return;
    }
    if (!rows.length) {
      setError("The selected warehouse has no stocked items");
      return;
    }
    if (!rows.some((row) => row.countedQuantity !== "")) {
      setError("Enter an actual quantity for at least one item");
      return;
    }
    setReview(true);
  };
  const remove = async () => {
    if (!record) return;
    const response = await request(`/api/inventory/stock-counts/${record.id}`, {
      method: "DELETE",
    });
    if (!response) return;
    router.push("/inventory/stock-counts");
    router.refresh();
  };
  const readOnly = record?.status === "COMPLETED";
  const title = review
    ? "Review Stocktake"
    : (record?.countNo ?? "New Stocktake");
  if (!record || !readOnly)
    return (
      <div
        className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}
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
                {review
                  ? "Review Stocktake"
                  : (record?.countNo ?? "New Stocktake")}
              </h1>
              <p className={typography.headingByline}>
                {review
                  ? "Review the quantity adjustments before submitting the stocktake."
                  : "Record the actual stock quantities held in a warehouse."}
              </p>
            </div>
          </div>
          <div className={layout.slotActions}>
            <div className={detailStyles.headerActions}>
              <Button
                variant="cancel"
                onClick={() => router.push("/inventory/stock-counts")}
              >
                Cancel
              </Button>
              {review ? (
                <>
                  <Button
                    variant="cancel"
                    icon="arrow_back"
                    onClick={() => setReview(false)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    disabled={saving}
                    onClick={() => void complete()}
                  >
                    {saving ? "Submitting..." : "Submit Stocktake"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    icon="save"
                    disabled={saving}
                    onClick={() => void save("DRAFT")}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={saving}
                    onClick={reviewStocktake}
                  >
                    Review Stocktake
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Button>
                </>
              )}
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
        <aside className={layout.statusSection}>
          <div className={styles.documentPanel}>
            <div className={styles.documentPanelLabel}>
              Stocktake document
            </div>
            <div className={styles.documentPanelFields}>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Count Date</label>
                <fieldset
                  className={styles.datePickerFieldset}
                  disabled={review}
                >
                  <DatePicker
                    value={countDate}
                    onChange={setCountDate}
                    clearable={!review}
                    hasError={error === "Count Date is required"}
                  />
                </fieldset>
              </div>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Notes</label>
                <textarea
                  className={`${styles.textarea} ${styles.stocktakeNotes}`}
                  value={notes}
                  disabled={review}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>
        <main className={`${layout.mainSection} ${styles.stack}`}>
          <section className={detailStyles.card}>
            <h2 className={typography.sectionHeading}>Stocktake Details</h2>
            <div className={styles.issueWarehouseField}>
              <label className={typography.fieldLabel}>Warehouse</label>
              <SearchableSelect
                value={warehouseId}
                onChange={(value) => {
                  setWarehouseId(value);
                  setRows(value ? warehouseRows(value) : []);
                  if (value && error === "Warehouse is required") setError("");
                }}
                disabled={review || !!record}
                hasError={error === "Warehouse is required"}
                options={warehouses.map((warehouse) => ({
                  value: String(warehouse.id),
                  label: warehouse.name,
                  code: warehouse.code,
                }))}
                placeholder="Select a warehouse"
              />
            </div>
            <div className={styles.issueItemsSection}>
              <h2 className={typography.sectionHeading}>
                {review ? "Adjustments" : "Items"}
              </h2>
              {warehouseId ? (
                <EditableGrid
                  key={`stocktake-${warehouseId}-${review}`}
                  className={styles.stocktakeGrid}
                  columns={columns.map((column) =>
                    review ? { ...column, readOnly: true } : column,
                  )}
                  initialRows={review ? changes : calculated}
                  onRowsChange={review ? undefined : setRows}
                  emptyText={
                    review
                      ? "No quantity adjustments"
                      : "This warehouse has no stocked items"
                  }
                  ariaLabel="Stocktake quantities"
                />
              ) : (
                <p className={styles.issueItemsHint}>
                  Select a warehouse to load its stocked items.
                </p>
              )}
            </div>
          </section>
        </main>
        <Toast
          isVisible={!!toast}
          message={toast}
          onClose={() => setToast("")}
        />
      </div>
    );
  const body = (
    <main className={`${layout.mainSection} ${styles.stack}`}>
      <section className={detailStyles.card}>
        <h2 className={typography.sectionHeading}>Stocktake Details</h2>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Warehouse</label>
            <SearchableSelect
              value={warehouseId}
              onChange={(value) => {
                setWarehouseId(value);
                setRows([]);
              }}
              disabled={readOnly || !!record}
              options={warehouses.map((w) => ({
                value: String(w.id),
                label: w.name,
                code: w.code,
              }))}
            />
          </div>
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Count Date</label>
            <fieldset
              className={styles.datePickerFieldset}
              disabled={readOnly}
            >
              <DatePicker
                value={countDate}
                onChange={setCountDate}
                clearable={!readOnly}
                hasError={error === "Count Date is required"}
              />
            </fieldset>
          </div>
          <div className={`${styles.field} ${styles.wide}`}>
            <label className={typography.fieldLabel}>Notes</label>
            <textarea
              className={`${styles.textarea} ${styles.completedStocktakeNotes}`}
              rows={2}
              value={notes}
              disabled={readOnly}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className={detailStyles.card}>
        {review ? (
          <p className={styles.reviewWarning}>
            Completing this stocktake adjusts stock quantities for the variances
            shown below.
          </p>
        ) : null}
        <EditableGrid
          key={`${warehouseId}-${review}-${readOnly}`}
          className={styles.stocktakeGrid}
          columns={columns.map((column) =>
            review ? { ...column, readOnly: true } : column,
          )}
          initialRows={review ? changes : calculated}
          onRowsChange={setRows}
          ariaLabel="Stocktake quantities"
        />
      </section>
      {!readOnly ? (
        <div className={styles.actions}>
          <Button
            variant="cancel"
            onClick={() => router.push("/inventory/stock-counts")}
          >
            Cancel
          </Button>
          {review ? (
            <Button
              variant="cancel"
              icon="arrow_back"
              onClick={() => setReview(false)}
            >
              Back
            </Button>
          ) : null}
          {!review ? (
            <Button
              variant="secondary"
              icon="save"
              onClick={() => void save("DRAFT")}
            >
              Save as Draft
            </Button>
          ) : null}
          <Button
            variant={review ? "primary" : "secondary"}
            onClick={() => (review ? void complete() : reviewStocktake())}
          >
            {review ? (
              "Submit Stocktake"
            ) : (
              <>
                Review Stocktake
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </>
            )}
          </Button>
        </div>
      ) : null}
    </main>
  );
  const header = (
    <header className={layout.detailHeader}>
      <div className={layout.slotBreadcrumb}>
        <Breadcrumbs />
      </div>
      <div className={layout.slotTitle}>
        <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>
          {title}
        </h1>
      </div>
      {record ? (
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref="/inventory/stock-counts" />
            {!readOnly ? (
              <Button
                variant="danger"
                icon="delete"
                onClick={() => setConfirm(true)}
              />
            ) : null}
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
  );
  const filter = record.audit.updated.mutationId
    ? `mutationId=${encodeURIComponent(record.audit.updated.mutationId)}`
    : `entityType=stock_count&entityId=${record.id}`;
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      {header}
      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Status</label>
          <Badge
            variant="soft"
            size="x-large"
            color={
              record.status === "COMPLETED"
                ? "success"
                : record.status === "IN_PROGRESS"
                  ? "info"
                  : "neutral"
            }
          >
            {record.status.replace("_", " ")}
          </Badge>
        </div>
        <AuditPanel
          id={record.id}
          creationDate={record.audit.created.date}
          updatedDate={record.audit.updated.date}
          creationActorType={record.audit.created.actorType}
          creationUser={record.audit.created.user}
          updatedActorType={record.audit.updated.actorType}
          updatedUser={record.audit.updated.user}
          auditHref={detailLinkWithBackContext(
            `/settings/audit?${filter}`,
            "audit",
            pathname,
          )}
          onNavigate={(href) => router.push(href)}
        />
      </aside>
      {body}
      <ConfirmDialog
        isOpen={confirm}
        title="Delete Stocktake"
        message={`Delete ${record.countNo}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setConfirm(false)}
        onConfirm={() => void remove()}
      />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
