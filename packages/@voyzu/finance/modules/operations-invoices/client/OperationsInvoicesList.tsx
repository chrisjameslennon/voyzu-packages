"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

type PaymentStatus = "Unpaid" | "Part Paid" | "Settled";
interface InvoiceRow {
  id: string;
  documentId: string;
  counterparty: string;
  invoiceAmount: number;
  totalPayments: number;
  totalOtherCredits: number;
  balance: number;
  paymentStatus: PaymentStatus;
}

const invoices: InvoiceRow[] = [
  { id: "INV-001", documentId: "INV-001", counterparty: "Acme Design Partners", invoiceAmount: 7475, totalPayments: 3000, totalOtherCredits: 0, balance: 4475, paymentStatus: "Part Paid" },
  { id: "INV-002", documentId: "INV-002", counterparty: "Global Trade NZ Ltd", invoiceAmount: 4880, totalPayments: 4880, totalOtherCredits: 0, balance: 0, paymentStatus: "Settled" },
  { id: "INV-003", documentId: "INV-003", counterparty: "Kiwi Financial Services", invoiceAmount: 3560, totalPayments: 0, totalOtherCredits: 0, balance: 3560, paymentStatus: "Unpaid" },
  { id: "INV-004", documentId: "INV-004", counterparty: "North Shore Consulting", invoiceAmount: 1437.5, totalPayments: 0, totalOtherCredits: 287.5, balance: 1150, paymentStatus: "Part Paid" },
  { id: "INV-005", documentId: "INV-005", counterparty: "Harbour Retail Group", invoiceAmount: 1552.5, totalPayments: 1552.5, totalOtherCredits: 0, balance: 0, paymentStatus: "Settled" },
  { id: "INV-006", documentId: "INV-006", counterparty: "Southern Lakes Engineering", invoiceAmount: 9200, totalPayments: 0, totalOtherCredits: 0, balance: 9200, paymentStatus: "Unpaid" },
  { id: "INV-007", documentId: "INV-007", counterparty: "Wellington Creative Studio", invoiceAmount: 2760, totalPayments: 1000, totalOtherCredits: 460, balance: 1300, paymentStatus: "Part Paid" },
  { id: "INV-008", documentId: "INV-008", counterparty: "Pacific Technology Ltd", invoiceAmount: 5750, totalPayments: 0, totalOtherCredits: 5750, balance: 0, paymentStatus: "Settled" },
  { id: "INV-009", documentId: "INV-009", counterparty: "Harbour Retail Group", invoiceAmount: 1035, totalPayments: 0, totalOtherCredits: 0, balance: 1035, paymentStatus: "Unpaid" },
];
const statusColors = { Unpaid: "danger", "Part Paid": "warning", Settled: "success" } as const;
const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number) => value === 0 ? "-" : value < 0 ? `(${moneyFormat.format(Math.abs(value))})` : moneyFormat.format(value);
const columns: DataTableColumn<InvoiceRow>[] = [
  { key: "documentId", label: "Document ID", width: "13rem", render: (row) => <span className={listStyles.codeCell}>{row.documentId}</span> },
  { key: "counterparty", label: "Counterparty", width: "18rem", render: (row) => <span className={listStyles.nameCell}>{row.counterparty}</span> },
  { key: "invoiceAmount", label: "Invoice Amount", width: "10rem", align: "right", render: (row) => money(row.invoiceAmount) },
  { key: "totalPayments", label: "Payments", width: "10rem", align: "right", render: (row) => money(row.totalPayments) },
  { key: "totalOtherCredits", label: "Other Credits", width: "11rem", align: "right", render: (row) => money(row.totalOtherCredits) },
  { key: "balance", label: "Balance", width: "10rem", align: "right", render: (row) => money(row.balance) },
  { key: "paymentStatus", label: "Payment Status", width: "10rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={statusColors[row.paymentStatus]}>{row.paymentStatus}</Badge> },
];
const filterTabs: FilterTab[] = [{ key: "paymentStatus", label: "Payment Status", type: "checkbox", options: ["Unpaid", "Part Paid", "Settled"] }];

export function OperationsInvoicesList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.paymentStatus as string[] | undefined;
    return invoices.filter((row) => (
      (!query || [row.documentId, row.counterparty].some((value) => value.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.paymentStatus))
    ));
  }, [search, filters]);
  const allSelected = visibleRows.length > 0 && visibleRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; });

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>receipt_long</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Invoices</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage customer invoices, receipts and outstanding balances.</p></div>
        </div>
        <div className={layout.slotActions}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary">New Credit Note</Button>
            <Button variant="primary" icon="add" onClick={() => router.push("/finance/operations/accounts-receivable/invoices/new")}>New Invoice</Button>
          </div>
        </div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search placeholder="Search invoices..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary">Record Receipt</Button>
            <Button variant="secondary">Write Off</Button>
            <Button variant="secondary">Withdraw</Button>
            <Button variant="secondary">Refund</Button>
            <Button variant="plain" icon="sync" title="Refresh" />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" />}
              items={[
                { value: "selected", label: `Selected (${selectedIds.size})`, icon: "check_box", disabled: selectedIds.size === 0, onSelect: () => undefined },
                { value: "current-view", label: `Current view (${visibleRows.length})`, icon: "visibility", disabled: visibleRows.length === 0, onSelect: () => undefined },
                { value: "full-dataset", label: `Full dataset (${invoices.length})`, icon: "database", onSelect: () => undefined },
              ]}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>
      {(search.trim() || Object.values(filters).some((value) => Array.isArray(value) && value.length > 0)) && (
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={removeFilter} /></div></div>
      )}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable<InvoiceRow, string>
            columns={columns}
            rows={visibleRows}
            selectedIds={selectedIds}
            isAllSelected={allSelected}
            isSomeSelected={!allSelected && visibleRows.some(({ id }) => selectedIds.has(id))}
            onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(visibleRows.map(({ id }) => id)))}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={invoices.length}
            filteredCount={visibleRows.length}
            itemLabel="invoices"
            hasData={invoices.length > 0}
            emptyIcon="request_quote"
            emptyTitle="No invoices found"
            emptyText="No invoices available"
            emptyFilterText="No invoices match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.documentId}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.counterparty}</span></div><div className={listStyles.mobileMeta}>Balance {money(row.balance)}</div><Badge variant="soft" size="x-small" color={statusColors[row.paymentStatus]}>{row.paymentStatus}</Badge></div>}
          />
        </div>
      </div>
    </div>
  );
}
