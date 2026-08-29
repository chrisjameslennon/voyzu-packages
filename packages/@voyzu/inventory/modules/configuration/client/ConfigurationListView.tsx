"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  FilterChips,
  FilterPanel,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  required,
  useFormValidation,
  type DataTableColumn,
  type FilterState,
  type FilterTab,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  ConfigurationCreate,
  ConfigurationDetail,
  ConfigurationKind,
  ConfigurationRow,
} from "../types/configuration.types";
import styles from "./configuration.module.css";
type Meta = {
  title: string;
  singular: string;
  description: string;
  icon: string;
  href: string;
};
export function ConfigurationListView({
  kind,
  meta,
  rows: initialRows,
  optionLists,
}: {
  kind: ConfigurationKind;
  meta: Meta;
  rows: ConfigurationRow[];
  optionLists: ConfigurationRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataType, setDataType] = useState("TEXT");
  const [appliesTo, setAppliesTo] = useState("ITEM");
  const [requiredField, setRequiredField] = useState(false);
  const [optionListId, setOptionListId] = useState("");
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
    code: {
      label: "code",
      value: code,
      enabled: kind === "category" || kind === "warehouse",
      rules: [required()],
    },
  }));
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const statuses = filters.status as string[] | undefined;
    return rows.filter(
      (row) =>
        (!statuses?.length || statuses.includes(row.status)) &&
        (!q ||
          [row.code ?? "", row.name, row.description, row.secondary].some(
            (value) => value.toLowerCase().includes(q),
          )),
    );
  }, [filters, rows, search]);
  const filterTabs: FilterTab[] = [
    {
      key: "status",
      label: "Status",
      type: "checkbox",
      options: ["ACTIVE", "INACTIVE"],
    },
  ];
  const removeFilter = (key: string) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  const columns: DataTableColumn<ConfigurationRow>[] = [
    {
      key: "code",
      label: kind === "category" || kind === "warehouse" ? "Code" : "Name",
      render: (row) => (
        <span
          className={
            kind === "category" || kind === "warehouse"
              ? listStyles.codeCell
              : listStyles.nameCell
          }
        >
          {kind === "category" || kind === "warehouse" ? row.code : row.name}
        </span>
      ),
    },
    ...(kind === "category" || kind === "warehouse"
      ? [
          {
            key: "name",
            label: kind === "category" ? "Category Name" : "Warehouse Name",
            render: (row: ConfigurationRow) => (
              <span className={listStyles.nameCell}>{row.name}</span>
            ),
          },
        ]
      : []),
    ...(kind === "category"
      ? [
          { key: "description", label: "Description" },
          { key: "count", label: "Items", align: "right" as const },
        ]
      : kind === "custom-field"
        ? [
            { key: "secondary", label: "Type / Applies To" },
            { key: "count", label: "Values", align: "right" as const },
          ]
        : kind === "option-list"
          ? [{ key: "count", label: "Options", align: "right" as const }]
          : [{ key: "secondary", label: "Location" }]),
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <Badge
          variant="soft"
          size="x-small"
          color={row.status === "ACTIVE" ? "success" : "neutral"}
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  const reset = () => {
    setCode("");
    setName("");
    setDescription("");
    setDataType("TEXT");
    setAppliesTo("ITEM");
    setRequiredField(false);
    setOptionListId("");
    setError("");
    validation.reset();
  };
  const create = async () => {
    if (!validation.attempt()) return;
    setSaving(true);
    setError("");
    try {
      const body: ConfigurationCreate = {
        code: code || undefined,
        name,
        description,
        dataType,
        appliesTo,
        required: requiredField,
        optionListId: optionListId ? Number(optionListId) : null,
        isShared: true,
      };
      const response = await fetch(`/api/inventory/configuration/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setError(result?.message ?? `${meta.singular} could not be created`);
        return;
      }
      const detail = (await response.json()) as ConfigurationDetail;
      setRows((current) =>
        [
          ...current,
          {
            id: detail.id,
            code: detail.code,
            name: detail.name,
            description: detail.description,
            secondary:
              kind === "custom-field"
                ? `${detail.dataType} · ${detail.appliesTo}`
                : "",
            count: 0,
            status: detail.status,
          },
        ].sort((a, b) => a.name.localeCompare(b.name)),
      );
      reset();
      setModal(false);
      setToast(`${meta.singular} created`);
    } finally {
      setSaving(false);
    }
  };
  const transition = async (status: "ACTIVE" | "INACTIVE" | "DELETED") => {
    const ids = [...selected];
    const response = await fetch(
      `/api/inventory/configuration/${kind}/transition`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      },
    );
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(result?.message ?? "The operation could not be completed");
      return;
    }
    setRows((current) =>
      status === "DELETED"
        ? current.filter((row) => !selected.has(row.id))
        : current.map((row) =>
            selected.has(row.id) ? { ...row, status } : row,
          ),
    );
    setSelected(new Set());
    setConfirm(false);
    setToast(`${ids.length} record${ids.length === 1 ? "" : "s"} updated`);
  };
  const selectedRows = rows.filter((row) => selected.has(row.id));
  const all =
    visible.length > 0 && visible.every((row) => selected.has(row.id));
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span
              className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}
            >
              {meta.icon}
            </span>
          </div>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            {meta.title}
          </h1>
          <div className={layout.slotTitleByline}>
            <p className={typography.headingByline}>{meta.description}</p>
          </div>
        </div>
        <div className={layout.slotActions}>
          <Button
            variant="primary"
            icon="add"
            className={layout.slotPrimaryAction}
            onClick={() => setModal(true)}
          >
            Add {meta.singular}
          </Button>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={error ? [error] : []}
            visible={!!error}
            onDismiss={() => setError("")}
          />
        </div>
      </header>
      {modal ? (
        <div className={modalStyles.backdrop}>
          <div className={modalStyles.modal}>
            <div className={modalStyles.header}>
              <h3 className={typography.contentTitle}>Add {meta.singular}</h3>
              <Button
                variant="plain"
                icon="close"
                onClick={() => {
                  reset();
                  setModal(false);
                }}
              />
            </div>
            <div className={modalStyles.body}>
              <ValidationAlert
                errors={[...validation.errors, ...(error ? [error] : [])]}
                visible={validation.showErrors || !!error}
                onDismiss={() => {
                  validation.dismiss();
                  setError("");
                }}
              />
              <div className={styles.stack}>
                {kind === "category" || kind === "warehouse" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Code</label>
                    <Input
                      value={code}
                      onChange={(event) =>
                        setCode(event.target.value.toUpperCase())
                      }
                    />
                  </div>
                ) : null}
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Name</label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                {kind === "category" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>Description</label>
                    <textarea
                      className={styles.textarea}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                ) : null}
                {kind === "custom-field" ? (
                  <>
                    <div className={styles.field}>
                      <label className={typography.fieldLabel}>Data Type</label>
                      <SearchableSelect
                        searchable={false}
                        value={dataType}
                        onChange={setDataType}
                        options={[
                          "TEXT",
                          "NUMBER",
                          "DATE",
                          "BOOLEAN",
                          "OPTION",
                          "MULTIPLE_OPTIONS",
                        ].map((value) => ({
                          value,
                          label: value.replaceAll("_", " "),
                        }))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={typography.fieldLabel}>
                        Applies To
                      </label>
                      <SearchableSelect
                        searchable={false}
                        value={appliesTo}
                        onChange={setAppliesTo}
                        options={["ITEM", "RECEIPT", "ISSUE"].map((value) => ({
                          value,
                          label: value,
                        }))}
                      />
                    </div>
                    <label className={styles.toolbar}>
                      <Checkbox
                        checked={requiredField}
                        onChange={setRequiredField}
                      />
                      Required
                    </label>
                    {dataType === "OPTION" ||
                    dataType === "MULTIPLE_OPTIONS" ? (
                      <div className={styles.field}>
                        <label className={typography.fieldLabel}>
                          Shared Options List
                        </label>
                        <SearchableSelect
                          value={optionListId}
                          onChange={setOptionListId}
                          clearable
                          options={optionLists.map((list) => ({
                            value: String(list.id),
                            label: list.name,
                          }))}
                        />
                        <p className={styles.hint}>
                          Leave blank to create custom options after creation,
                          or select a shared list.
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
            <div className={modalStyles.footer}>
              <Button
                variant="secondary"
                onClick={() => {
                  reset();
                  setModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={saving}
                onClick={() => void create()}
              >
                {saving ? "Creating..." : `Create ${meta.singular}`}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <div className={layout.listToolbar}>
        <div className={layout.slotToolbarLeft}>
          <FilterPanel
            tabs={filterTabs}
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters({})}
            onRemoveFilter={removeFilter}
            showChips={false}
          />
        </div>
        <div className={layout.slotToolbarSearch}>
          <Input
            search
            containerClassName={layout.slotSearchControl}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${meta.title.toLowerCase()}...`}
          />
        </div>
        <div className={layout.slotToolbarRight}>
          <div className={listStyles.toolbarActions}>
            {kind === "warehouse" ? (
              <Button
                variant="secondary"
                icon="inventory"
                disabled={selected.size !== 1}
                onClick={() =>
                  router.push(
                    `/inventory/stock?warehouseId=${[...selected][0]}`,
                  )
                }
              >
                View stock
              </Button>
            ) : null}
            <Button
              variant="secondary"
              icon="check_circle"
              disabled={!selectedRows.some((row) => row.status === "INACTIVE")}
              onClick={() => void transition("ACTIVE")}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              icon="block"
              disabled={!selectedRows.some((row) => row.status === "ACTIVE")}
              onClick={() => void transition("INACTIVE")}
            >
              Deactivate
            </Button>
            <Button
              variant="secondary-destructive"
              icon="delete"
              disabled={!selected.size}
              onClick={() => setConfirm(true)}
            />
          </div>
        </div>
      </div>
      {search.trim() || Object.keys(filters).length ? (
        <div className={layout.chipsRow}>
          <div className={layout.slotChips}>
            <FilterChips
              tabs={filterTabs}
              filters={filters}
              additionalChips={
                search.trim()
                  ? [
                      {
                        key: "search",
                        label: "Search contains",
                        value: search.trim(),
                        onRemove: () => setSearch(""),
                      },
                    ]
                  : []
              }
              onClear={() => {
                setFilters({});
                setSearch("");
              }}
              onRemoveFilter={removeFilter}
            />
          </div>
        </div>
      ) : null}
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <DataTable
            columns={columns}
            rows={visible}
            selectedIds={selected}
            isAllSelected={all}
            isSomeSelected={!all && visible.some((row) => selected.has(row.id))}
            onSelectAll={() =>
              setSelected(
                all ? new Set() : new Set(visible.map((row) => row.id)),
              )
            }
            onSelectOne={(id) =>
              setSelected((current) => {
                const next = new Set(current);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
            onRowClick={(row) => router.push(`${meta.href}/${row.id}`)}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            totalCount={rows.length}
            filteredCount={visible.length}
            itemLabel={meta.title.toLowerCase()}
            hasData={rows.length > 0}
            emptyIcon={meta.icon}
            emptyTitle={`No ${meta.title.toLowerCase()}`}
            emptyText={`Add the first ${meta.singular.toLowerCase()}`}
            emptyFilterText={`No ${meta.title.toLowerCase()} match the current filters`}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirm}
        title={`Delete ${meta.title}`}
        message="Permanently delete the selected records? In-use records cannot be deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setConfirm(false)}
        onConfirm={() => void transition("DELETED")}
      />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
