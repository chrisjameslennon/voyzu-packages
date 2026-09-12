"use client";

import type { FinanceInventoryProcessingRule } from "../types/index";
import { Breadcrumbs, Button, DataTable, DropdownMenu, Input, type DataTableColumn, type DropdownMenuItem } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const label = (value: string) => value.replaceAll("_", " ");
const columns: DataTableColumn<FinanceInventoryProcessingRule>[] = [
  { key: "inventoryDocumentType", label: "Inventory Document Type", header: <>Inventory Document<br />Type</>, width: "14%", render: (row) => label(row.inventoryDocumentType) },
  { key: "reasonCode", label: "Reason Code", width: "15%", render: (row) => label(row.reasonCode) },
  { key: "direction", label: "Direction", width: "10%", render: (row) => label(row.direction) },
  { key: "action", label: "Action", width: "27%", render: (row) => label(row.action) },
  { key: "offsetGlAccount", label: "Offset GL Account", width: "34%", render: (row) => row.offsetGlAccount ? <><span className={listStyles.codeCell}>{row.offsetGlAccount.code}</span> {row.offsetGlAccount.name}</> : "-" },
];

export function InventoryProcessingRulesList({ rules }: { rules: FinanceInventoryProcessingRule[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? rules.filter((rule) => [rule.inventoryDocumentType, rule.reasonCode, rule.direction, rule.action, rule.offsetGlAccount?.code ?? "", rule.offsetGlAccount?.name ?? ""].some((value) => value.toLowerCase().includes(query))) : rules;
  }, [rules, search]);
  const allSelected = visible.length > 0 && visible.every((rule) => selectedIds.has(rule.id));
  const selectedRules = rules.filter((rule) => selectedIds.has(rule.id));
  const exportRows = async (items: FinanceInventoryProcessingRule[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "inventoryDocumentType", label: "Inventory Document Type" },
          { key: "reasonCode", label: "Reason Code" },
          { key: "direction", label: "Direction" },
          { key: "action", label: "Action" },
          { key: "offsetGlAccount", label: "Offset GL Account" },
        ],
        rows: items.map((rule) => ({
          inventoryDocumentType: rule.inventoryDocumentType,
          reasonCode: rule.reasonCode,
          direction: rule.direction,
          action: rule.action,
          offsetGlAccount: rule.offsetGlAccount ? `${rule.offsetGlAccount.code} ${rule.offsetGlAccount.name}` : "",
        })),
      }),
    });
    if (!response.ok) return;
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportItems: DropdownMenuItem[] = [
    { value: "selected", label: `Selected (${selectedRules.length})`, icon: "check_box", disabled: selectedRules.length === 0, onSelect: () => { void exportRows(selectedRules, "finance_inventory_processing_rules_selected"); } },
    { value: "current", label: `Current view (${visible.length})`, icon: "visibility", disabled: visible.length === 0, onSelect: () => { void exportRows(visible, "finance_inventory_processing_rules_current_view"); } },
    { value: "all", label: `Full dataset (${rules.length})`, icon: "database", disabled: rules.length === 0, onSelect: () => { void exportRows(rules, "finance_inventory_processing_rules"); } },
  ];
  return <div className={layout.listView}>
    <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>rule</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Movement Processing Rules</h1><div className={layout.slotTitleByline}><p className={typography.headingByline}>Finance treatment for each Inventory document type and reason.</p></div></div></header>
    <div className={layout.listToolbar}>
      <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search rules..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} /></div></div>
    </div>
    <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={visible} selectedIds={selectedIds} isAllSelected={allSelected} isSomeSelected={!allSelected && visible.some((rule) => selectedIds.has(rule.id))} onSelectAll={() => setSelectedIds((current) => allSelected ? new Set([...current].filter((id) => !visible.some((rule) => rule.id === id))) : new Set([...current, ...visible.map((rule) => rule.id)]))} onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })} onRowClick={(row) => router.push(`/finance/integration/inventory-processing/rules/${row.id}`)} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={rules.length} filteredCount={visible.length} itemLabel="rules" hasData={rules.length > 0} emptyIcon="rule" emptyTitle="No inventory processing rules" emptyText="Inventory processing rules have not been configured" emptyFilterText="No rules match your search" mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileCode}>{label(row.inventoryDocumentType)} · {label(row.reasonCode)} · {label(row.direction)}</div><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{label(row.action)}</span></div><div className={listStyles.mobileMeta}>{row.offsetGlAccount ? `${row.offsetGlAccount.code} ${row.offsetGlAccount.name}` : "No offset account"}</div></div>} /></div></div>
  </div>;
}
