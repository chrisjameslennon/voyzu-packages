"use client";

import { AuditPanel } from "@voyzu/audit/client";

import { DetailBackButton } from "@voyzu/ui-surface/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getHasPostingsColor, getStatusSemanticColor } from "@voyzu/core/common/client";
import { ChangeCodeAvailability, ChangeValueNameAvailability, Deactivate, Delete, DeleteValue } from "@voyzu/core/common/dimensions/domain/operation-policy";
import type { DimensionPatchRequestDto, DimensionResponseDto, DimensionValueCreateRequestDto, DimensionValuePatchRequestDto, DimensionValueResponseDto, DimensionValueStatus } from "@voyzu/core/types/modules/dimensions";
import { Badge, Breadcrumbs, Button, DataTable, Input, maxLength, pattern, required, SearchableSelect, Toast, useFormValidation, ValidationAlert, type DataTableColumn } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { DimensionDetailsForm } from "../../common/dimensions/client";

const TOAST_KEY = "voyzu:dimensions:toast";
const DIMENSION_CODE_PATTERN = /^[A-Z0-9_-]+$/;
const DIMENSION_VALUE_NAME_PATTERN = /^[A-Za-z0-9 _-]+$/;
const STATUS_OPTIONS: { value: DimensionValueStatus; label: DimensionValueStatus }[] = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
];

interface OrganizationDimensionDetailProps {
  dimension: DimensionResponseDto;
  listPath?: string;
  auditPath?: string;
  apiPath?: string;
}

export function OrganizationDimensionDetail({
  dimension,
  listPath = "/organization/dimensions",
  auditPath = "/organization/audit",
  apiPath = "/api/organization/dimensions",
}: OrganizationDimensionDetailProps) {
  const router = useRouter();
  const [code, setCode] = useState(dimension.code);
  const [name, setName] = useState(dimension.name);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<DimensionValueResponseDto[]>(dimension.values ?? []);
  const [isAddValueOpen, setIsAddValueOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<DimensionValueResponseDto | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const validation = useFormValidation(() => ({
    code: { label: "code", value: code, rules: [required(), maxLength(14), pattern(DIMENSION_CODE_PATTERN, "Code can only contain capital letters, numbers, dashes or underscores")] },
    name: { label: "name", value: name, rules: [required()] },
  }));
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];

  const apiUrl = (suffix = "") => {
    const [path, query] = apiPath.split("?");
    return `${path}${suffix}${query ? `?${query}` : ""}`;
  };

  const sortValues = (items: DimensionValueResponseDto[]) =>
    [...items].sort((left, right) => left.name.localeCompare(right.name));

  const createValue = async (value: DimensionValueCreateRequestDto): Promise<string | undefined> => {
    setServerError("");
    const response = await fetch(apiUrl(`/${encodeURIComponent(dimension.code)}/values`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const created = await response.json() as DimensionValueResponseDto;
    setValues((current) => sortValues([...current, created]));
    setToastMessage(`Created value ${created.name}`);
    setToastVisible(true);
    return undefined;
  };

  const patchValue = async (id: number, value: DimensionValuePatchRequestDto): Promise<string | undefined> => {
    setServerError("");
    const response = await fetch(apiUrl(`/values/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      return body?.message ?? "An unexpected error occurred";
    }
    const updated = await response.json() as DimensionValueResponseDto;
    setValues((current) => sortValues(current.map((item) => item.id === updated.id ? updated : item)));
    setToastMessage(`Updated value ${updated.name}`);
    setToastVisible(true);
    return undefined;
  };

  const transitionValueStatus = async (value: DimensionValueResponseDto) => {
    const nextStatus: DimensionValueStatus = value.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const error = await patchValue(value.id, { status: nextStatus });
    if (error) setServerError(error);
  };

  const deleteValue = async (value: DimensionValueResponseDto) => {
    setServerError("");
    const response = await fetch(apiUrl(`/values/${value.id}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    setValues((current) => current.filter((item) => item.id !== value.id));
    setToastMessage(`Deleted value ${value.name}`);
    setToastVisible(true);
  };

  const valueColumns: DataTableColumn<DimensionValueResponseDto>[] = [
    { key: "name", label: "Name", render: (row) => <span className={listStyles.nameCell}>{row.name}</span> },
    {
      key: "hasPostings",
      label: "Has Postings",
      width: "9rem",
      align: "center",
      render: (row) => row.hasPostings ? (
        <span className={`material-symbols-outlined ${listStyles.successIcon}`} aria-label="Has postings">check</span>
      ) : "-",
    },
    {
      key: "status",
      label: "Status",
      width: "7rem",
      align: "center",
      render: (row) => (
        <Badge variant="soft" size="x-small" color={getStatusSemanticColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "17rem",
      align: "right",
      render: (row) => (
        <span className={listStyles.inlineGroup}>
          <Button
            variant="plain"
            icon="edit"
            size="small"
            title={ChangeValueNameAvailability(row).length ? "Values with postings cannot be renamed" : "Edit value"}
            disabled={ChangeValueNameAvailability(row).length > 0}
            onClick={() => setEditingValue(row)}
          />
          <Button
            variant="plain"
            icon={row.status === "ACTIVE" ? "block" : "check_circle"}
            size="small"
            title={row.status === "ACTIVE" ? "Deactivate value" : "Activate value"}
            onClick={() => { void transitionValueStatus(row); }}
          />
          <Button
            variant="secondary-destructive"
            icon="delete"
            size="small"
            title={DeleteValue(row).length ? "Values with postings cannot be deleted" : "Delete value"}
            disabled={DeleteValue(row).length > 0}
            onClick={() => { void deleteValue(row); }}
          />
        </span>
      ),
    },
  ];

  const save = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload: DimensionPatchRequestDto = { code: code.trim(), name: name.trim() };
      const response = await fetch(apiUrl(`/${encodeURIComponent(dimension.code)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        setServerError(body?.message ?? "An unexpected error occurred");
        return;
      }
      sessionStorage.setItem(TOAST_KEY, `Dimension ${payload.code} saved`);
      router.push(listPath);
    } finally {
      setSaving(false);
    }
  };

  const transitionStatus = async (action: "activate" | "deactivate") => {
    setServerError("");
    const response = await fetch(apiUrl(`/batch-${action}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: [dimension.code] }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `${action === "activate" ? "Activated" : "Deactivated"} dimension ${dimension.code}`);
    router.push(listPath);
  };

  const deleteDimension = async () => {
    setServerError("");
    const response = await fetch(apiUrl(`/${encodeURIComponent(dimension.code)}`), { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      setServerError(body?.message ?? "An unexpected error occurred");
      return;
    }
    sessionStorage.setItem(TOAST_KEY, `Deleted dimension ${dimension.code}`);
    router.push(listPath);
  };

  return (
    <div className={`${layoutStyles.detailView} ${layoutStyles.detailViewWithStatusRail}`}>
      <header className={layoutStyles.detailHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={detailStyles.title}>
            <div className={detailStyles.titleIcon}>
              <span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>
                category
              </span>
            </div>
            <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>
              {dimension.name}
            </h1>
          </div>
        </div>
        <div className={layoutStyles.slotActions}>
          <div className={detailStyles.headerActions}>
            <DetailBackButton fallbackHref={listPath} />
            <Button variant="secondary" icon="check_circle" disabled={dimension.status === "ACTIVE"} onClick={() => { void transitionStatus("activate"); }}>Activate</Button>
            <Button variant="secondary" icon="block" disabled={dimension.status === "INACTIVE" || Deactivate(dimension).length > 0} onClick={() => { void transitionStatus("deactivate"); }}>Deactivate</Button>
            <Button variant="danger" icon="delete" disabled={Delete(dimension).length > 0} onClick={() => { void deleteDimension(); }} />
          </div>
        </div>
        <div className={layoutStyles.slotAlert}>
          <ValidationAlert errors={currentErrors} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
        </div>
      </header>

      <aside className={layoutStyles.statusSection}>
        <div className={detailStyles.card}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Status</label>
            <Badge variant="soft" size="x-large" color={getStatusSemanticColor(dimension.status)}>
              {dimension.status}
            </Badge>
          </div>
          {dimension.hasPostings ? (
            <div className={detailStyles.fieldGroup}>
              <Badge variant="soft" size="medium" customColors={getHasPostingsColor(dimension.hasPostings)}>
                HAS POSTINGS
              </Badge>
            </div>
          ) : null}
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Companies with postings</label>
            <p className={typography.bodyText}>{dimension.companiesWithPostings.length > 0 ? dimension.companiesWithPostings.join(", ") : "None"}</p>
          </div>
        </div>
        <AuditPanel
          id={dimension.id}
          creationDate={dimension.audit.created.date}
          updatedDate={dimension.audit.updated.date}
          creationActorType={dimension.audit.created.actorType}
          creationUser={dimension.audit.created.user}
          updatedActorType={dimension.audit.updated.actorType}
          updatedUser={dimension.audit.updated.user}
          auditHref={`${auditPath}?entityType=dimension&entityCode=${encodeURIComponent(dimension.code)}`}
          mutationId={dimension.audit.updated.mutationId ?? dimension.audit.created.mutationId}
        />
      </aside>

      <main className={layoutStyles.mainSection}>
        <DimensionDetailsForm
          code={code}
          name={name}
          saving={saving}
          codeDisabled={ChangeCodeAvailability(dimension).length > 0}
          codeHasError={validation.hasError("code")}
          nameHasError={validation.hasError("name")}
          onCodeChange={(value) => setCode(value.toUpperCase())}
          onNameChange={setName}
          onSave={() => { void save(); }}
        />

        <section className={detailStyles.card}>
          <div className={detailStyles.cardHeader}>
            <h2 className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}>Values</h2>
            <Button variant="secondary" icon="add" onClick={() => setIsAddValueOpen(true)}>
              Add Value
            </Button>
          </div>
          <DataTable
            columns={valueColumns}
            rows={values}
            selectedIds={new Set<number>()}
            isAllSelected={false}
            isSomeSelected={false}
            onSelectAll={() => {}}
            onSelectOne={() => {}}
            noSelectionColumn
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            totalCount={values.length}
            filteredCount={values.length}
            itemLabel="dimension values"
            hasData={values.length > 0}
            emptyIcon="category"
            emptyTitle="No dimension values found"
            emptyText="No values have been configured"
            mobileRender={(value) => (
              <div className={listStyles.mobileCard}>
                <div className={listStyles.mobileName}>
                  <span className={listStyles.mobileNameText}>{value.name}</span>
                </div>
                <div className={listStyles.mobileMeta}>{value.status}</div>
              </div>
            )}
          />
        </section>
      </main>
      <DimensionValueModal
        isOpen={isAddValueOpen}
        title="Add Value"
        submitLabel="Create Value"
        onClose={() => setIsAddValueOpen(false)}
        onSubmit={createValue}
      />
      <DimensionValueModal
        isOpen={!!editingValue}
        title="Edit Value"
        submitLabel="Save Value"
        initialValue={editingValue ?? undefined}
        onClose={() => setEditingValue(null)}
        onSubmit={async (value) => {
          if (!editingValue) return undefined;
          return patchValue(editingValue.id, value);
        }}
      />
      <Toast isVisible={toastVisible} onClose={() => setToastVisible(false)} message={toastMessage} />
    </div>
  );
}

function DimensionValueModal({
  isOpen,
  title,
  submitLabel,
  initialValue,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  initialValue?: DimensionValueResponseDto;
  onClose: () => void;
  onSubmit: (data: DimensionValueCreateRequestDto) => Promise<string | undefined>;
}) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [status, setStatus] = useState<DimensionValueStatus>(initialValue?.status ?? "ACTIVE");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required(), maxLength(14), pattern(DIMENSION_VALUE_NAME_PATTERN, "Name can only contain letters, numbers, spaces, dashes or underscores")] },
  }));

  useEffect(() => {
    setName(initialValue?.name ?? "");
    setStatus(initialValue?.status ?? "ACTIVE");
    setServerError("");
    setSaving(false);
    validation.reset();
  }, [initialValue, isOpen, validation.reset]);

  if (!isOpen) return null;

  const submit = async () => {
    setServerError("");
    if (!validation.attempt()) return;
    setSaving(true);
    try {
      const payload = initialValue ? { name: name.trim(), status } : { name: name.trim() };
      const submitError = await onSubmit(payload);
      if (submitError) setServerError(submitError);
      else onClose();
    } finally {
      setSaving(false);
    }
  };
  const currentErrors = [...validation.errors, ...(serverError ? [serverError] : [])];

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h3 className={typography.contentTitle}>{title}</h3>
          <Button variant="plain" icon="close" title="Close" onClick={onClose} />
        </div>
        <div className={modalStyles.body}>
          <ValidationAlert errors={currentErrors} visible={validation.showErrors || !!serverError} onDismiss={() => { validation.dismiss(); setServerError(""); }} />
          <div className={initialValue ? modalStyles.fieldRow : undefined}>
            <label className={modalStyles.fieldGroup}>
              <span className={typography.fieldLabel}>Name</span>
              <Input
                invalid={validation.hasError("name")}
                maxLength={14}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <span className={typography.fieldHelp}>Letters, numbers, spaces, dashes and underscores only. 14 characters max.</span>
            </label>
            {initialValue ? (
              <label className={modalStyles.fieldGroup}>
                <span className={typography.fieldLabel}>Status</span>
                <SearchableSelect value={status} onChange={(value) => setStatus(value as DimensionValueStatus)} options={STATUS_OPTIONS} searchable={false} />
              </label>
            ) : null}
          </div>
        </div>
        <div className={modalStyles.footer}>
          <Button variant="cancel" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { void submit(); }} disabled={saving}>
            {saving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

