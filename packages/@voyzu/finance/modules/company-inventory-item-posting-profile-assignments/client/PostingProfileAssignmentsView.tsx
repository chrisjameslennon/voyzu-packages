"use client";
import { useMemo, useState } from "react";
import { Badge, Breadcrumbs, Button, DataTable, Input, SearchableSelect, Toast, ValidationAlert, type DataTableColumn } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { PostingAssignment, PostingAssignments } from "../types";

const columns: DataTableColumn<PostingAssignment>[] = [
  { key: "sku", label: "SKU", render: (row) => <span className={listStyles.codeCell}>{row.sku}</span> },
  { key: "name", label: "Item Name" },
  { key: "category", label: "Category", render: (row) => row.category ?? "—" },
  { key: "itemType", label: "Type" },
  { key: "unit", label: "Unit", render: (row) => row.unit ?? "—" },
  { key: "postingCode", label: "Posting Profile", render: (row) => row.postingCode ?? "—" },
  { key: "status", label: "Status", align: "center", render: (row) => <Badge variant="soft" size="x-small" color={row.status === "ACTIVE" ? "success" : "neutral"}>{row.status}</Badge> },
];

export function PostingProfileAssignmentsView({ data, apiPath }: { data: PostingAssignments; apiPath: string }) {
  const [items, setItems] = useState(data.items); const [selected, setSelected] = useState<Set<number>>(new Set()); const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false); const [profileId, setProfileId] = useState(""); const [error, setError] = useState(""); const [toast, setToast] = useState(""); const [saving, setSaving] = useState(false);
  const rows = useMemo(() => { const query = search.trim().toLowerCase(); return items.filter((item) => !query || [item.sku, item.name, item.category ?? "", item.postingCode ?? ""].some((value) => value.toLowerCase().includes(query))); }, [items, search]);
  const allSelected = rows.length > 0 && rows.every(({ id }) => selected.has(id));
  const assign = async () => {
    if (!profileId) { setError("Select an item posting profile"); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch(apiPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemIds: [...selected], postingProfileId: Number(profileId) }) });
      if (!response.ok) { const body = await response.json().catch(() => null) as { message?: string } | null; setError(body?.message ?? "The posting profile could not be assigned"); return; }
      const changed = await response.json() as PostingAssignments; setItems(changed.items); setSelected(new Set()); setModal(false); setProfileId(""); setToast("Item posting profile assigned");
    } finally { setSaving(false); }
  };
  return <div className={`${layout.listView} vz-grid-12`}>
    <header className={layout.listHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>assignment</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Posting Profile Assignments</h1><div className={layout.slotTitleByline}><p className={typography.headingByline}>Assign Finance-owned item posting profiles to Inventory items.</p></div></div><div className={layout.slotAlert}><ValidationAlert errors={error ? [error] : []} visible={!!error} onDismiss={() => setError("")} /></div></header>
    {!data.inventoryInstalled ? <div className={layout.listBody}><div className={layout.slotBody}><p className={typography.bodyText}>Inventory is not installed. Posting profile assignments are unavailable.</p></div></div> : <>
      {modal ? <div className={modalStyles.backdrop}><div className={modalStyles.modal}><div className={modalStyles.header}><h3 className={typography.contentTitle}>Assign Posting Profile</h3></div><div className={modalStyles.body}><SearchableSelect value={profileId} onChange={setProfileId} options={data.profiles.filter(({ status }) => status === "ACTIVE").map((profile) => ({ value: String(profile.id), label: profile.name, code: profile.code }))} placeholder="Select a posting profile" /></div><div className={modalStyles.footer}><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button variant="primary" disabled={saving} onClick={() => void assign()}>{saving ? "Assigning..." : "Assign"}</Button></div></div></div> : null}
      <div className={layout.listToolbar}><div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search item assignments..." /></div><div className={layout.slotToolbarRight}><div className={listStyles.toolbarActions}><Button variant="secondary" icon="assignment" disabled={!selected.size || !data.profiles.some(({ status }) => status === "ACTIVE")} onClick={() => setModal(true)}>Assign Posting Profile</Button></div></div></div>
      <div className={layout.listBody}><div className={layout.slotBody}><DataTable columns={columns} rows={rows} selectedIds={selected} isAllSelected={allSelected} isSomeSelected={!allSelected && rows.some(({ id }) => selected.has(id))} onSelectAll={() => setSelected(allSelected ? new Set() : new Set(rows.map(({ id }) => id)))} onSelectOne={(id) => setSelected((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={items.length} filteredCount={rows.length} itemLabel="items" hasData={items.length > 0} emptyIcon="assignment" emptyTitle="No inventory items" emptyText="Add Inventory items before assigning posting profiles" emptyFilterText="No item assignments match the search" /></div></div>
    </>}
    <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
