"use client";

import { getStatusSemanticColor } from "@voyzu-modules/all-modules/common/client";
import { Deactivate, Delete } from "@voyzu-modules/all-modules/common/bank-cash-accounts/domain/operation-policy";
import { AddBankCashAccountModal } from "@voyzu-modules/all-modules/common/bank-cash-accounts/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { BankCashAccountCreateRequestDto, BankCashAccountResponseDto } from "@voyzu-modules/types/modules/bank-cash-accounts";
import type { GlAccountResponseDto } from "@voyzu-modules/types/modules/gl-accounts";
import {
  Badge,
  Button,
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
import { Toast } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu:bank-cash-accounts:toast";

interface OrganizationBankCashAccountsListContentProps {
  accounts: BankCashAccountResponseDto[];
  glAccounts: GlAccountResponseDto[];
  basePath?: string;
  apiPath?: string;
}

const columns: DataTableColumn<BankCashAccountResponseDto>[] = [
  { key: "code", label: "Code", width: "10rem", render: (row) => <span className={listStyles.codeCell}>{row.code}</span> },
  {
    key: "type",
    label: "Type",
    width: "8rem",
    render: (row) => <Badge variant="soft" size="x-small" color="neutral">{row.type}</Badge>,
  },
  {
    key: "glAccount",
    label: "GL Account",
    render: (row) => row.glAccount ? `${row.glAccount.code} - ${row.glAccount.name}` : "-",
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
    width: "10rem",
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

export function OrganizationBankCashAccountsListContent({
  accounts,
  glAccounts,
  basePath = "/organization/bank-cash-accounts",
  apiPath = "/api/organization/bank-cash-accounts",
}: OrganizationBankCashAccountsListContentProps) {
  const router = useRouter();
  const [data, setData] = useState(accounts);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [listError, setListError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addErrors, setAddErrors] = useState<string[]>([]);
  const [addValue, setAddValue] = useState<BankCashAccountCreateRequestDto>({ code: "", type: "BANK", glAccountId: 0 });
  const glAccountOptions = useMemo(() => glAccounts
    .filter((account) => account.status === "ACTIVE" && account.accountType === "ASSET")
    .map((account) => ({ value: String(account.id), label: account.name, code: account.code })), [glAccounts]);

  const createAccount = async () => {
    const errors: string[] = [];
    if (!/^[A-Z0-9_-]{1,40}$/.test(addValue.code)) errors.push("Code must use 1 to 40 capital letters, numbers, dashes or underscores");
    if (!addValue.glAccountId) errors.push("GL account is required");
    setAddErrors(errors);
    if (errors.length) return;
    setAddSaving(true);
    try {
      const response = await fetch(apiPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addValue) });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        setAddErrors([body?.message ?? "An unexpected error occurred"]);
        return;
      }
      const created = await response.json() as BankCashAccountResponseDto;
      setData((current) => [...current, created].sort((left, right) => left.code.localeCompare(right.code)));
      setIsAddOpen(false);
      setAddValue({ code: "", type: "BANK", glAccountId: 0 });
      setToastMessage(`Bank / cash account ${created.code} created`);
      setToastVisible(true);
    } finally { setAddSaving(false); }
  };

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

  const uniqueTypes = useMemo(() => [...new Set(data.map((account) => account.type))].sort(), [data]);
  const uniqueStatuses = useMemo(() => [...new Set(data.map((account) => account.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "type", label: "Type", type: "checkbox", options: uniqueTypes },
    { key: "status", label: "Status", type: "checkbox", options: uniqueStatuses },
  ], [uniqueStatuses, uniqueTypes]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((account) => (
        account.code.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query) ||
        (account.glAccount?.code ?? "").toLowerCase().includes(query) ||
        (account.glAccount?.name ?? "").toLowerCase().includes(query) ||
        account.status.toLowerCase().includes(query)
      ));
    }

    const types = activeFilters.type as string[] | undefined;
    if (types?.length) result = result.filter((account) => types.includes(account.type));
    const statuses = activeFilters.status as string[] | undefined;
    if (statuses?.length) result = result.filter((account) => statuses.includes(account.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedAccounts = useMemo(() => data.filter((account) => selectedIds.has(account.id)), [data, selectedIds]);
  const hasSelection = selectedAccounts.length > 0;
  const canActivateSelection = hasSelection && selectedAccounts.some((account) => account.status === "INACTIVE");
  const canDeactivateSelection = hasSelection && selectedAccounts.some((account) => account.status === "ACTIVE") && selectedAccounts.every((account) => Deactivate(account).length === 0);
  const canDeleteSelection = hasSelection && selectedAccounts.every((account) => Delete(account).length === 0);
  const isAllSelected = paginated.length > 0 && paginated.every((account) => selectedIds.has(account.id));
  const isSomeSelected = !isAllSelected && paginated.some((account) => selectedIds.has(account.id));

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch(apiPath, { cache: "no-store" });
      if (response.ok) {
        setData(await response.json() as BankCashAccountResponseDto[]);
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

  const handleExport = async (rows: BankCashAccountResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "type", label: "Type" },
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

  const transitionSelected = async (action: "activate" | "deactivate") => {
    setListError("");
    const codes = selectedAccounts.map((account) => account.code);
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setListError(body?.message ?? "An unexpected error occurred");
      return;
    }
    const updated = await response.json() as BankCashAccountResponseDto[];
    const byCode = new Map(updated.map((account) => [account.code, account]));
    setData((current) => current.map((account) => byCode.get(account.code) ?? account));
    setSelectedIds(new Set());
    setToastMessage(`${action === "activate" ? "Activated" : "Deactivated"} ${updated.length} bank / cash account${updated.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const deleteSelected = async () => {
    setListError("");
    const codes = selectedAccounts.map((account) => account.code);
    for (const code of codes) {
      const response = await fetch(apiUrl(`/${encodeURIComponent(code)}`), { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setListError(body?.message ?? "An unexpected error occurred");
        return;
      }
    }
    setData((current) => current.filter((account) => !selectedIds.has(account.id)));
    setSelectedIds(new Set());
    setToastMessage(`Deleted ${codes.length} bank / cash account${codes.length === 1 ? "" : "s"}`);
    setToastVisible(true);
  };

  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    {
      value: "selected",
      label: `Selected (${selectedIds.size})`,
      icon: "check_box",
      disabled: selectedAccounts.length === 0,
      onSelect: () => { void handleExport(selectedAccounts, "bank_cash_accounts_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "bank_cash_accounts_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${data.length})`,
      icon: "database",
      disabled: data.length === 0,
      onSelect: () => { void handleExport(data, "bank_cash_accounts_full_dataset"); },
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
    <>
      <div className={layoutStyles.slotActions}>
        <Button variant="primary" icon="add" className={layoutStyles.slotPrimaryAction} onClick={() => setIsAddOpen(true)}>Add Bank / Cash Account</Button>
      </div>
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
            placeholder="Search bank / cash accounts..."
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
            <Button variant="danger" icon="delete" disabled={!canDeleteSelection} onClick={() => { void deleteSelected(); }} />
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
          <DataTable<BankCashAccountResponseDto, number>
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onRowClick={(account) => router.push(`${basePath}/${encodeURIComponent(account.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="bank / cash accounts"
            hasData={data.length > 0}
            emptyIcon="account_balance"
            emptyTitle="No bank / cash accounts found"
            emptyText="No bank / cash accounts have been configured"
            emptyFilterText="No bank / cash accounts match your search"
            mobileRender={(account) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileCode}>{account.code}</div>
                <div className={listStyles.mobileMeta}>
                  {[account.type, account.linkedBy.length > 0 ? "Linked" : null, account.hasPostings ? "Has postings" : null].filter(Boolean).join(" - ")}
                </div>
                <Badge variant="soft" size="x-small" color={getStatusSemanticColor(account.status)}>
                  {account.status}
                </Badge>
              </div>
            )}
          />
        </div>
      </div>
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
      <AddBankCashAccountModal isOpen={isAddOpen} value={addValue} glAccountOptions={glAccountOptions} errors={addErrors} showErrors={addErrors.length > 0} saving={addSaving} onChange={(value) => setAddValue({ ...value, code: value.code.toUpperCase() })} onClose={() => { setIsAddOpen(false); setAddErrors([]); }} onDismissErrors={() => setAddErrors([])} onSubmit={() => { void createAccount(); }} />
    </>
  );
}
