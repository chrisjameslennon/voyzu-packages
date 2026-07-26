"use client";

import { CompanySettingsTitleBadges, getStatusSemanticColor } from "@voyzu-modules/core/common/client";
import { AssignGLAccount, Deactivate, Delete, PostingAccountEnabled, PostingAccountRequired } from "@voyzu-modules/core/common/inventory-item-posting-profiles/domain/operation-policy";
import { AddItemPostingProfileModal } from "../../common/inventory-item-posting-profiles/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ItemPostingProfileCreateRequestDto, ItemPostingProfileGlRefDto, ItemPostingProfileResponseDto } from "@voyzu-modules/core/types/modules/inventory-item-posting-profiles";
import type { GlAccountResponseDto } from "@voyzu-modules/core/types/modules/gl-accounts";
import { Badge, Breadcrumbs, Button, DataTable, DropdownMenu, FilterChips, FilterPanel, Input, Toast, ValidationAlert, type DataTableColumn, type DropdownMenuItem, type FilterState, type FilterTab } from "@voyzu/ui-components";
import { pattern, required, useFormValidation } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu.item-posting-profiles.toast";
const CODE_PATTERN = /^[A-Z0-9_ -]+$/;
type ItemPostingProfileRow = ItemPostingProfileResponseDto & { id: number };

const columns: DataTableColumn<ItemPostingProfileRow>[] = [
  { key: "profile_code", label: "Code", width: "14rem", render: (row) => <span className={listStyles.codeCell}>{row.profile_code}</span> },
  { key: "profile_name", label: "Profile Name", width: "18rem", render: (row) => <span className={listStyles.nameCell}>{row.profile_name}</span> },
  {
    key: "is_sold",
    label: "Sold",
    width: "7rem",
    align: "center",
    render: (row) => row.is_sold ? <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Sold">check</span> : "-",
  },
  {
    key: "is_purchased",
    label: "Purchased",
    width: "9rem",
    align: "center",
    render: (row) => row.is_purchased ? <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Purchased">check</span> : "-",
  },
  {
    key: "is_consumed",
    label: "Consumed",
    width: "9rem",
    align: "center",
    render: (row) => row.is_consumed ? <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Consumed">check</span> : "-",
  },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>{row.status}</Badge>,
  },
];

function accountText(account: ItemPostingProfileGlRefDto | null) {
  return account ? `${account.name} ${account.code}` : "";
}

export function CompanyInventoryItemPostingProfilesListContent({
  profiles,
  glAccounts,
  basePath = "/finance/inventory/item-posting-profiles",
  apiPath = "/api/inventory/item-posting-profiles",
  showOrganizationBaseSettings = false,
  showArchived = false,
  readOnly = false,
}: {
  profiles: ItemPostingProfileResponseDto[];
  glAccounts: GlAccountResponseDto[];
  basePath?: string;
  apiPath?: string;
  showOrganizationBaseSettings?: boolean;
  showArchived?: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState(profiles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const rows = data as ItemPostingProfileRow[];
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");
  const [addProfileCode, setAddProfileCode] = useState("");
  const [addProfileName, setAddProfileName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addIsSold, setAddIsSold] = useState(false);
  const [addIsPurchased, setAddIsPurchased] = useState(false);
  const [addIsConsumed, setAddIsConsumed] = useState(false);
  const [addRevenueCode, setAddRevenueCode] = useState("");
  const [addCogsCode, setAddCogsCode] = useState("");
  const [addPurchaseExpenseCode, setAddPurchaseExpenseCode] = useState("");
  const [addConsumptionCode, setAddConsumptionCode] = useState("");
  const [addAdjustmentGainCode, setAddAdjustmentGainCode] = useState("");
  const [addAdjustmentLossCode, setAddAdjustmentLossCode] = useState("");
  const [addServerError, setAddServerError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const addValidation = useFormValidation(() => ({
    profileCode: { label: "profile code", value: addProfileCode, rules: [required(), pattern(CODE_PATTERN, "Profile code can only contain letters, numbers, spaces, underscores or hyphens")] },
    profileName: { label: "profile name", value: addProfileName, rules: [required()] },
    description: { label: "description", value: addDescription, rules: [required()] },
    revenueCode: { label: "revenue code", value: addRevenueCode, enabled: PostingAccountRequired("revenue_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed }), rules: [required(), pattern(CODE_PATTERN, "Revenue code can only contain letters, numbers, spaces, underscores or hyphens")] },
    cogsCode: { label: "COGS code", value: addCogsCode, enabled: PostingAccountRequired("cogs_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed }), rules: [required(), pattern(CODE_PATTERN, "COGS code can only contain letters, numbers, spaces, underscores or hyphens")] },
    purchaseExpenseCode: { label: "purchase expense code", value: addPurchaseExpenseCode, enabled: PostingAccountRequired("purchase_expense_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed }), rules: [required(), pattern(CODE_PATTERN, "Purchase expense code can only contain letters, numbers, spaces, underscores or hyphens")] },
    consumptionCode: { label: "consumption code", value: addConsumptionCode, enabled: PostingAccountRequired("consumption_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed }), rules: [required(), pattern(CODE_PATTERN, "Consumption code can only contain letters, numbers, spaces, underscores or hyphens")] },
    adjustmentGainCode: { label: "adjustment gain code", value: addAdjustmentGainCode, enabled: addAdjustmentGainCode.trim().length > 0, rules: [pattern(CODE_PATTERN, "Adjustment gain code can only contain letters, numbers, spaces, underscores or hyphens")] },
    adjustmentLossCode: { label: "adjustment loss code", value: addAdjustmentLossCode, enabled: addAdjustmentLossCode.trim().length > 0, rules: [pattern(CODE_PATTERN, "Adjustment loss code can only contain letters, numbers, spaces, underscores or hyphens")] },
  }));

  useEffect(() => {
    setData(profiles);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [profiles]);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOAST_KEY);
    if (!stored) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(stored);
    setToastVisible(true);
  }, []);

  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))].sort(), [rows]);
  const filterTabs = useMemo<FilterTab[]>(() => [{ key: "status", label: "Status", type: "checkbox", options: statuses }], [statuses]);

  const filtered = useMemo(() => {
    let result = rows;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((row) => (
        row.profile_code.toLowerCase().includes(query) ||
        row.profile_name.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query) ||
        accountText(row.revenue_code).toLowerCase().includes(query) ||
        accountText(row.cogs_code).toLowerCase().includes(query) ||
        accountText(row.purchase_expense_code).toLowerCase().includes(query) ||
        accountText(row.consumption_code).toLowerCase().includes(query) ||
        accountText(row.adjustment_gain_code).toLowerCase().includes(query) ||
        accountText(row.adjustment_loss_code).toLowerCase().includes(query)
      ));
    }
    const statusFilter = activeFilters.status as string[] | undefined;
    if (statusFilter?.length) result = result.filter((row) => statusFilter.includes(row.status));
    return result;
  }, [activeFilters, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isAllSelected = paginated.length > 0 && paginated.every((row) => selectedIds.has(row.id));
  const isSomeSelected = !isAllSelected && paginated.some((row) => selectedIds.has(row.id));
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const hasSelection = selectedRows.length > 0;
  const canActivateSelection = !readOnly && hasSelection && selectedRows.some((row) => row.status !== "ACTIVE");
  const canDeactivateSelection = !readOnly && hasSelection && selectedRows.some((row) => row.status !== "INACTIVE") && selectedRows.every((row) => Deactivate({ code: row.profile_code, linkedBy: row.linkedBy }).length === 0);
  const canDeleteSelection = !readOnly && hasSelection && selectedRows.every((row) => Delete({ code: row.profile_code, linkedBy: row.linkedBy }).length === 0);
  const revenueAccountOptions = useMemo(() => glAccounts
    .filter((account) => AssignGLAccount(account, "REVENUE").length === 0)
    .map((account) => ({ value: account.code, label: account.name, code: account.code })),
  [glAccounts]);
  const expenseAccountOptions = useMemo(() => glAccounts
    .filter((account) => AssignGLAccount(account, "EXPENSE").length === 0)
    .map((account) => ({ value: account.code, label: account.name, code: account.code })),
  [glAccounts]);

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    if (readOnly) return;
    setListError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: selectedRows.map((row) => row.profile_code) }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? `Unable to ${action} selected posting profiles`);
      return;
    }
    setToastMessage(`Selected posting profiles ${action === "activate" ? "activated" : "deactivated"}`);
    setToastVisible(true);
    setSelectedIds(new Set());
    router.refresh();
  };

  const deleteSelected = async () => {
    if (readOnly) return;
    setListError("");
    for (const row of selectedRows) {
      const response = await fetch(apiUrl(`/${encodeURIComponent(row.profile_code)}`), { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setListError(body?.message ?? `Unable to delete posting profile ${row.profile_code}`);
        return;
      }
    }
    setToastMessage("Selected posting profiles deleted");
    setToastVisible(true);
    setSelectedIds(new Set());
    router.refresh();
  };

  const handleExport = async (exportRows: ItemPostingProfileRow[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "profile_code", label: "Profile Code" },
          { key: "profile_name", label: "Profile Name" },
          { key: "is_sold", label: "Sold" },
          { key: "is_purchased", label: "Purchased" },
          { key: "is_consumed", label: "Consumed" },
          { key: "status", label: "Status" },
        ],
        rows: exportRows,
      }),
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    { value: "selected", label: `Selected (${selectedRows.length})`, icon: "check_box", disabled: selectedRows.length === 0, onSelect: () => { void handleExport(selectedRows, "item_posting_profiles_selected"); } },
    { value: "current-view", label: `Current view (${filtered.length})`, icon: "visibility", disabled: filtered.length === 0, onSelect: () => { void handleExport(filtered, "item_posting_profiles_current_view"); } },
    { value: "full-dataset", label: `Full dataset (${rows.length})`, icon: "database", disabled: rows.length === 0, onSelect: () => { void handleExport(rows, "item_posting_profiles_full_dataset"); } },
  ], [filtered, rows, selectedRows]);

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  const createProfile = async (value: ItemPostingProfileCreateRequestDto): Promise<string | undefined> => {
    if (readOnly) return "Item posting profiles are read only while this company uses organization standard settings";
    const response = await fetch(apiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as ItemPostingProfileResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.profile_code.localeCompare(right.profile_code)));
    return undefined;
  };

  const resetAddModal = () => {
    setAddProfileCode("");
    setAddProfileName("");
    setAddDescription("");
    setAddIsSold(false);
    setAddIsPurchased(false);
    setAddIsConsumed(false);
    setAddRevenueCode("");
    setAddCogsCode("");
    setAddPurchaseExpenseCode("");
    setAddConsumptionCode("");
    setAddAdjustmentGainCode("");
    setAddAdjustmentLossCode("");
    setAddServerError("");
    setAddSaving(false);
    addValidation.reset();
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetAddModal();
  };

  const submitAddProfile = async () => {
    if (readOnly) return;
    setAddServerError("");
    if (!addValidation.attempt()) return;
    setAddSaving(true);
    try {
      const createError = await createProfile({
        profile_code: addProfileCode.trim().toUpperCase(),
        profile_name: addProfileName.trim(),
        description: addDescription.trim(),
        is_sold: addIsSold,
        is_purchased: addIsPurchased,
        is_consumed: addIsConsumed,
        revenue_code: optionalCode(addRevenueCode),
        cogs_code: optionalCode(addCogsCode),
        purchase_expense_code: optionalCode(addPurchaseExpenseCode),
        consumption_code: optionalCode(addConsumptionCode),
        adjustment_gain_code: optionalCode(addAdjustmentGainCode),
        adjustment_loss_code: optionalCode(addAdjustmentLossCode),
      });
      if (createError) {
        setAddServerError(createError);
        return;
      }
      closeAddModal();
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>webhook</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Item Posting Profiles</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Item posting profiles define default revenue, cost, purchase expense, consumption, and adjustment posting for item workflows.</p></div>
        </div>
        <div className={layout.slotTitleMeta}>
          <CompanySettingsTitleBadges
            showOrganizationBaseSettings={showOrganizationBaseSettings}
            showArchived={showArchived}
            showReadOnly={readOnly}
          />
        </div>
        <div className={layout.slotActions}>
          <Button variant="primary" icon="add" className={layout.slotPrimaryAction} disabled={readOnly} onClick={() => setIsAddOpen(true)}>
            Add Posting Profile
          </Button>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} />
        </div>
      </header>

      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}><FilterPanel tabs={filterTabs} filters={activeFilters} onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }} onClear={() => { setActiveFilters({}); setCurrentPage(1); }} onRemoveFilter={removeFilter} showChips={false} /></div>
        <div className={layout.slotToolbarSearch}><Input search containerClassName={layout.slotSearchControl} placeholder="Search posting profiles..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} /></div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!canActivateSelection} title="Activate selected" onClick={() => { void transitionSelected("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={!canDeactivateSelection} title="Deactivate selected" onClick={() => { void transitionSelected("deactivate"); }}>Deactivate</Button>
            <Button variant="secondary-destructive" icon="delete" disabled={!canDeleteSelection} title="Delete selected" onClick={() => { void deleteSelected(); }} />
            <div className={listStyles.divider} />
            <Button variant="plain" icon="sync" className={refreshing ? listStyles.spinning : undefined} disabled={refreshing} title="Refresh" onClick={refresh} />
            <DropdownMenu trigger={<Button variant="plain" icon="file_download" title="Export" />} items={exportItems} alignment="right" width={260} />
          </div>
        </div>
      </div>

      {(hasActiveFilters || hasSearch) && (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}><FilterChips tabs={filterTabs} filters={activeFilters} additionalChips={hasSearch ? [{ key: "search", label: "Search contains", value: search.trim(), onRemove: () => { setSearch(""); setCurrentPage(1); } }] : []} onClear={() => { setActiveFilters({}); setSearch(""); setCurrentPage(1); }} onRemoveFilter={removeFilter} /></div>
        </div>
      )}

      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={() => setSelectedIds((current) => isAllSelected ? new Set([...current].filter((id) => !paginated.some((row) => row.id === id))) : new Set([...current, ...paginated.map((row) => row.id)]))}
            onSelectOne={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })}
            onRowClick={(row) => router.push(`${basePath}/${encodeURIComponent(row.profile_code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            noSelectionColumn={readOnly}
            totalCount={rows.length}
            filteredCount={filtered.length}
            itemLabel="posting profiles"
            hasData={rows.length > 0}
            emptyIcon="webhook"
            emptyTitle="No item posting profiles found"
            emptyText="No item posting profiles have been configured"
            emptyFilterText="No posting profiles match your search"
            mobileRender={(row) => <div className={listStyles.mobileCard}><div className={listStyles.mobileName}><span className={listStyles.mobileNameText}>{row.profile_name}</span></div><div className={listStyles.mobileMeta}>{row.status}</div></div>}
          />
        </div>
      </div>

      <AddItemPostingProfileModal
        revenueAccountOptions={revenueAccountOptions}
        expenseAccountOptions={expenseAccountOptions}
        isOpen={isAddOpen}
        profileCode={addProfileCode}
        profileName={addProfileName}
        description={addDescription}
        isSold={addIsSold}
        isPurchased={addIsPurchased}
        isConsumed={addIsConsumed}
        revenueCode={addRevenueCode}
        cogsCode={addCogsCode}
        purchaseExpenseCode={addPurchaseExpenseCode}
        consumptionCode={addConsumptionCode}
        adjustmentGainCode={addAdjustmentGainCode}
        adjustmentLossCode={addAdjustmentLossCode}
        errors={[...addValidation.errors, ...(addServerError ? [addServerError] : [])]}
        showErrors={addValidation.showErrors || !!addServerError}
        saving={addSaving}
        revenueCodeDisabled={!PostingAccountEnabled("revenue_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        cogsCodeDisabled={!PostingAccountEnabled("cogs_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        purchaseExpenseCodeDisabled={!PostingAccountEnabled("purchase_expense_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        consumptionCodeDisabled={!PostingAccountEnabled("consumption_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        revenueCodeRequired={PostingAccountRequired("revenue_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        cogsCodeRequired={PostingAccountRequired("cogs_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        purchaseExpenseCodeRequired={PostingAccountRequired("purchase_expense_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        consumptionCodeRequired={PostingAccountRequired("consumption_code", { is_sold: addIsSold, is_purchased: addIsPurchased, is_consumed: addIsConsumed })}
        fieldErrors={{
          profileCode: addValidation.hasError("profileCode"),
          profileName: addValidation.hasError("profileName"),
          description: addValidation.hasError("description"),
          revenueCode: addValidation.hasError("revenueCode"),
          cogsCode: addValidation.hasError("cogsCode"),
          purchaseExpenseCode: addValidation.hasError("purchaseExpenseCode"),
          consumptionCode: addValidation.hasError("consumptionCode"),
          adjustmentGainCode: addValidation.hasError("adjustmentGainCode"),
          adjustmentLossCode: addValidation.hasError("adjustmentLossCode"),
        }}
        onClose={closeAddModal}
        onDismissErrors={() => {
          addValidation.dismiss();
          setAddServerError("");
        }}
        onProfileCodeChange={(value) => setAddProfileCode(value.toUpperCase())}
        onProfileNameChange={setAddProfileName}
        onDescriptionChange={setAddDescription}
        onIsSoldChange={(checked) => { setAddIsSold(checked); if (!checked) { setAddRevenueCode(""); setAddCogsCode(""); } }}
        onIsPurchasedChange={(checked) => { setAddIsPurchased(checked); if (!checked) setAddPurchaseExpenseCode(""); }}
        onIsConsumedChange={(checked) => { setAddIsConsumed(checked); if (!checked) setAddConsumptionCode(""); }}
        onRevenueCodeChange={setAddRevenueCode}
        onCogsCodeChange={setAddCogsCode}
        onPurchaseExpenseCodeChange={setAddPurchaseExpenseCode}
        onConsumptionCodeChange={setAddConsumptionCode}
        onAdjustmentGainCodeChange={setAddAdjustmentGainCode}
        onAdjustmentLossCodeChange={setAddAdjustmentLossCode}
        onSubmit={() => { void submitAddProfile(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}

function optionalCode(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.toUpperCase() : null;
}
