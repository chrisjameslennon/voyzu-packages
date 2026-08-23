"use client";

import { getGlAccountTypeColor, getStatusSemanticColor } from "@voyzu/finance/common/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { GlAccountCategoryResponseDto } from "@voyzu/finance/types/modules/gl-account-categories";
import {
  Badge,
  Breadcrumbs,
  Button,
  DataTable,
  DropdownMenu,
  FilterChips,
  FilterPanel,
  Input,
  type DataTableColumn,
  type DropdownMenuItem,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import { Toast } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const ITEMS_PER_PAGE = 100;
const TOAST_KEY = "voyzu:organization-gl-account-categories:toast";
const API_PATH = "/api/finance/gl-account-categories";
const BASE_PATH = "/finance/chart-of-accounts/reporting-categories";

interface OrganizationGlAccountCategoriesListContentProps {
  categories: GlAccountCategoryResponseDto[];
}

const columns: DataTableColumn<GlAccountCategoryResponseDto>[] = [
  {
    key: "code",
    label: "Code",
    width: "12rem",
    render: (row) => <span className={listStyles.codeCell}>{row.code}</span>,
  },
  {
    key: "name",
    label: "Name",
    render: (row) => <span className={listStyles.nameCell}>{row.name}</span>,
  },
  {
    key: "accountType",
    label: "Account Type",
    width: "10rem",
    render: (row) => (
      <Badge variant="soft" size="x-small" customColors={getGlAccountTypeColor(row.accountType)}>
        {row.accountType}
      </Badge>
    ),
  },
  {
    key: "sequence",
    label: "Sequence",
    width: "8rem",
    align: "right",
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

export function OrganizationGlAccountCategoriesListContent({
  categories,
}: OrganizationGlAccountCategoriesListContentProps) {
  const router = useRouter();
  const [data, setData] = useState(categories);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const message = sessionStorage.getItem(TOAST_KEY);
    if (!message) return;
    sessionStorage.removeItem(TOAST_KEY);
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    setData(categories);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [categories]);

  const uniqueTypes = useMemo(() => [...new Set(data.map((category) => category.accountType))].sort(), [data]);
  const uniqueStatuses = useMemo(() => [...new Set(data.map((category) => category.status))].sort(), [data]);
  const filterTabs = useMemo<FilterTab[]>(() => [
    { key: "accountType", label: "Account Type", type: "checkbox", options: uniqueTypes },
    { key: "status", label: "Status", type: "checkbox", options: uniqueStatuses },
  ], [uniqueStatuses, uniqueTypes]);

  const filtered = useMemo(() => {
    let result = data;
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((category) => (
        category.code.toLowerCase().includes(query) ||
        category.name.toLowerCase().includes(query) ||
        category.accountType.toLowerCase().includes(query) ||
        category.status.toLowerCase().includes(query)
      ));
    }

    const types = activeFilters.accountType as string[] | undefined;
    if (types?.length) result = result.filter((category) => types.includes(category.accountType));
    const statuses = activeFilters.status as string[] | undefined;
    if (statuses?.length) result = result.filter((category) => statuses.includes(category.status));
    return result;
  }, [activeFilters, data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedCategories = useMemo(
    () => data.filter((category) => selectedIds.has(category.id)),
    [data, selectedIds],
  );
  const isAllSelected = paginated.length > 0 && paginated.every((category) => selectedIds.has(category.id));
  const isSomeSelected = !isAllSelected && paginated.some((category) => selectedIds.has(category.id));

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch(API_PATH, { cache: "no-store" });
      if (response.ok) {
        setData(await response.json() as GlAccountCategoryResponseDto[]);
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
    const pageIds = new Set(paginated.map((category) => category.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      if (paginated.every((category) => current.has(category.id))) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleExport = async (rows: GlAccountCategoryResponseDto[], filename: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        columns: [
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "accountType", label: "Account Type" },
          { key: "sequence", label: "Sequence" },
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

  const exportItems = useMemo<DropdownMenuItem[]>(() => [
    {
      value: "selected",
      label: `Selected (${selectedIds.size})`,
      icon: "check_box",
      disabled: selectedCategories.length === 0,
      onSelect: () => { void handleExport(selectedCategories, "organization_reporting_categories_selected"); },
    },
    {
      value: "current-view",
      label: `Current view (${filtered.length})`,
      icon: "visibility",
      disabled: filtered.length === 0,
      onSelect: () => { void handleExport(filtered, "organization_reporting_categories_current_view"); },
    },
    {
      value: "full-dataset",
      label: `Full dataset (${data.length})`,
      icon: "database",
      disabled: data.length === 0,
      onSelect: () => { void handleExport(data, "organization_reporting_categories_full_dataset"); },
    },
  ], [data, filtered, selectedCategories, selectedIds.size]);

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
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>
              account_balance
            </span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
            Reporting Categories
          </h1>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Reporting Categories for new and linked companies. Reporting categories are system defined and cannot be added or deleted. Click on a reporting category to change the name.
            </p>
          </div>
        </div>
      </header>

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
            placeholder="Search reporting categories..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={layoutStyles.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
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
          <DataTable<GlAccountCategoryResponseDto, number>
            columns={columns}
            rows={paginated}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onRowClick={(category) => router.push(`${BASE_PATH}/${encodeURIComponent(category.code)}`)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={data.length}
            filteredCount={filtered.length}
            itemLabel="reporting categories"
            hasData={data.length > 0}
            emptyIcon="account_balance"
            emptyTitle="No reporting categories found"
            emptyText="No reporting categories have been configured"
            emptyFilterText="No reporting categories match your search"
            mobileRender={(category) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileCode}>{category.code}</div>
                <div className={listStyles.mobileName}>
                  <span className={listStyles.mobileNameText}>{category.name}</span>
                </div>
                <div className={listStyles.mobileMeta}>
                  {[category.accountType, category.hasPostings ? "Has postings" : null, category.status].filter(Boolean).join(" - ")}
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}
