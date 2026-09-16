"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, Toast, ValidationAlert, Alert, Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { ChangeCustomerCategoryModal } from "./ChangeCustomerCategoryModal";
import { AddCustomerModal } from "./AddCustomerModal";
import { transitionCustomersAction } from "../server/actions/customer.actions";

import type { CustomerConfiguration } from "../types/customer-configuration.dto";
import type { Customer } from "../types/customer.dto";

const filterTabs: FilterTab[] = [
  { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
];
const PAGE_SIZE = 25;

export function CustomersList({ customers, hasOrganization, categories, priceLists }: { customers: Customer[]; hasOrganization: boolean; categories: CustomerConfiguration[]; priceLists: CustomerConfiguration[] }) {
  const tabs: FilterTab[] = [
    { key: "categoryCode", label: "Category", type: "checkbox", options: categories.map((row) => row.code) },
    { key: "priceListCode", label: "Price List", type: "checkbox", options: priceLists.map((row) => row.code) },
    ...filterTabs,
  ];
  const title = "Customers", itemLabel = "customers";
  const columns: DataTableColumn<Customer>[] = [
    { key: "code", label: "Customer Code", width: "11%", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
    { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
    { key: "primaryContactName", label: "Primary Contact", width: "14%" },
    { key: "email", label: "Email", width: "18%" },
    { key: "categoryCode", label: "Category", width: "12%", render: (row) => categories.find((category) => category.code === row.categoryCode)?.name ?? "?" },
    { key: "priceListCode", label: "Price List", width: "12%", render: (row) => priceLists.find((list) => list.code === row.priceListCode)?.name ?? "?" },
    { key: "status", label: "Status", width: "9%", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
  ];
  const router = useRouter();
  const [categoryChange, setCategoryChange] = useState<"category" | "priceList" | null>(null);
  const meta = { singular: "Customer", href: "/commercial/customers" };
  const [adding,setAdding]=useState(false),[confirm,setConfirm]=useState(false),[error,setError]=useState(""),[toast,setToast]=useState("");
  const [pending,startTransition]=useTransition();
  const [refreshing, startRefresh] = useTransition();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ status: ["ACTIVE"] });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return customers.filter((row) => (
      (!query || [row.code, row.name, row.primaryContactName, row.email, ...row.addresses.flatMap((address) => [address.city, address.country_code])].some((value) => value?.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
      && (!(filters.categoryCode as string[] | undefined)?.length || (filters.categoryCode as string[]).includes(row.categoryCode ?? ""))
      && (!(filters.priceListCode as string[] | undefined)?.length || (filters.priceListCode as string[]).includes(row.priceListCode ?? ""))
    ));
  }, [customers, search, filters]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedRows = customers.filter(({ id }) => selectedIds.has(id));
  const transition=(operation:"activate"|"deactivate"|"delete")=>{setError("");startTransition(async()=>{try{const result=await transitionCustomersAction(selectedRows.map((row)=>row.code),operation);if(result.error){setError(result.error);return;}setSelectedIds(new Set());setToast(operation==="delete"?"Customers deleted":operation==="activate"?"Customers activated":"Customers deactivated");router.refresh();}catch{setError("Unable to update. Please try again.");}});};
  const allSelected = pageRows.length > 0 && pageRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => {
    setFilters((current) => { const next = { ...current }; delete next[key]; return next; });
    setPage(1);
  };
  const clearFilters = () => { setFilters({}); setSearch(""); setPage(1); };
  const exportRows = async (rows: Customer[], suffix: string) => {
    setExporting(true);
    setExportError("");
    try {
      const response = await fetch("/api/capability/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `customers_${suffix}`,
          columns: columns.map(({ key, label }) => ({ key, label })),
          rows: rows.map((row) => ({ ...row, categoryCode: categories.find((category) => category.code === row.categoryCode)?.name ?? "", priceListCode: priceLists.find((list) => list.code === row.priceListCode)?.name ?? "" })),
        }),
      });
      if (!response.ok) throw new Error("Export failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers_${suffix}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Customers could not be exported. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>group</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{title}</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Manage customer accounts</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" className={layout.slotPrimaryAction} disabled={!hasOrganization||pending} onClick={()=>setAdding(true)}>{"Add "+meta.singular}</Button></div>
        <div className={layout.slotAlert}><ValidationAlert errors={error?[error]:[]} visible={!!error} onDismiss={()=>setError("")}/></div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={tabs} filters={filters} onApply={(next) => { setFilters(next); setPage(1); }} onClear={() => { setFilters({}); setPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder={`Search ${itemLabel}...`} aria-label={`Search ${itemLabel}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <DropdownMenu
              trigger={<Button variant="secondary" disabled={pending || !selectedRows.length}>Actions <span className="material-symbols-outlined">expand_more</span></Button>}
              items={[
                { value: "activate", label: "Activate", icon: "check_circle", disabled: pending || !selectedRows.some((row) => row.status === "INACTIVE"), onSelect: () => transition("activate") },
                { value: "deactivate", label: "Deactivate", icon: "block", disabled: pending || !selectedRows.some((row) => row.status === "ACTIVE"), onSelect: () => transition("deactivate") },
                { value: "category", label: "Change Category", icon: "sync_alt", disabled: pending || !selectedRows.length, onSelect: () => setCategoryChange("category") },
                { value: "price-list", label: "Change Price List", icon: "sync_alt", disabled: pending || !selectedRows.length, onSelect: () => setCategoryChange("priceList") },
              ]}
              alignment="right" width={260}
            />
            <Button variant="secondary-destructive" icon="delete" aria-label="Delete selected customers" disabled={pending||!selectedRows.length} onClick={()=>setConfirm(true)}/>
            <Button variant="plain" icon="sync" title="Refresh" aria-label="Refresh customers" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())} />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" aria-label="Export customers" disabled={exporting || customers.length === 0} />}
              items={[
                { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: exporting || selectedRows.length === 0, onSelect: () => void exportRows(selectedRows, "selected") },
                { value: "current-view", label: `Current view (${visibleRows.length})`, icon: "visibility", disabled: exporting || visibleRows.length === 0, onSelect: () => void exportRows(visibleRows, "current_view") },
                { value: "full-dataset", label: `Full dataset (${customers.length})`, icon: "database", disabled: exporting || customers.length === 0, onSelect: () => void exportRows(customers, "full_dataset") },
              ]}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>
      {(search.trim() || Object.values(filters).some((value) => Array.isArray(value) && value.length > 0)) && (
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={tabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setPage(1); } }] : []} onClear={clearFilters} onRemoveFilter={removeFilter} /></div></div>
      )}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          {exportError && <Alert variant="soft" color="danger" title="Export failed" text={exportError} />}
          <DataTable<Customer, number>
            onRowClick={(row)=>router.push(meta.href+"/"+encodeURIComponent(row.code))}
            columns={columns}
            rows={pageRows}
            selectedIds={selectedIds}
            isAllSelected={allSelected}
            isSomeSelected={!allSelected && pageRows.some(({ id }) => selectedIds.has(id))}
            onSelectAll={() => setSelectedIds((current) => {
              const next = new Set(current);
              pageRows.forEach(({ id }) => { if (allSelected) next.delete(id); else next.add(id); });
              return next;
            })}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={customers.length}
            filteredCount={visibleRows.length}
            itemLabel={itemLabel}
            hasData={customers.length > 0}
            loading={refreshing}
            emptyIcon="group"
            emptyTitle={hasOrganization ? `No ${itemLabel} yet` : "Select an organization"}
            emptyText={hasOrganization ? "Add the first "+meta.singular.toLowerCase()+"." : "Select an organization to view its customers."}
            emptyFilterText="No customers match your search or filters"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}>{row.name}</div><div className={listStyles.mobileMeta}>{row.primaryContactName}</div><div className={listStyles.mobileMeta}>{row.email}</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
      {categoryChange && <ChangeCustomerCategoryModal kind={categoryChange} codes={selectedRows.map((row) => row.code)} options={(categoryChange === "category" ? categories : priceLists).filter((row) => row.status === "ACTIVE")} onClose={() => setCategoryChange(null)} onSaved={() => { setToast(categoryChange === "category" ? "Customer categories changed" : "Customer price lists changed"); setCategoryChange(null); setSelectedIds(new Set()); router.refresh(); }} />}
      {adding && <AddCustomerModal categories={categories} priceLists={priceLists} onClose={()=>setAdding(false)}/>}
      <ConfirmDialog isOpen={confirm} title="Delete Customers" message="Permanently delete the selected customers?" confirmLabel="Delete" confirmVariant="danger" onClose={()=>setConfirm(false)} onConfirm={()=>{setConfirm(false);transition("delete");}}/>
      <Toast isVisible={!!toast} message={toast} onClose={()=>setToast("")}/>
    </div>
  );
}
