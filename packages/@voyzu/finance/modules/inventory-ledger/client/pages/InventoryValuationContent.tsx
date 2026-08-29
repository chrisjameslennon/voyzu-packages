"use client";
import { useMemo, useState } from "react";
import type { InventoryValuationResponseDto } from "@voyzu/finance/types/modules/inventory-ledger";
import { Breadcrumbs, DataTable, Input, type DataTableColumn } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const quantity = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 4 });
const money = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const columns: DataTableColumn<InventoryValuationResponseDto>[] = [
  { key: "itemCode", label: "Item", render: (row) => <span className={listStyles.codeCell}>{row.itemCode}</span> },
  { key: "itemName", label: "Item Name" },
  { key: "quantityOnHand", label: "Quantity On Hand", align: "right", render: (row) => quantity.format(row.quantityOnHand) },
  { key: "averageUnitCost", label: "Avg. Unit Cost", align: "right", render: (row) => money.format(row.averageUnitCost) },
  { key: "bookValue", label: "Book Value", align: "right", render: (row) => money.format(row.bookValue) },
  { key: "baseCurrencyCode", label: "Currency" },
  { key: "asAtDate", label: "As At" },
];

export function InventoryValuationContent({ valuations }: { valuations: InventoryValuationResponseDto[] }) {
  const [search, setSearch] = useState("");
  const rows = useMemo(() => { const query = search.trim().toLowerCase(); return valuations.filter((row) => !query || row.itemCode.toLowerCase().includes(query) || row.itemName.toLowerCase().includes(query)); }, [search, valuations]);
  return <div className={`${layout.listView} vz-grid-12`}>
    <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>inventory_2</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Stock Valuation</h1><div className={layout.slotTitleByline}><p className={typography.headingByline}>Current organization-wide rolling valuation by inventory item.</p></div></div></header>
    <div className={layout.listToolbar}><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stock valuation..." /></div></div>
    <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={rows} selectedIds={new Set<number>()} isAllSelected={false} isSomeSelected={false} onSelectAll={() => undefined} onSelectOne={() => undefined} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={valuations.length} filteredCount={rows.length} itemLabel="valuations" hasData={valuations.length > 0} emptyIcon="inventory_2" emptyTitle="No stock valuation" emptyText="Posted inventory financial documents will create valuation balances" emptyFilterText="No valuation rows match the search" /></div></div>
  </div>;
}
