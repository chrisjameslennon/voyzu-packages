"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, Toast, ValidationAlert, Alert, Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { AddCustomerConfigurationModal } from "./AddCustomerConfigurationModal";
import { transitionCustomerConfigurationAction } from "../server/actions/customer-configuration.actions";

import { customerConfigurationMeta, type CustomerConfigurationKind, type CustomerConfiguration } from "../types/customer-configuration.dto";

const filterTabs: FilterTab[] = [
  { key: "status", label: "Status", type: "checkbox", options: ["ACTIVE", "INACTIVE"] },
];
const PAGE_SIZE = 25;

export function CustomerConfigurationList({ customers, hasOrganization, kind }: { customers: CustomerConfiguration[]; hasOrganization: boolean; kind: CustomerConfigurationKind }) {
  const meta = customerConfigurationMeta[kind];
  const title = meta.title, itemLabel = kind === "categories" ? "categories" : "price lists";
  const columns: DataTableColumn<CustomerConfiguration>[] = [
    { key: "code", label: kind === "categories" ? "Category Code" : "Price List Code", width: "17%", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
    { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
    { key: "description", label: "Description", width: "25%" },
    ...(kind === "priceLists" ? [{ key: "value", label: "Adjustment", width: "16%", render: (row: CustomerConfiguration) => (row.direction === "increase" ? "+" : "?") + (row.method === "amount" ? "$" : "") + row.value.toFixed(2) + (row.method === "percentage" ? "%" : "") }] : []),
    { key: "count", label: "Number of Customers", header: <>Number of<br />Customers</>, width: "13%", align: "center" },
    { key: "status", label: "Status", width: "10%", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
  ];
  const router = useRouter();

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
      (!query || [row.code, row.name, row.description].some((value) => value?.toLowerCase().includes(query)))
      && (!statuses?.length || statuses.includes(row.status))
    ));
  }, [customers, search, filters]);
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedRows = customers.filter(({ id }) => selectedIds.has(id));
  const transition=(operation:"activate"|"deactivate"|"delete")=>{setError("");startTransition(async()=>{try{const result=await transitionCustomerConfigurationAction(kind,selectedRows.map((row)=>row.code),operation);if(result.error){setError(result.error);return;}setSelectedIds(new Set());setToast(operation==="delete"?"Records deleted":operation==="activate"?"Records activated":"Records deactivated");router.refresh();}catch{setError("Unable to update. Please try again.");}});};
  const allSelected = pageRows.length > 0 && pageRows.every(({ id }) => selectedIds.has(id));
  const removeFilter = (key: string) => {
    setFilters((current) => { const next = { ...current }; delete next[key]; return next; });
    setPage(1);
  };
  const clearFilters = () => { setFilters({}); setSearch(""); setPage(1); };
  const exportRows = async (rows: CustomerConfiguration[], suffix: string) => {
    setExporting(true);
    setExportError("");
    try {
      const response = await fetch("/api/capability/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `${kind}_${suffix}`,
          columns: columns.map(({ key, label }) => ({ key, label })),
          rows: rows.map((row) => ({ ...row, value: (row.direction === "increase" ? "+" : "-") + (row.method === "amount" ? "$" : "") + row.value.toFixed(2) + (row.method === "percentage" ? "%" : "") })),
        }),
      });
      if (!response.ok) throw new Error("Export failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kind}_${suffix}.csv`;
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
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>{kind === "categories" ? "Manage your customer categories." : "Manage customer price lists and pricing adjustments."}</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" className={layout.slotPrimaryAction} disabled={!hasOrganization||pending} onClick={()=>setAdding(true)}>{"Add "+meta.singular}</Button></div>
        <div className={layout.slotAlert}><ValidationAlert errors={error?[error]:[]} visible={!!error} onDismiss={()=>setError("")}/></div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={filters} onApply={(next) => { setFilters(next); setPage(1); }} onClear={() => { setFilters({}); setPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder={`Search ${itemLabel}...`} aria-label={`Search ${itemLabel}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={pending||!selectedRows.some((row)=>row.status==="INACTIVE")} onClick={()=>transition("activate")}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={pending||!selectedRows.some((row)=>row.status==="ACTIVE")} onClick={()=>transition("deactivate")}>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" aria-label="Delete selected records" disabled={pending||!selectedRows.length} onClick={()=>setConfirm(true)}/>
            <Button variant="plain" icon="sync" title="Refresh" aria-label={"Refresh " + itemLabel} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())} />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" aria-label={"Export " + itemLabel} disabled={exporting || customers.length === 0} />}
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
        <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setPage(1); } }] : []} onClear={clearFilters} onRemoveFilter={removeFilter} /></div></div>
      )}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          {exportError && <Alert variant="soft" color="danger" title="Export failed" text={exportError} />}
          <DataTable<CustomerConfiguration, number>
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
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{row.code}</div><div className={listStyles.mobileName}>{row.name}</div><div className={listStyles.mobileMeta}>{row.description}</div><div className={listStyles.mobileMeta}>{row.count} customers</div><Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge></div>}
          />
        </div>
      </div>
      {adding && <AddCustomerConfigurationModal kind={kind} onClose={()=>setAdding(false)}/>}
      <ConfirmDialog isOpen={confirm} title={"Delete " + meta.title} message="Permanently delete the selected records?" confirmLabel="Delete" confirmVariant="danger" onClose={()=>setConfirm(false)} onConfirm={()=>{setConfirm(false);transition("delete");}}/>
      <Toast isVisible={!!toast} message={toast} onClose={()=>setToast("")}/>
    </div>
  );
}
