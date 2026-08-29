"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  required,
  useFormValidation,
  type DataTableColumn,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  ConfigurationDetail,
  ConfigurationKind,
  ConfigurationPatch,
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
export function ConfigurationDetailView({
  kind,
  meta,
  record: initial,
  optionLists,
}: {
  kind: ConfigurationKind;
  meta: Meta;
  record: ConfigurationDetail;
  optionLists: ConfigurationRow[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [record, setRecord] = useState(initial);
  const [name, setName] = useState(record.name);
  const [description, setDescription] = useState(record.description);
  const [addressLine1, setAddressLine1] = useState(record.addressLine1);
  const [addressLine2, setAddressLine2] = useState(record.addressLine2);
  const [city, setCity] = useState(record.city);
  const [region, setRegion] = useState(record.region);
  const [postcode, setPostcode] = useState(record.postcode);
  const [countryCode, setCountryCode] = useState(record.countryCode ?? "");
  const [requiredField, setRequiredField] = useState(record.required);
  const [optionListId, setOptionListId] = useState(
    record.optionListId ? String(record.optionListId) : "",
  );
  const [optionValue, setOptionValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(
    new Set(),
  );
  const [optionConfirm, setOptionConfirm] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(false);
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
  }));
  const request = async (path: string, init: RequestInit) => {
    setError("");
    const response = await fetch(path, init);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(body?.message ?? "The operation could not be completed");
      return null;
    }
    return response;
  };
  const save = async () => {
    if (!validation.attempt()) return;
    const body: ConfigurationPatch = {
      name,
      description,
      addressLine1,
      addressLine2,
      city,
      region,
      postcode,
      countryCode: countryCode || null,
      required: requiredField,
      optionListId: optionListId ? Number(optionListId) : null,
    };
    const response = await request(
      `/api/inventory/configuration/${kind}/${record.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!response) return;
    setRecord((await response.json()) as ConfigurationDetail);
    setToast(`${meta.singular} saved`);
  };
  const transition = async (status: "ACTIVE" | "INACTIVE" | "DELETED") => {
    const response = await request(
      `/api/inventory/configuration/${kind}/transition`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [record.id], status }),
      },
    );
    if (!response) return;
    if (status === "DELETED") {
      router.push(meta.href);
      router.refresh();
      return;
    }
    const changed = (await response.json()) as ConfigurationDetail[];
    setRecord(changed[0]!);
    setToast(`${meta.singular} ${status.toLowerCase()}`);
  };
  const optionListTargetId =
    kind === "option-list" ? record.id : record.optionListId;
  const applyOptionListResponse = (changed: ConfigurationDetail) => {
    setRecord((current) =>
      kind === "option-list"
        ? changed
        : { ...current, options: changed.options },
    );
  };
  const saveOption = async () => {
    if (!optionValue.trim()) {
      setError("Option value is required");
      return;
    }
    if (!optionListTargetId) return;
    const selectedId =
      selectedOptions.size === 1 ? [...selectedOptions][0] : null;
    const response = await request(
      `/api/inventory/configuration/option-list/${optionListTargetId}/options${selectedId ? `/${selectedId}` : ""}`,
      {
        method: selectedId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: optionValue }),
      },
    );
    if (!response) return;
    applyOptionListResponse((await response.json()) as ConfigurationDetail);
    setOptionValue("");
    setSelectedOptions(new Set());
    setToast(selectedId ? "Option updated" : "Option added");
  };
  const transitionOptions = async (status: "ACTIVE" | "INACTIVE") => {
    if (!optionListTargetId) return;
    let changed: ConfigurationDetail | null = null;
    for (const optionId of selectedOptions) {
      const response = await request(
        `/api/inventory/configuration/option-list/${optionListTargetId}/options/${optionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!response) return;
      changed = (await response.json()) as ConfigurationDetail;
    }
    if (changed) applyOptionListResponse(changed);
    setSelectedOptions(new Set());
    setToast("Options updated");
  };
  const deleteOptions = async () => {
    if (!optionListTargetId) return;
    let changed: ConfigurationDetail | null = null;
    for (const optionId of selectedOptions) {
      const response = await request(
        `/api/inventory/configuration/option-list/${optionListTargetId}/options/${optionId}`,
        { method: "DELETE" },
      );
      if (!response) return;
      changed = (await response.json()) as ConfigurationDetail;
    }
    if (changed) applyOptionListResponse(changed);
    setSelectedOptions(new Set());
    setOptionConfirm(false);
    setToast("Options deleted");
  };
  const auditFilter = record.audit.updated.mutationId
    ? `mutationId=${encodeURIComponent(record.audit.updated.mutationId)}`
    : `entityType=${kind.replace("-", "_")}&entityId=${record.id}`;
  const optionColumns: DataTableColumn<
    ConfigurationDetail["options"][number]
  >[] = [
    {
      key: "value",
      label: "Value",
      render: (row) => <span className={listStyles.nameCell}>{row.value}</span>,
    },
    {
      key: "status",
      label: "Status",
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
    {
      key: "usedBy",
      label: "Used By",
      align: "right",
      render: (row) => `${row.usedBy} record${row.usedBy === 1 ? "" : "s"}`,
    },
  ];
  const usedColumns: DataTableColumn<ConfigurationDetail["usedBy"][number]>[] =
    [
      { key: "name", label: "Custom Field" },
      { key: "appliesTo", label: "Applies To" },
      { key: "dataType", label: "Type" },
    ];
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span
                className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}
              >
                {meta.icon}
              </span>
            </div>
            <h1
              className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
            >
              {name}
            </h1>
          </div>
        </div>
        <div className={layout.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={meta.href} />
            <div className={detailStyles.headerActionSeparator} />
            <Button
              variant="secondary"
              icon="check_circle"
              disabled={record.status === "ACTIVE"}
              onClick={() => void transition("ACTIVE")}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              icon="block"
              disabled={record.status === "INACTIVE"}
              onClick={() => void transition("INACTIVE")}
            >
              Deactivate
            </Button>
            <div className={detailStyles.headerActionSeparator} />
            <Button
              variant="danger"
              icon="delete"
              disabled={record.inUse}
              onClick={() => setConfirm(true)}
            />
          </div>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={[...validation.errors, ...(error ? [error] : [])]}
            visible={validation.showErrors || !!error}
            onDismiss={() => {
              validation.dismiss();
              setError("");
            }}
          />
        </div>
      </header>
      <aside className={layout.statusSection}>
        <div className={detailStyles.card}>
          <label className={typography.fieldLabel}>Status</label>
          <Badge
            variant="soft"
            size="x-large"
            color={record.status === "ACTIVE" ? "success" : "neutral"}
          >
            {record.status}
          </Badge>
          {record.inUse ? (
            <>
              <label className={typography.fieldLabel}>Usage</label>
              <Badge variant="soft" size="large" color="info">
                IN USE
              </Badge>
            </>
          ) : null}
        </div>
        <AuditPanel
          id={record.id}
          creationDate={record.audit.created.date}
          updatedDate={record.audit.updated.date}
          creationActorType={record.audit.created.actorType}
          creationUser={record.audit.created.user}
          updatedActorType={record.audit.updated.actorType}
          updatedUser={record.audit.updated.user}
          auditHref={detailLinkWithBackContext(
            `/settings/audit?${auditFilter}`,
            "audit",
            pathname,
          )}
          onNavigate={(href) => router.push(href)}
        />
      </aside>
      <main className={`${layout.mainSection} ${styles.stack}`}>
        <section className={detailStyles.card}>
          <div className={detailStyles.cardHeader}>
            <h2
              className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}
            >
              {meta.singular} Details
            </h2>
            <Button variant="secondary" icon="save" onClick={() => void save()}>
              Save
            </Button>
          </div>
          <div className={styles.fields}>
            {record.code ? (
              <div className={styles.field}>
                <label className={typography.fieldLabel}>Code</label>
                <Input value={record.code} disabled />
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
              <div className={`${styles.field} ${styles.wide}`}>
                <label className={typography.fieldLabel}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            ) : null}
            {kind === "warehouse" ? (
              <>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>
                    Address Line 1
                  </label>
                  <Input
                    value={addressLine1}
                    onChange={(event) => setAddressLine1(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>
                    Address Line 2
                  </label>
                  <Input
                    value={addressLine2}
                    onChange={(event) => setAddressLine2(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>City</label>
                  <Input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>
                    Region / State
                  </label>
                  <Input
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Post Code</label>
                  <Input
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Country Code</label>
                  <Input
                    value={countryCode}
                    onChange={(event) =>
                      setCountryCode(
                        event.target.value.toUpperCase().slice(0, 2),
                      )
                    }
                  />
                </div>
              </>
            ) : null}
            {kind === "custom-field" ? (
              <>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Data Type</label>
                  <Input
                    value={(record.dataType ?? "").replaceAll("_", " ")}
                    disabled
                  />
                </div>
                <div className={styles.field}>
                  <label className={typography.fieldLabel}>Applies To</label>
                  <Input value={record.appliesTo ?? ""} disabled />
                </div>
                <label className={styles.toolbar}>
                  <Checkbox
                    checked={requiredField}
                    onChange={setRequiredField}
                  />
                  Required
                </label>
                {record.dataType === "OPTION" ||
                record.dataType === "MULTIPLE_OPTIONS" ? (
                  <div className={styles.field}>
                    <label className={typography.fieldLabel}>
                      Shared Options List
                    </label>
                    <SearchableSelect
                      clearable
                      value={record.isShared ? optionListId : ""}
                      onChange={setOptionListId}
                      options={optionLists.map((list) => ({
                        value: String(list.id),
                        label: list.name,
                      }))}
                    />
                    {record.isShared && record.optionListId ? (
                      <Button
                        variant="secondary"
                        icon="open_in_new"
                        onClick={() =>
                          router.push(
                            `/inventory/custom-field-option-lists/${record.optionListId}`,
                          )
                        }
                      >
                        View Options List
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
        {kind === "option-list" ||
        (kind === "custom-field" &&
          (record.dataType === "OPTION" ||
            record.dataType === "MULTIPLE_OPTIONS") &&
          !record.isShared) ? (
          <>
            <section className={detailStyles.card}>
              <div className={detailStyles.cardHeader}>
                <h2
                  className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}
                >
                  Options
                </h2>
                <div className={styles.toolbar}>
                  <Input
                    value={optionValue}
                    onChange={(event) => setOptionValue(event.target.value)}
                    placeholder="New option value"
                  />
                  <Button
                    variant="secondary"
                    icon={selectedOptions.size === 1 ? "edit" : "add"}
                    onClick={() => void saveOption()}
                  >
                    {selectedOptions.size === 1 ? "Save Option" : "Add Option"}
                  </Button>
                  <Button
                    variant="secondary"
                    icon="check_circle"
                    disabled={!selectedOptions.size}
                    onClick={() => void transitionOptions("ACTIVE")}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="secondary"
                    icon="block"
                    disabled={!selectedOptions.size}
                    onClick={() => void transitionOptions("INACTIVE")}
                  >
                    Deactivate
                  </Button>
                  <Button
                    variant="secondary-destructive"
                    icon="delete"
                    disabled={!selectedOptions.size}
                    onClick={() => setOptionConfirm(true)}
                  />
                </div>
              </div>
              <DataTable
                columns={optionColumns}
                rows={record.options}
                selectedIds={selectedOptions}
                isAllSelected={
                  record.options.length > 0 &&
                  record.options.every((option) =>
                    selectedOptions.has(option.id),
                  )
                }
                isSomeSelected={record.options.some((option) =>
                  selectedOptions.has(option.id),
                )}
                onSelectAll={() =>
                  setSelectedOptions(
                    record.options.every((option) =>
                      selectedOptions.has(option.id),
                    )
                      ? new Set()
                      : new Set(record.options.map((option) => option.id)),
                  )
                }
                onSelectOne={(id) =>
                  setSelectedOptions((current) => {
                    const next = new Set(current);
                    next.has(id) ? next.delete(id) : next.add(id);
                    return next;
                  })
                }
                onRowClick={(option) => {
                  setSelectedOptions(new Set([option.id]));
                  setOptionValue(option.value);
                }}
                currentPage={1}
                totalPages={1}
                onPageChange={() => undefined}
                totalCount={record.options.length}
                filteredCount={record.options.length}
                itemLabel="options"
                hasData={record.options.length > 0}
                emptyIcon="list_alt"
                emptyTitle="No options"
                emptyText="Add the first option"
              />
            </section>
            {kind === "option-list" ? (
              <section className={detailStyles.card}>
                <h2 className={typography.sectionHeading}>Used By</h2>
                <DataTable
                  columns={usedColumns}
                  rows={record.usedBy}
                  selectedIds={new Set<number>()}
                  isAllSelected={false}
                  isSomeSelected={false}
                  onSelectAll={() => undefined}
                  onSelectOne={() => undefined}
                  onRowClick={() => undefined}
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => undefined}
                  totalCount={record.usedBy.length}
                  filteredCount={record.usedBy.length}
                  itemLabel="custom fields"
                  hasData={record.usedBy.length > 0}
                  emptyIcon="dynamic_form"
                  emptyTitle="Not used"
                  emptyText="No custom fields use this list"
                />
              </section>
            ) : null}
          </>
        ) : null}
      </main>
      <ConfirmDialog
        isOpen={optionConfirm}
        title="Delete Options"
        message="Delete the selected options? Values already saved against records will be permanently deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setOptionConfirm(false)}
        onConfirm={() => void deleteOptions()}
      />
      <ConfirmDialog
        isOpen={confirm}
        title={`Delete ${meta.singular}`}
        message={`Permanently delete ${record.name}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setConfirm(false)}
        onConfirm={() => void transition("DELETED")}
      />
      <Toast isVisible={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
