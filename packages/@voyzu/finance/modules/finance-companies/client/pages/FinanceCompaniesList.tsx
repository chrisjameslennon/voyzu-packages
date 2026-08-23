"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FinanceCompanyResponseDto } from "@voyzu/finance/types/modules/finance-companies";
import { getAvatarColor } from "@voyzu/erp-core/common/client";
import { Badge, Breadcrumbs, Button, DataTable, FilterChips, FilterPanel, Input, Toast, ValidationAlert, type DataTableColumn, type FilterState, type FilterTab } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import list from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const FILTER_TABS: FilterTab[] = [
  { key: "finance", label: "Finance", type: "checkbox", options: ["Enabled", "Not enabled"] },
  { key: "status", label: "Organization status", type: "checkbox", options: ["ACTIVE", "ARCHIVED"] },
];

export function FinanceCompaniesList({ initialCompanies }: { initialCompanies: FinanceCompanyResponseDto[] }) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const selected = companies.find(({ id }) => selectedIds.has(id));
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const finance = filters.finance as string[] | undefined;
    const statuses = filters.status as string[] | undefined;
    return companies.filter((company) => {
      const financeLabel = company.financeEnabled ? "Enabled" : "Not enabled";
      const statusLabel = company.status === "INACTIVE" ? "ARCHIVED" : company.status;
      return (!query || [company.code, company.name, company.country?.name ?? company.countryCode, company.baseCurrencyCode]
        .some((value) => value.toLowerCase().includes(query)))
        && (!finance?.length || finance.includes(financeLabel))
        && (!statuses?.length || statuses.includes(statusLabel));
    });
  }, [companies, filters, search]);

  const refresh = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/finance/companies");
      if (!response.ok) throw new Error("Unable to refresh Finance companies");
      setCompanies(await response.json() as FinanceCompanyResponseDto[]);
      setSelectedIds(new Set());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to refresh Finance companies");
    } finally {
      setBusy(false);
    }
  };

  const activate = async () => {
    if (!selected || selected.financeEnabled) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/finance/companies/${encodeURIComponent(selected.code)}/activate`, { method: "POST" });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(body?.message ?? "Unable to enable company for Finance");
      }
      const updated = await response.json() as FinanceCompanyResponseDto;
      setCompanies((current) => current.map((item) => item.id === updated.id ? updated : item));
      setToast(`Enabled ${updated.code} for Finance`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to enable company for Finance");
    } finally {
      setBusy(false);
    }
  };

  const columns: DataTableColumn<FinanceCompanyResponseDto>[] = [
    { key: "code", label: "Code", width: "13rem", render: (row) => <span className={list.codeCell}>{row.code}</span> },
    {
      key: "name", label: "Name", render: (row) => {
        const color = getAvatarColor(row.code);
        return <span className={list.nameCell}><span className={list.avatar} style={{ backgroundColor: color.bg, color: color.fg }}>{row.name.charAt(0)}</span>{row.name}</span>;
      },
    },
    { key: "country", label: "Country", render: (row) => row.country?.name ?? row.countryCode },
    { key: "baseCurrencyCode", label: "Currency", width: "7rem" },
    { key: "financeEnabled", label: "Finance", width: "9rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.financeEnabled ? "success" : "neutral"}>{row.financeEnabled ? "ENABLED" : "NOT ENABLED"}</Badge> },
    { key: "status", label: "Organization status", width: "11rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status === "INACTIVE" ? "ARCHIVED" : row.status}</Badge> },
  ];

  const hasFilters = Object.values(filters).some((value) => Array.isArray(value) && value.length > 0);
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={list.titleIcon}><span className={`material-symbols-outlined ${list.titleIconSymbol}`}>domain</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Companies</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Enable organization companies for Finance and manage their financial settings.</p></div>
        </div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={FILTER_TABS} filters={filters} onApply={setFilters} onClear={() => setFilters({})} onRemoveFilter={(key) => setFilters((current) => ({ ...current, [key]: [] }))} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search companies..." /></div>
        <div className={layout.slotToolbarRight}><div className={list.toolbarActions}>
          <Button variant="secondary" icon="check_circle" disabled={!selected || selected.financeEnabled || selected.status !== "ACTIVE" || busy} onClick={() => void activate()}>Enable Finance</Button>
          <Button variant="plain" icon="sync" title="Refresh" disabled={busy} className={busy ? list.spinning : undefined} onClick={() => void refresh()} />
        </div></div>
      </div>
      {(hasFilters || search.trim()) && <div className={layout.chipsRow}><div className={layout.slotChips}><FilterChips tabs={FILTER_TABS} filters={filters} additionalChips={search.trim() ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => setSearch("") }] : []} onClear={() => { setFilters({}); setSearch(""); }} onRemoveFilter={(key) => setFilters((current) => ({ ...current, [key]: [] }))} /></div></div>}
      {error && <div className={layout.slotAlert}><ValidationAlert errors={[error]} visible onDismiss={() => setError("")} /></div>}
      <div className={layout.listBody}><div className={layout.slotBody}>
        <DataTable columns={columns} rows={filtered} selectedIds={selectedIds} isAllSelected={false} isSomeSelected={selectedIds.size > 0} singleSelect onSelectAll={() => setSelectedIds(new Set())} onSelectOne={(id) => setSelectedIds((current) => current.has(id) ? new Set() : new Set([id]))} onRowClick={(row) => router.push(`/finance/companies/${encodeURIComponent(row.code)}`)} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={companies.length} filteredCount={filtered.length} itemLabel="companies" hasData={companies.length > 0} emptyIcon="domain" emptyTitle="No companies found" emptyText="Create companies in Organization first" />
      </div></div>
      <Toast isVisible={Boolean(toast)} onClose={() => setToast("")} message={toast} />
    </div>
  );
}
