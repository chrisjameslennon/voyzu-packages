"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  DatePicker,
  EditableGrid,
  Input,
  SearchableSelect,
  TabGroup,
  Toast,
  ValidationAlert,
  type EditableGridColumn,
  type TabDef,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import entryLayout from "@voyzu/ui-layout/css-modules/document-entry.layout.module.css";
import reportLayout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  StockCountDetail,
  StockOption,
  StockPosition,
} from "../types/stock.types";
import { STOCK_ADJUSTMENT_REASONS } from "../../core/types";
import { CompleteStockCount, CreateStockCount, SaveStockCount } from "../domain/operation-policy";
import { isSelectSearchable } from "../../core/client/select-policy";
import {
  StockCountReportTemplate,
  type StockCountOrganization,
} from "./StockCountReportTemplate";
import reportStyles from "./stock-count-report.module.css";
import styles from "./stock.module.css";
type Row = {
  id: number;
  itemId: number | string;
  sku: string;
  itemName: string;
  expectedQuantity: number;
  countedQuantity: number | "";
  variance: number | string;
  reasonCode: string;
};
export function StockCountEditor({
  record: initial,
  organization,
  positions,
  warehouses,
}: {
  record?: StockCountDetail;
  organization?: StockCountOrganization;
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
  const [reference, setReference] = useState(initial?.reference ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [rows, setRows] = useState<Row[]>(
    initial?.lines.map((l) => ({
      ...l,
      countedQuantity: l.countedQuantity ?? "",
      variance: l.variance ?? "—",
    })) ?? [],
  );
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  useEffect(() => {
    setGeneratedAt(
      new Date().toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, []);
  const selectableWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.status !== "INACTIVE" || warehouse.id === initial?.warehouseId,
  );
  const selectedWarehouseStatus =
    warehouses.find((warehouse) => warehouse.id === Number(warehouseId))
      ?.status ?? "ACTIVE";
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
      width: 230,
    },
    {
      key: "expectedQuantity",
      label: "On Hand",
      type: "number",
      readOnly: true,
      width: 112,
    },
    {
      key: "countedQuantity",
      label: "Actual Quantity",
      type: "number",
      readOnly: record?.status === "COMPLETED",
      width: 112,
    },
    {
      key: "variance",
      label: "Variance",
      type: "text",
      readOnly: true,
      width: 112,
      valueClassName: styles.varianceValue,
      calculate: (row) =>
        row.countedQuantity === ""
          ? "—"
          : Number(row.countedQuantity) - row.expectedQuantity,
    },
    {
      key: "reasonCode",
      label: "Reason",
      type: "select",
      readOnly: record?.status === "COMPLETED",
      width: 160,
      searchable: false,
      options: STOCK_ADJUSTMENT_REASONS.map(({ code, label }) => ({ value: code, label })),
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
        reasonCode: "STOCK_VARIANCE",
      }));
  const payload = () => ({
    warehouseId: Number(warehouseId),
    countDate,
    reference: reference.trim() || undefined,
    notes,
    lines: calculated.filter((row) => row.itemId).map((row) => ({
      itemId: Number(row.itemId),
      countedQuantity:
        row.countedQuantity === "" ? null : Number(row.countedQuantity),
      reasonCode: row.reasonCode,
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
    if (rows.some((row) => !row.reasonCode)) {
      setError("Select a reason for every stock count line");
      return;
    }
    const reasonBlockers = record
      ? SaveStockCount(record.status, rows, notes, selectedWarehouseStatus)
      : CreateStockCount(rows, notes, selectedWarehouseStatus);
    if (reasonBlockers.length) {
      setError(reasonBlockers[0]!.message);
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
    const current = await save("IN_PROGRESS");
    if (!current) return;
    const response = await request(
      `/api/inventory/stock-counts/${current.id}/complete`,
      { method: "POST" },
    );
    if (!response) return;
    const completed = (await response.json()) as StockCountDetail;
    router.replace(`/inventory/stock-counts/${completed.id}`);
    router.refresh();
  };
  const requestComplete = () => {
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
    if (rows.some((row) => !row.reasonCode)) {
      setError("Select a reason for every stock count line");
      return;
    }
    const reasonBlockers = CompleteStockCount(
      record?.status ?? "IN_PROGRESS",
      rows,
      notes,
      selectedWarehouseStatus,
    );
    if (reasonBlockers.length) {
      setError(reasonBlockers[0]!.message);
      return;
    }
    setConfirmComplete(true);
  };
  const readOnly = record?.status === "COMPLETED";
  const title = record?.code ?? "New Stocktake";
  const selectedWarehouse = warehouses.find(
    (warehouse) => warehouse.id === Number(warehouseId),
  );
  const confirmCountDate = countDate
    ? new Date(`${countDate}T00:00:00`).toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  if (!record || !readOnly)
    return (
      <div
        className={entryLayout.documentEntryView}
      >
        <header className={entryLayout.documentEntryHeader}>
          <div className={entryLayout.slotBreadcrumb}>
            <Breadcrumbs />
          </div>
          <div className={entryLayout.slotTitle}>
            <div className={styles.titleTextBlock}>
              <h1
                className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
              >
                {record?.code ?? "New Stocktake"}
              </h1>
              <p className={typography.headingByline}>
                Record the actual stock quantities held in a warehouse.
              </p>
            </div>
          </div>
          <div className={entryLayout.slotActions}>
            <div className={detailStyles.headerActions}>
              <Button
                variant="cancel"
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
                onClick={requestComplete}
              >
                Submit Stocktake
              </Button>
            </div>
          </div>
          <div className={entryLayout.slotAlert}>
            <ValidationAlert
              errors={error ? [error] : []}
              visible={!!error}
              onDismiss={() => setError("")}
            />
          </div>
        </header>
        <aside className={entryLayout.slotDocument}>
          <div className={styles.documentPanel}>
            <div className={styles.documentPanelLabel}>
              Stocktake document
            </div>
            <div className={styles.documentPanelFields}>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Count Date</label>
                <fieldset className={styles.datePickerFieldset}>
                  <DatePicker
                    value={countDate}
                    onChange={setCountDate}
                    clearable
                    hasError={error === "Count Date is required"}
                  />
                </fieldset>
              </div>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>
                  Reference (optional)
                </label>
                <Input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={typography.fieldLabel}>
                  Notes (optional)
                  {error === "Notes are required when a reason is Other" ? " *" : ""}
                </label>
                <textarea
                  className={`${styles.textarea} ${styles.stocktakeNotes}`}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>
        <main className={`${entryLayout.slotMain} ${styles.stack}`}>
          <section className={detailStyles.card}>
            <h2 className={typography.sectionHeading}>Stocktake Details</h2>
            {record ? (
              <div className={styles.issueWarehouseField}>
                <label className={typography.fieldLabel}>Code</label>
                <Input value={record.code} disabled />
              </div>
            ) : null}
            <div className={styles.issueWarehouseField}>
              <label className={typography.fieldLabel}>Warehouse</label>
              <SearchableSelect
                value={warehouseId}
                searchable={isSelectSearchable(selectableWarehouses.length)}
                onChange={(value) => {
                  setWarehouseId(value);
                  setRows(value ? warehouseRows(value) : []);
                  if (value && error === "Warehouse is required") setError("");
                }}
                disabled={!!record}
                hasError={error === "Warehouse is required"}
                options={selectableWarehouses.map((warehouse) => ({
                  value: String(warehouse.id),
                  label: warehouse.name,
                  code: warehouse.code,
                }))}
                placeholder="Select a warehouse"
              />
            </div>
            <div className={styles.issueItemsSection}>
              <h2 className={typography.sectionHeading}>
                Items
              </h2>
              <p className={styles.stocktakeItemsHelp}>
                Leave the Actual Quantity blank to accept the On Hand value.
              </p>
              {warehouseId ? (
                <EditableGrid
                  key={`stocktake-${warehouseId}`}
                  className={styles.stocktakeGrid}
                  columns={columns}
                  initialRows={calculated}
                  onRowsChange={setRows}
                  emptyText="This warehouse has no stocked items"
                  ariaLabel="Stocktake quantities"
                  mobileLayout="cards"
                />
              ) : (
                <p className={styles.issueItemsHint}>
                  Select a warehouse to load its stocked items.
                </p>
              )}
            </div>
          </section>
        </main>
        <ConfirmDialog
          isOpen={confirmComplete}
          size="wide"
          title="Confirm Stocktake"
          confirmLabel="Submit Stocktake"
          confirmVariant="primary"
          onClose={() => setConfirmComplete(false)}
          onConfirm={() => {
            setConfirmComplete(false);
            void complete();
          }}
          message={
            <div className={styles.issueConfirmDocument}>
              <div className={styles.issueConfirmBox}>
                <p className={styles.issueConfirmSummary}>
                  Complete the stocktake for{" "}
                  <strong>
                    {selectedWarehouse?.name ?? "the selected warehouse"}
                  </strong>{" "}
                  with <strong>{changes.length}</strong>{" "}
                  {changes.length === 1 ? "adjustment" : "adjustments"}.
                </p>
                <dl className={styles.issueConfirmMetadata}>
                  <div>
                    <dt>Count Date</dt>
                    <dd>{confirmCountDate}</dd>
                  </div>
                  <div>
                    <dt>Reference</dt>
                    <dd>{reference.trim() || "—"}</dd>
                  </div>
                </dl>
              </div>
              <div
                className={`${styles.issueConfirmBox} ${styles.issueConfirmItems}`}
              >
                <div className={styles.issueConfirmItemsScroll}>
                  <table className={styles.issueConfirmItemsTable}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Recorded</th>
                        <th>Counted</th>
                        <th>Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changes.map((row) => (
                        <tr key={row.id}>
                          <td>{row.itemName}</td>
                          <td>{row.expectedQuantity}</td>
                          <td>{row.countedQuantity}</td>
                          <td>{row.variance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        />
        <Toast
          isVisible={!!toast}
          message={toast}
          onClose={() => setToast("")}
        />
      </div>
    );
  if (!organization) return null;
  const filter = record.audit.updated.mutationId
    ? `mutationId=${encodeURIComponent(record.audit.updated.mutationId)}`
    : `entityType=stock_count&entityId=${record.id}`;
  const details = (
    <div className={reportStyles.detailsTab}>
      <main className={reportStyles.detailsMain}>
      <section className={detailStyles.card}>
        <h2 className={typography.sectionHeading}>Stocktake Details</h2>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Code</label>
            <Input value={record.code} disabled />
          </div>
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Warehouse</label>
            <SearchableSelect
              value={warehouseId}
              searchable={isSelectSearchable(selectableWarehouses.length)}
              onChange={(value) => {
                setWarehouseId(value);
                setRows([]);
              }}
              disabled={readOnly || !!record}
              options={selectableWarehouses.map((w) => ({
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
          <div className={styles.field}>
            <label className={typography.fieldLabel}>Reference (optional)</label>
            <Input value={reference} disabled />
          </div>
          <div className={`${styles.field} ${styles.wide}`}>
            <label className={typography.fieldLabel}>Notes (optional)</label>
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
        <EditableGrid
          key={`${warehouseId}-${readOnly}`}
          className={styles.stocktakeGrid}
          columns={columns.map((column) => ({ ...column, readOnly: true }))}
          initialRows={calculated}
          onRowsChange={setRows}
          ariaLabel="Stocktake quantities"
        />
      </section>
      </main>
      <aside className={reportStyles.detailsRail}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Status</label>
          <Badge variant="soft" size="x-large" color="success">
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
    </div>
  );
  const printablePath = `/inventory/stock-counts/${record.id}/printable`;
  const pdfParams = new URLSearchParams({
    orientation: "portrait",
    path: printablePath,
    filename: `stock-count-${record.code}`,
  });
  const pdfViewPath = `/api/capability/pdf-view?${pdfParams.toString()}`;
  const pdfDownloadPath = `/api/capability/pdf?${pdfParams.toString()}`;
  const tabs: TabDef[] = [
    {
      key: "document",
      label: "Document",
      content: (
        <div className={reportStyles.tabContent}>
          <div className={reportStyles.toolbar}>
            <Button
              variant="secondary"
              icon="open_in_new"
              title="Printable Page"
              onClick={() => window.open(printablePath, "_blank", "noopener,noreferrer")}
            />
            <Button
              variant="secondary"
              icon="picture_as_pdf"
              title="View PDF"
              onClick={() => window.open(pdfViewPath, "_blank", "noopener,noreferrer")}
            />
            <Button
              variant="secondary"
              icon="download"
              title="Download PDF"
              onClick={() => { window.location.href = pdfDownloadPath; }}
            />
          </div>
          <div className={reportStyles.documentShell}>
            <div className={`${reportLayout.document} ${reportStyles.portraitDocument}`}>
              <StockCountReportTemplate
                record={record}
                organization={organization}
                generatedAt={generatedAt}
              />
            </div>
          </div>
        </div>
      ),
    },
    { key: "details", label: "Details", content: details },
  ];
  return (
    <div className={reportLayout.reportView}>
      <header className={reportLayout.reportHeader}>
        <div className={reportLayout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={reportLayout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>fact_check</span>
          </div>
          <div className={reportLayout.slotTitleText}>
            <h1 className={`${typography.pageTitle} ${reportLayout.pageTitleResponsive}`}>
              Stock Count {title}
            </h1>
          </div>
        </div>
        <div className={reportLayout.slotTitleActions}>
          <DetailBackButton fallbackHref="/inventory/stock-counts" />
        </div>
      </header>
      <div className={reportLayout.slotDocument}>
        <TabGroup tabs={tabs} defaultKey="document" />
      </div>
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
