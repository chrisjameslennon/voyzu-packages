"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyPageTitleBadges } from "@voyzu-modules/core/common/client";

import type { ArSubledgerEntryResponseDto } from "@voyzu-modules/core/types/modules/ar-subledger";
import { Badge, Breadcrumbs, Button, DataTable, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import localStyles from "./ar-invoices-list.module.css";

const ITEMS_PER_PAGE = 100;
type PaymentStatusCode = "UNPAID" | "PART_PAID" | "SETTLED";

interface ArInvoiceRow {
  id: string;
  documentId: string;
  counterparty: string;
  invoiceAmount: number;
  totalPayments: number;
  totalOtherCredits: number;
  balance: number;
  paymentStatus: PaymentStatusCode;
}

const PAYMENT_STATUS_LABEL: Record<PaymentStatusCode, string> = {
  UNPAID: "Unpaid",
  PART_PAID: "Part Paid",
  SETTLED: "Settled",
};

const PAYMENT_STATUS_BADGE_COLOR: Record<PaymentStatusCode, "danger" | "warning" | "success"> = {
  UNPAID: "danger",
  PART_PAID: "warning",
  SETTLED: "success",
};

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number) => {
  if (value === 0) return "-";
  const formatted = moneyFormat.format(Math.abs(value));
  return value < 0 ? `(${formatted})` : formatted;
};
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function calculateUnappliedCredits(entries: ArSubledgerEntryResponseDto[]): number {
  return roundMoney(entries.reduce((sum, entry) => {
    if (entry.documentTypeCode === "AR_INVOICE") return sum;
    return sum + (entry.controlAccountBalances ?? []).reduce((entrySum, balance) => {
      if (balance.controlAccountCode === "AR_UNAPPLIED_RECEIPTS") return entrySum + balance.balance;
      if (balance.controlAccountCode === "AR_TRADE_RECEIVABLES" && !entry.appliedToDocumentId) return entrySum + balance.balance;
      return entrySum;
    }, 0);
  }, 0));
}

function toRows(entries: ArSubledgerEntryResponseDto[]) {
  const rows = entries
    .filter((entry) => entry.documentTypeCode === "AR_INVOICE" && entry.entryType === "DEBIT")
    .map((entry) => ({
      id: entry.documentId,
      documentId: entry.documentId,
      counterparty: entry.counterpartyName,
      invoiceAmount: entry.baseCurrencyAmount,
      totalPayments: entry.paymentAppliedAmount ?? 0,
      totalOtherCredits: entry.otherCreditAppliedAmount ?? 0,
      balance: entry.openBalance ?? 0,
      paymentStatus: entry.paymentStatus ?? "UNPAID",
    } satisfies ArInvoiceRow))
    .sort((a, b) => a.documentId.localeCompare(b.documentId));

  return {
    rows,
    totals: {
      totalInvoices: rows.reduce((sum, row) => sum + row.invoiceAmount, 0),
      appliedPayments: rows.reduce((sum, row) => sum + row.totalPayments, 0),
      appliedOtherCredits: rows.reduce((sum, row) => sum + row.totalOtherCredits, 0),
      openBalance: rows.reduce((sum, row) => sum + row.balance, 0),
      unappliedCredits: calculateUnappliedCredits(entries),
    },
  };
}

const columns: DataTableColumn<ArInvoiceRow>[] = [
  { key: "documentId", label: "Document ID", width: "13rem", render: (row) => <span className={listStyles.codeCell}>{row.documentId}</span> },
  { key: "counterparty", label: "Counterparty", width: "18rem", render: (row) => <span className={listStyles.nameCell}>{row.counterparty}</span> },
  { key: "invoiceAmount", label: "Invoice Amount", width: "10rem", align: "right", render: (row) => money(row.invoiceAmount) },
  { key: "totalPayments", label: "Payments", width: "10rem", align: "right", render: (row) => money(row.totalPayments) },
  { key: "totalOtherCredits", label: "Other Credits", width: "11rem", align: "right", render: (row) => money(row.totalOtherCredits) },
  { key: "balance", label: "Balance", width: "10rem", align: "right", render: (row) => money(row.balance) },
  { key: "paymentStatus", label: "Payment Status", width: "10rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={PAYMENT_STATUS_BADGE_COLOR[row.paymentStatus]}>{PAYMENT_STATUS_LABEL[row.paymentStatus]}</Badge> },
];

export function ArInvoicesListContent({ entries }: { entries: ArSubledgerEntryResponseDto[] }) {
  const router = useRouter();
  const { rows, totals } = useMemo(() => toRows(entries), [entries]);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [entries]);

  const filterTabs = useMemo<FilterTab[]>(() => [{ key: "paymentStatus", label: "Payment Status", type: "checkbox", options: Object.values(PAYMENT_STATUS_LABEL) }], []);
  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) result = result.filter((row) => row.documentId.toLowerCase().includes(query) || row.counterparty.toLowerCase().includes(query));
    const statusFilter = activeFilters.paymentStatus as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(PAYMENT_STATUS_LABEL[row.paymentStatus]));
    return result;
  }, [activeFilters, rows, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;
  const removeFilter = (key: string) => setActiveFilters((current) => { const next = { ...current }; delete next[key]; return next; });
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => { router.refresh(); setRefreshing(false); }, 500);
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={`${layout.slotTitle} ${localStyles.titleSlot}`}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>request_quote</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Invoices</h1><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div><div className={layout.slotTitleByline}><p className={typography.headingByline}>Customer invoices posted to the Accounts Receivable subledger, with the remaining open balance still outstanding on each document.</p></div></div>
        <div className={`${layout.slotSearch} ${localStyles.balancesSlot}`}>
          <section className={localStyles.balancesCard} aria-label="Invoice totals"><h2 className={localStyles.balancesTitle}>Totals</h2><div className={localStyles.balanceRows}><div className={localStyles.totalRow}><span className={localStyles.balanceLabel}>Total Invoices</span><span className={localStyles.balanceValue}>{money(totals.totalInvoices)}</span></div><div className={localStyles.totalRow}><span className={localStyles.balanceLabel}>Less: Payments Applied</span><span className={localStyles.balanceValue}>{money(totals.appliedPayments)}</span></div><div className={localStyles.totalRow}><span className={localStyles.balanceLabel}>Less: Other Credits Applied</span><span className={localStyles.balanceValue}>{money(totals.appliedOtherCredits)}</span></div><div className={`${localStyles.totalRow} ${localStyles.totalRowEmphasis}`}><span className={localStyles.balanceLabel}>Open Invoice Balance</span><span className={localStyles.balanceValue}>{money(totals.openBalance)}</span></div><div className={localStyles.totalRow}><span className={localStyles.balanceLabel}>Unapplied Credits not included</span><span className={localStyles.balanceValue}>{money(totals.unappliedCredits)}</span></div></div></section>
        </div>
      </header>
      <div className={layout.listToolbar}><div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search invoices..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div><div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} /></div></div></div>
      {(hasActiveFilters || hasSearch) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div></div>}
      <div className={layout.listBody}><div className={layout.slotBody}><DataTable<ArInvoiceRow, string> columns={columns} rows={paginated} selectedIds={new Set<string>()} isAllSelected={false} isSomeSelected={false} onSelectAll={() => undefined} onSelectOne={() => undefined} noSelectionColumn onRowClick={(row) => router.push(`/finance/subledgers/ar/invoices/${encodeURIComponent(row.documentId)}`)} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalCount={rows.length} filteredCount={filtered.length} itemLabel="invoices" hasData={rows.length > 0} emptyIcon="request_quote" emptyTitle="No invoices found" emptyText="No AR invoices have been posted to this subledger" emptyFilterText="No invoices match your search" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.documentId}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.counterparty}</span></div><div className={listStyles.mobileMeta}>Balance {money(row.balance)}</div><Badge variant="soft" size="x-small" color={PAYMENT_STATUS_BADGE_COLOR[row.paymentStatus]}>{PAYMENT_STATUS_LABEL[row.paymentStatus]}</Badge></div>} /></div></div>
    </div>
  );
}
