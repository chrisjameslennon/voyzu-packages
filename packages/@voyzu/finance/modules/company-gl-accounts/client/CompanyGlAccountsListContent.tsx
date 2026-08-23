"use client";

import { CompanySettingsTitleBadges, financeApiUrl } from "@voyzu/finance/common/client";
import { getGlAccountTypeColor, getStatusSemanticColor } from "@voyzu/finance/common/client";
import { Deactivate, Delete } from "@voyzu/finance/common/gl-accounts/domain/operation-policy";
import { AddGlAccountModal, GL_ACCOUNT_CODE_PATTERN, GL_ACCOUNT_TYPE_OPTIONS } from "../../common/gl-accounts/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { GlAccountCategoryResponseDto } from "@voyzu/finance/types/modules/gl-account-categories";
import type { GlAccountCreateRequestDto, GlAccountResponseDto } from "@voyzu/finance/types/modules/gl-accounts";
import {
  Badge,
  Breadcrumbs,
  Button,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  ValidationAlert,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import { pattern, required, useFormValidation } from "@voyzu/ui-components";
import { Toast } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu:company-gl-accounts:toast";

interface CompanyGlAccountsListContentProps {
  accounts: GlAccountResponseDto[];
  categories: GlAccountCategoryResponseDto[];
  readOnly?: boolean;
  usesFinanceTemplateSettings?: boolean;
  isArchived?: boolean;
}

const columns: DataTableColumn<GlAccountResponseDto>[] = [
  { key: "code", label: "Code", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  { key: "name", label: "Name", width: "20rem", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
  {
    key: "accountType",
    label: "Account Type",
    width: "10rem",
    render: (row) => <Badge variant="soft" size="x-small" customColors={getGlAccountTypeColor(row.accountType)}>{row.accountType}</Badge>,
  },
  {
    key: "category",
    label: "Reporting Category",
    width: "24rem",
    render: (row) => row.category ? row.category.name : "-",
  },
  {
    key: "linked",
    label: "Linked",
    width: "7rem",
    align: "center",
    render: (row) => row.linkedBy.length > 0 ? (
      <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Linked">check</span>
    ) : "-",
  },
  {
    key: "hasPostings",
    label: "Has Postings",
    width: "7rem",
    align: "center",
    render: (row) => row.hasPostings ? (
      <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Has postings">check</span>
    ) : "-",
  },
  {
    key: "status",
    label: "Status",
    width: "8rem",
    align: "center",
    render: (row) => (
      <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>
        {row.status}
      </Badge>
    ),
  },
];

export function CompanyGlAccountsListContent({
  accounts,
  categories,
  readOnly = false,
  usesFinanceTemplateSettings = false,
  isArchived = false,
}: CompanyGlAccountsListContentProps) {
  const router = useRouter();
  const [data, setData] = useState(accounts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({ status: ["ACTIVE"] });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");
  const [addCode, setAddCode] = useState("");
  const [addName, setAddName] = useState("");
  const [addAccountType, setAddAccountType] = useState<GlAccountCreateRequestDto["accountType"]>("ASSET");
  const [addAccountCategoryId, setAddAccountCategoryId] = useState("");
  const [addServerError, setAddServerError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const addValidation = useFormValidation(() => ({
    code: { label: "code", value: addCode, rules: [required(), pattern(GL_ACCOUNT_CODE_PATTERN, "Code can only contain uppercase letters, numbers, underscores or hyphens")] },
    name: { label: "name", value: addName, rules: [required()] },
    accountCategoryId: { label: "reporting category", value: addAccountCategoryId, rules: [required()] },
  }));

  useEffect(() => {
    const message = sessionStorage.getItem(TOAST_KEY);
    if (!message) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    setData(accounts);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [accounts]);

  const uniqueTypes = useMemo(() => [...new Set(data.map((account) => account.accountType))].sort(), [data]);
  const uniqueStatuses = useMemo(() => [...new Set(data.map((account) => account.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "accountType", label: "Account Type", type: "checkbox", options: uniqueTypes },
    { key: "status", label: "Status", type: "checkbox", options: uniqueStatuses },
  ], [uniqueStatuses, uniqueTypes]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((account) => (
        account.code.toLowerCase().includes(query) ||
        account.name.toLowerCase().includes(query) ||
        account.accountType.toLowerCase().includes(query) ||
        (account.category?.name ?? "").toLowerCase().includes(query) ||
        account.status.toLowerCase().includes(query)
      ));
    }

    const types = activeFilters.accountType as string[] | undefined;
    if (types?.length) result = result.filter((account) => types.includes(account.accountType));
    const statuses = activeFilters.status as string[] | undefined;
    if (statuses?.length) result = result.filter((account) => statuses.includes(account.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedAccounts = useMemo(() => data.filter((account) => selectedIds.has(account.id)), [data, selectedIds]);
  const addCategoryOptions = useMemo(() => categories
    .filter((category) => category.status === "ACTIVE" && category.accountType === addAccountType)
    .map((category) => ({ value: String(category.id), label: category.name, code: category.code })),
  [addAccountType, categories]);
  const hasSelection = selectedAccounts.length > 0;
  const canActivateSelection = !readOnly && hasSelection && selectedAccounts.some((account) => account.status === "INACTIVE");
  const canDeactivateSelection = !readOnly && hasSelection && selectedAccounts.some((account) => account.status === "ACTIVE") && selectedAccounts.every((account) => Deactivate(account).length === 0);
  const canDeleteSelection = !readOnly && hasSelection && selectedAccounts.every((account) => Delete(account).length === 0);
  const isAllSelected = paginated.length > 0 && paginated.every((account) => selectedIds.has(account.id));
  const isSomeSelected = !isAllSelected && paginated.some((account) => selectedIds.has(account.id));

  useEffect(() => {
    if (!addAccountCategoryId) return;
    if (!addCategoryOptions.some((option) => option.value === addAccountCategoryId)) {
      setAddAccountCategoryId("");
    }
  }, [addAccountCategoryId, addCategoryOptions]);

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch(await financeApiUrl("/gl-accounts"), { cache: "no-store" });
      if (response.ok) {
        setData(await response.json() as GlAccountResponseDto[]);
        setSelectedIds(new Set());
      }
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const pageIds = new Set(paginated.map((account) => account.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      if (paginated.every((account) => current.has(account.id))) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleExport = async (rows: GlAccountResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "accountType", label: "Account Type" },
          { key: "status", label: "Status" },
        ],
        rows,
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

  const createAccount = async (value: GlAccountCreateRequestDto): Promise<string | undefined> => {
    if (readOnly) return "General ledger accounts are read only while this company uses finance template settings";
    const response = await fetch(await financeApiUrl("/gl-accounts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as GlAccountResponseDto;
    setData((current) => [...current, created].sort((left, right) => left.code.localeCompare(right.code)));
    setIsAddOpen(false);
    setToastMessage(`General ledger account ${created.code} created`);
    setToastVisible(true);
    return undefined;
  };

  const resetAddModal = () => {
    setAddCode("");
    setAddName("");
    setAddAccountType("ASSET");
    setAddAccountCategoryId("");
    setAddServerError("");
    setAddSaving(false);
    addValidation.reset();
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetAddModal();
  };

  const submitAddAccount = async () => {
    if (readOnly) return;
    setAddServerError("");
    if (!addValidation.attempt()) return;
    setAddSaving(true);
    try {
      const createError = await createAccount({
        code: addCode.trim().toUpperCase(),
        name: addName.trim(),
        accountType: addAccountType,
        accountCategoryId: Number(addAccountCategoryId),
      });
      if (createError) {
        setAddServerError(createError);
        return;
      }
      resetAddModal();
    } finally {
      setAddSaving(false);
    }
  };

  const transitionSelected = async (action: "activate" | "deactivate") => {
    if (readOnly) return;
    setListError("");
    const codes = selectedAccounts.map((account) => account.code);
    const response = await fetch(await financeApiUrl(`/gl-accounts/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? "An unexpected error occurred");
      return;
    }
    const updated = await response.json() as GlAccountResponseDto[];
    const byCode = new Map(updated.map((account) => [account.code, account]));
    setData((current) => current.map((account) => byCode.get(account.code) ?? account));
    setSelectedIds(new Set());
    setToastMessage(`${action === "activate" ? "Activated" : "Deactivated"} ${updated.length} general ledger account${updated.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const deleteSelected = async () => {
    setIsDeleteOpen(false);
    if (readOnly) return;
    setListError("");
    const codes = selectedAccounts.map((account) => account.code);
    const response = await fetch(await financeApiUrl("/gl-accounts/batch"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? "An unexpected error occurred");
      return;
    }
    setData((current) => current.filter((account) => !selectedIds.has(account.id)));
    setSelectedIds(new Set());
    setToastMessage(`Deleted ${codes.length} general ledger account${codes.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    {
      value: "selected",
      label: `Selected (${selectedIds.size})`,
      icon: "check_box",
      disabled: selectedAccounts.length === 0,
      onSelect: () => { void handleExport(selectedAccounts, "general_ledger_accounts_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "general_ledger_accounts_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${data.length})`,
      icon: "database",
      disabled: data.length === 0,
      onSelect: () => { void handleExport(data, "general_ledger_accounts_full_dataset"); },
    },
  ], [data, filtered, selectedAccounts, selectedIds.size]);

  const removeFilter = (key: string) => {
    setActiveFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some((value) => Array.isArray(value) && value.length > 0);
  const hasSearch = search.trim().length > 0;

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
            General Ledger Accounts
          </h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges showFinanceTemplateSettings={usesFinanceTemplateSettings} showArchived={isArchived} showReadOnly={readOnly} />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              General ledger accounts define the accounting structure used by this company.
            </p>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <Button variant="primary" icon="add" className={layoutStyles.slotPrimaryAction} disabled={readOnly} onClick={() => setIsAddOpen(true)}>
            Add General Ledger Account
          </Button>
        </div>
      </header>

      <div className={layoutStyles.slotAlert}>
        <ValidationAlert errors={listError ? [listError] : []} visible={!!listError} onDismiss={() => setListError("")} />
      </div>

      <div className={layoutStyles.listToolbar}>
        <div className={layoutStyles.slotToolbarLeft}>
          <FilterPanel
            tabs={filterTabs}
            filters={activeFilters}
            onApply={(filters) => {
              setActiveFilters(filters);
              setCurrentPage(1);
            }}
            onClear={() => {
              setActiveFilters({});
              setCurrentPage(1);
            }}
            onRemoveFilter={removeFilter}
            showChips={false}
          />
        </div>
        <div className={layoutStyles.slotToolbarSearch}>
          <Input
            search
            containerClassName={layoutStyles.slotSearchControl}
            placeholder="Search general ledger accounts..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={layoutStyles.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            <Button variant="secondary" icon="check_circle" disabled={!canActivateSelection} onClick={() => { void transitionSelected("activate"); }}>
              Activate
            </Button>
            <Button variant="secondary" icon="block" disabled={!canDeactivateSelection} onClick={() => { void transitionSelected("deactivate"); }}>
              Deactivate
            </Button>
            <Button variant="danger" icon="delete" disabled={!canDeleteSelection} onClick={() => setIsDeleteOpen(true)} />
            <Button
              variant="plain"
              icon="sync"
              className={refreshing ? listStyles.spinning : undefined}
              disabled={refreshing}
              title="Refresh"
              onClick={() => { void refresh(); }}
            />
            <DropdownMenu
              trigger={<Button variant="plain" icon="file_download" title="Export" />}
              items={exportItems}
              alignment="right"
              width={260}
            />
          </div>
        </div>
      </div>

      {(hasActiveFilters || hasSearch) && (
        <div className={layoutStyles.chipsRow}>
          <div className={layoutStyles.slotChips}>
            <FilterChips
              tabs={filterTabs}
              filters={activeFilters}
              additionalChips={hasSearch
                ? [{
                    key: "search",
                    label: "Search contains",
                    value: search.trim(),
                    onRemove: () => {
                      setSearch("");
                      setCurrentPage(1);
                    },
                  }]
                : []}
              onClear={() => {
                setActiveFilters({});
                setSearch("");
                setCurrentPage(1);
              }}
              onRemoveFilter={removeFilter}
            />
          </div>
        </div>
      )}

      <div className={layoutStyles.listBody}>
        <div className={layoutStyles.slotBody}>
          <DataTable<GlAccountResponseDto, number>
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            noSelectionColumn={readOnly}
            onRowClick={(account) => router.push(`/finance/settings/gl-accounts/${encodeURIComponent(account.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="general ledger accounts"
            hasData={data.length > 0}
            emptyIcon="account_balance"
            emptyTitle="No general ledger accounts found"
            emptyText="No general ledger accounts have been configured"
            emptyFilterText="No general ledger accounts match your search"
            mobileRender={(account) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileCode}>{account.code}</div>
                <div className={listStyles.mobileName}>
                  <span className={listStyles.mobileNameText}>{account.name}</span>
                </div>
                <div className={listStyles.mobileMeta}>
                  {[account.accountType, account.category?.name, account.hasPostings ? "Has postings" : null, account.linkedBy.length > 0 ? "Linked" : null, account.status].filter(Boolean).join(" - ")}
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <AddGlAccountModal
        isOpen={isAddOpen}
        code={addCode}
        name={addName}
        accountType={addAccountType}
        accountCategoryId={addAccountCategoryId}
        accountTypeOptions={GL_ACCOUNT_TYPE_OPTIONS}
        categoryOptions={addCategoryOptions}
        errors={[...addValidation.errors, ...(addServerError ? [addServerError] : [])]}
        showErrors={addValidation.showErrors || !!addServerError}
        saving={addSaving}
        codeHasError={addValidation.hasError("code")}
        nameHasError={addValidation.hasError("name")}
        accountCategoryHasError={addValidation.hasError("accountCategoryId")}
        onClose={closeAddModal}
        onDismissErrors={() => {
          addValidation.dismiss();
          setAddServerError("");
        }}
        onCodeChange={(value) => setAddCode(value.toUpperCase())}
        onNameChange={setAddName}
        onAccountTypeChange={setAddAccountType}
        onAccountCategoryIdChange={setAddAccountCategoryId}
        onSubmit={() => { void submitAddAccount(); }}
      />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete General Ledger Accounts"
        message={`Are you sure you want to permanently delete ${selectedAccounts.length} general ledger account${selectedAccounts.length === 1 ? "" : "s"}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => { void deleteSelected(); }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}
