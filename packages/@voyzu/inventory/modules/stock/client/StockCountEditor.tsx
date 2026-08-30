"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  EditableGrid,
  Input,
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
    },
  ];
  const newColumns: EditableGridColumn<Row>[] = [
    {
      key: "itemId",
      label: "Item",
      type: "select",
      width: 320,
      options: positions
        .filter(
          (position) => position.warehouseId === Number(warehouseId),
        )
        .map((position) => ({
          value: String(position.itemId),
          label: position.itemName,
          code: position.sku,
        })),
    },
    {
      key: "expectedQuantity",
      label: "On Hand",
      type: "number",
      readOnly: true,
      width: 120,
      calculate: (row) =>
        positions.find(
          (position) =>
            position.warehouseId === Number(warehouseId) &&
            position.itemId === Number(row.itemId),
        )?.onHand ?? 0,
    },
    {
      key: "countedQuantity",
      label: "Actual Quantity",
      type: "number",
      width: 150,
    },
    {
      key: "variance",
      label: "Variance",
      type: "text",
      readOnly: true,
      width: 110,
      calculate: (row) => {
        if (row.countedQuantity === "") return "—";
        const expected =
          positions.find(
            (position) =>
              position.warehouseId === Number(warehouseId) &&
              position.itemId === Number(row.itemId),
          )?.onHand ?? 0;
        return Number(row.countedQuantity) - expected;
      },
    },
  ];
  const createRow = (): Row => ({
    id: Date.now() + Math.random(),
    itemId: "",
    sku: "",
    itemName: "",
    expectedQuantity: 0,
    countedQuantity: "",
    variance: "—",
  });
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
    setRecord(changed);
    setRows(
      changed.lines.map((l) => ({
        ...l,
        countedQuantity: l.countedQuantity ?? "",
        variance: l.variance ?? "—",
      })),
    );
    setToast(
      status === "DRAFT" ? "Stocktake saved as draft" : "Stocktake saved",
    );
    if (!initial)
      window.history.replaceState(
        null,
        "",
        `/inventory/stock-counts/${changed.id}`,
      );
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
    ? "Confirm Stocktake"
    : (record?.countNo ?? "New Stocktake");
  if (!record)
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
                New Stocktake
              </h1>
              <p className={typography.headingByline}>
                Record the actual stock quantities held in a warehouse.
              </p>
            </div>
          </div>
          <div className={layout.slotActions}>
            <div className={detailStyles.headerActions}>
              <Button
                variant="secondary"
                onClick={() => router.push("/inventory/stock-counts")}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                icon="save"
                disabled={saving}
                onClick={() => void save("DRAFT")}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                disabled={saving}
                onClick={() => void complete()}
              >
                {saving ? "Completing..." : "Complete Stocktake"}
              </Button>
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
                <Input
                  type="date"
                  value={countDate}
                  onChange={(event) => setCountDate(event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Notes</label>
                <textarea
                  className={styles.textarea}
                  value={notes}
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
                  setRows(value ? [createRow()] : []);
                }}
                options={warehouses.map((warehouse) => ({
                  value: String(warehouse.id),
                  label: warehouse.name,
                  code: warehouse.code,
                }))}
                placeholder="Select a warehouse"
              />
            </div>
            <div className={styles.issueItemsSection}>
              <h2 className={typography.sectionHeading}>Items</h2>
              {warehouseId ? (
                <EditableGrid
                  key={`stocktake-${warehouseId}`}
                  columns={newColumns}
                  initialRows={rows}
                  allowAddRows
                  allowDeleteRows
                  createRow={createRow}
                  onRowsChange={setRows}
                  addRowLabel="Add Item"
                  emptyText="No items have been added"
                  ariaLabel="Stocktake quantities"
                />
              ) : (
                <p className={styles.issueItemsHint}>
                  Select a warehouse to add items.
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
            <Input
              type="date"
              value={countDate}
              disabled={readOnly}
              onChange={(e) => setCountDate(e.target.value)}
            />
          </div>
          <div className={`${styles.field} ${styles.wide}`}>
            <label className={typography.fieldLabel}>Notes</label>
            <textarea
              className={styles.textarea}
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
        ) : (
          <p className={styles.reviewWarning}>
            Enter the actual quantity counted. Blank quantities retain the
            current On Hand quantity.
          </p>
        )}
        <EditableGrid
          key={`${warehouseId}-${review}-${readOnly}`}
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
            variant="secondary"
            onClick={() =>
              review ? setReview(false) : router.push("/inventory/stock-counts")
            }
          >
            {review ? "Back" : "Cancel"}
          </Button>
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
            variant="primary"
            onClick={() => (review ? void complete() : setReview(true))}
          >
            {review ? "Complete Stocktake" : "Review Stocktake"}
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
        <div className={layout.slotTitleByline}>
          <p className={typography.headingByline}>
            Record the actual stock quantities held in a warehouse.
          </p>
        </div>
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
