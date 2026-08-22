"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CountryTaxSetting } from "@voyzu/core/types/modules/country-tax-settings";
import { Badge, Breadcrumbs, Button, DataTable, Input, type DataTableColumn } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import list from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const columns: DataTableColumn<CountryTaxSetting>[] = [
  { key: "code", label: "Code", width: "12rem", render: (row) => <span className={list.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", render: (row) => <span className={list.nameCell}>{row.name}</span> },
  { key: "currencyCode", label: "Currency", render: (row) => `${row.currencyName} (${row.currencyCode})` },
  { key: "status", label: "Status", width: "8rem", align: "center", render: (row) => <Badge variant="soft" size="x-small" color="success">{row.status}</Badge> },
];

export function CountryTaxSettingsList({ initialCountries }: { initialCountries: CountryTaxSetting[] }) {
  const router = useRouter();
  const [countries, setCountries] = useState(initialCountries);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? countries.filter((country) => [country.code, country.name, country.currencyCode, country.currencyName]
      .some((value) => value.toLowerCase().includes(query))) : countries;
  }, [countries, search]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/finance/country-tax-settings");
      if (response.ok) setCountries(await response.json() as CountryTaxSetting[]);
    } finally { setRefreshing(false); }
  };

  return (
    <div className={layout.listView}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={list.titleIcon}><span className={`material-symbols-outlined ${list.titleIconSymbol}`}>public</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Country Tax Settings</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Review Finance tax configuration for active countries.</p></div>
        </div>
      </header>
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarSearch}><Input search value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search countries..." /></div>
        <div className={layout.slotToolbarRight}><div className={list.toolbarActions}>
          <Button variant="plain" icon="sync" title="Refresh" disabled={refreshing} className={refreshing ? list.spinning : undefined} onClick={() => void refresh()} />
        </div></div>
      </div>
      <div className={layout.listBody}><div className={layout.slotBody}>
        <DataTable<CountryTaxSetting, string>
          columns={columns} rows={filtered} selectedIds={new Set()} isAllSelected={false} isSomeSelected={false}
          onSelectAll={() => undefined} onSelectOne={() => undefined}
          onRowClick={(country) => router.push(`/finance/country-tax-settings/${encodeURIComponent(country.code)}`)}
          currentPage={1} totalPages={1} onPageChange={() => undefined}
          totalCount={countries.length} filteredCount={filtered.length} itemLabel="countries"
          hasData={countries.length > 0} emptyIcon="public" emptyTitle="No active countries found" emptyText="No active countries have Finance tax settings" />
      </div></div>
    </div>
  );
}
