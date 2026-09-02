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
  DropdownMenu,
  Input,
  SearchableSelect,
  Toast,
  ValidationAlert,
  required,
  useFormValidation,
  type DataTableColumn,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import modalStyles from "@voyzu/ui-style/css-modules/modal.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  ConfigurationDetail,
  ConfigurationKind,
  ConfigurationPatch,
  ConfigurationRow,
} from "../types/configuration.types";
import styles from "./configuration.module.css";
import { Deactivate } from "../domain/operation-policy";
type Meta = {
  title: string;
  singular: string;
  description: string;
  icon: string;
  href: string;
};
type OptionRow = ConfigurationDetail["options"][number];
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
  const [editingOption, setEditingOption] = useState<OptionRow | null>(null);
  const [editingOptionValue, setEditingOptionValue] = useState("");
  const [deletingOption, setDeletingOption] = useState<OptionRow | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(false);
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
  }));
  const optionValidation = useFormValidation(() => ({
    option: { label: "option value", value: optionValue, rules: [required()] },
  }));
  const editingOptionValidation = useFormValidation(() => ({
    option: { label: "option value", value: editingOptionValue, rules: [required()] },
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
    const body: ConfigurationPatch = kind === "category"
      ? { name, description }
      : kind === "warehouse"
        ? { name, addressLine1, addressLine2, city, region, postcode, countryCode: countryCode || null }
        : kind === "custom-field"
          ? { name, required: requiredField, optionListId: optionListId ? Number(optionListId) : null }
          : { name };
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
    if (status === "INACTIVE") {
      const blockers = Deactivate(kind, [{ name: record.name, inUse: record.inUse }]);
      if (blockers.length) {
        setError(blockers[0]!.message);
        return;
      }
    }
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
  const requestDelete = () => {
    setError("");
    const blockers = Deactivate(kind, [{ name: record.name, inUse: record.inUse }]);
    if (blockers.length) {
      setError(blockers[0]!.message);
      return;
    }
    setConfirm(true);
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
  const addOption = async () => {
    if (!optionValidation.attempt()) return;
    if (!optionListTargetId) return;
    const response = await request(
      `/api/inventory/configuration/option-list/${optionListTargetId}/options`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: optionValue.trim() }),
      },
    );
    if (!response) return;
    applyOptionListResponse((await response.json()) as ConfigurationDetail);
    setOptionValue("");
    optionValidation.reset();
    setToast("Option added");
  };
  const openOptionEditor = (option: OptionRow) => {
    setEditingOption(option);
    setEditingOptionValue(option.value);
    editingOptionValidation.reset();
  };
  const closeOptionEditor = () => {
    setEditingOption(null);
    setEditingOptionValue("");
    editingOptionValidation.reset();
  };
  const updateOption = async () => {
    if (!editingOptionValidation.attempt() || !editingOption || !optionListTargetId) return;
    const response = await request(
      `/api/inventory/configuration/option-list/${optionListTargetId}/options/${editingOption.id}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: editingOptionValue.trim() }) },
    );
    if (!response) return;
    applyOptionListResponse((await response.json()) as ConfigurationDetail);
    closeOptionEditor();
    setToast("Option updated");
  };
  const transitionOption = async (option: OptionRow, status: "ACTIVE" | "INACTIVE") => {
    if (!optionListTargetId) return;
    const response = await request(
      `/api/inventory/configuration/option-list/${optionListTargetId}/options/${option.id}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) },
    );
    if (!response) return;
    applyOptionListResponse((await response.json()) as ConfigurationDetail);
    setToast(`Option ${status.toLowerCase()}`);
  };
  const deleteOption = async () => {
    if (!optionListTargetId || !deletingOption) return;
    const response = await request(
      `/api/inventory/configuration/option-list/${optionListTargetId}/options/${deletingOption.id}`,
      { method: "DELETE" },
    );
    if (!response) return;
    applyOptionListResponse((await response.json()) as ConfigurationDetail);
    setDeletingOption(null);
    setToast("Option removed");
  };
  const auditEntityType = {
    category: "item_category",
    warehouse: "warehouse",
    "custom-field": "inv_custom_field",
    "option-list": "inv_option_list",
  }[kind];
  const auditFilter = record.audit.updated.mutationId
    ? `mutationId=${encodeURIComponent(record.audit.updated.mutationId)}`
    : `entityType=${auditEntityType}&entityId=${record.id}`;
  const optionActions = (option: OptionRow): DropdownMenuItem[] => [
    { value: "edit", label: "Edit", icon: "edit", onSelect: () => openOptionEditor(option) },
    option.status === "ACTIVE"
      ? { value: "deactivate", label: "Deactivate", icon: "block", onSelect: () => { void transitionOption(option, "INACTIVE"); } }
      : { value: "activate", label: "Activate", icon: "check_circle", onSelect: () => { void transitionOption(option, "ACTIVE"); } },
    { value: "remove", label: "Remove", icon: "delete", variant: "danger", onSelect: () => setDeletingOption(option) },
  ];
  const optionEditor = <div className={styles.optionsSection}>
    <h2 className={typography.sectionHeading}>Options</h2>
    <div className={styles.optionAdderPanel}><div className={styles.optionAdder}><Input value={optionValue} invalid={optionValidation.hasError("option")} onChange={(event) => setOptionValue(event.target.value)} placeholder="New option value" /><Button variant="secondary" icon="add" onClick={() => { void addOption(); }}>Add Option</Button></div></div>
    <div className={styles.optionTableWrap}><table className={detailStyles.table}><thead><tr><th>Value</th><th>Status</th><th className={detailStyles.numericCell}>Used By</th><th /></tr></thead><tbody>{record.options.length ? record.options.map((option) => <tr key={option.id}><td className={detailStyles.strongCell}>{option.value}</td><td><Badge variant="soft" size="x-small" color={option.status === "ACTIVE" ? "success" : "neutral"}>{option.status}</Badge></td><td className={detailStyles.numericCell}>{option.usedBy} record{option.usedBy === 1 ? "" : "s"}</td><td className={styles.optionActionCell}><DropdownMenu trigger={<Button variant="plain" size="small" icon="more_horiz" title={`Actions for ${option.value}`} />} items={optionActions(option)} alignment="right" width={180} /></td></tr>) : <tr><td colSpan={4} className={styles.emptyCell}>No options have been added.</td></tr>}</tbody></table></div>
  </div>;
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
              disabled={record.inUse && kind !== "category"}
              onClick={requestDelete}
            />
          </div>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={[...(validation.showErrors ? validation.errors : []), ...(optionValidation.showErrors ? optionValidation.errors : []), ...(error ? [error] : [])]}
            visible={validation.showErrors || optionValidation.showErrors || !!error}
            onDismiss={() => {
              validation.dismiss();
              optionValidation.dismiss();
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
                invalid={validation.hasError("name")}
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
                    value={
                      record.dataType === "BOOLEAN"
                        ? "Checkbox"
                        : (record.dataType ?? "").replaceAll("_", " ")
                    }
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
          {kind === "option-list" ||
          (kind === "custom-field" &&
            (record.dataType === "OPTION" ||
              record.dataType === "MULTIPLE_OPTIONS") &&
            !record.isShared)
            ? optionEditor
            : null}
        </section>
        {kind === "option-list" ? (
          <section className={detailStyles.card}>
            <h2 className={typography.sectionHeading}>Used By</h2>
            <DataTable columns={usedColumns} rows={record.usedBy} selectedIds={new Set<number>()} isAllSelected={false} isSomeSelected={false} onSelectAll={() => undefined} onSelectOne={() => undefined} onRowClick={() => undefined} currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={record.usedBy.length} filteredCount={record.usedBy.length} itemLabel="custom fields" hasData={record.usedBy.length > 0} emptyIcon="dynamic_form" emptyTitle="Not used" emptyText="No custom fields use this list" />
          </section>
        ) : null}
      </main>
      {editingOption ? <div className={modalStyles.backdrop}><div className={modalStyles.modal} onClick={(event) => event.stopPropagation()}><div className={modalStyles.header}><h3 className={typography.contentTitle}>Edit Option</h3><Button variant="plain" icon="close" title="Close" onClick={closeOptionEditor} /></div><div className={modalStyles.body}><ValidationAlert errors={editingOptionValidation.errors} visible={editingOptionValidation.showErrors} onDismiss={editingOptionValidation.dismiss} /><div className={modalStyles.fieldGroup}><label className={typography.fieldLabel}>Option Value</label><Input value={editingOptionValue} invalid={editingOptionValidation.hasError("option")} onChange={(event) => setEditingOptionValue(event.target.value)} /></div></div><div className={modalStyles.footer}><Button variant="cancel" onClick={closeOptionEditor}>Cancel</Button><Button variant="primary" onClick={() => { void updateOption(); }}>Update Option</Button></div></div></div> : null}
      <ConfirmDialog
        isOpen={!!deletingOption}
        title="Remove Option"
        message={`Remove ${deletingOption?.value ?? "this option"}? Values already saved against records will be permanently deleted.`}
        confirmLabel="Remove"
        confirmVariant="danger"
        onClose={() => setDeletingOption(null)}
        onConfirm={() => void deleteOption()}
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
