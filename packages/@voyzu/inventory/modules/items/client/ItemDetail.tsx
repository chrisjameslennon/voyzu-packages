"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuditPanel } from "@voyzu/audit/client";
import {
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmDialog,
  Input,
  SearchableSelect,
  TabGroup,
  Toast,
  ValidationAlert,
  required,
  useFormValidation,
} from "@voyzu/ui-components";
import {
  DetailBackButton,
  detailLinkWithBackContext,
} from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import {
  DIMENSION_UNIT_VALUES,
  WEIGHT_UNIT_VALUES,
  type DimensionUnit,
  type ItemCategoryOptionDto,
  type ItemDeletionImpactDto,
  type ItemPatchRequestDto,
  type ItemResponseDto,
  type WeightUnit,
} from "../types/item.types";
import { UNIT_VALUES } from "../../core/types";
import type { Unit } from "../../core/types";
import styles from "./items.module.css";
import { Delete, Update } from "../domain/operation-policy";

const UNIT_OPTIONS = UNIT_VALUES.map((unit) => ({ value: unit, label: unit }));
const DIMENSION_UNIT_OPTIONS = DIMENSION_UNIT_VALUES.map((unit) => ({
  value: unit,
  label: unit,
}));
const WEIGHT_UNIT_OPTIONS = WEIGHT_UNIT_VALUES.map((unit) => ({
  value: unit,
  label: unit,
}));
const measurement = (value: string) =>
  value.trim() === "" ? null : Number(value);
function isEmptyCustomValue(
  value: ItemResponseDto["customFields"][number]["value"] | undefined,
) {
  return (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function ItemDetail({
  item,
  categories,
}: {
  item: ItemResponseDto;
  categories: ItemCategoryOptionDto[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [current, setCurrent] = useState(item);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [categoryId, setCategoryId] = useState(
    item.category ? String(item.category.id) : "",
  );
  const [unit, setUnit] = useState<Unit | "">(item.unit ?? "");
  const [quantityTracked, setQuantityTracked] = useState(item.quantityTracked);
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit | "">(
    item.dimensionUnit ?? "",
  );
  const [dimensionHeight, setDimensionHeight] = useState(
    item.dimensionHeight?.toString() ?? "",
  );
  const [dimensionWidth, setDimensionWidth] = useState(
    item.dimensionWidth?.toString() ?? "",
  );
  const [dimensionDepth, setDimensionDepth] = useState(
    item.dimensionDepth?.toString() ?? "",
  );
  const [weightUnit, setWeightUnit] = useState<WeightUnit | "">(
    item.weightUnit ?? "",
  );
  const [weight, setWeight] = useState(item.weight?.toString() ?? "");
  const [customValues, setCustomValues] = useState<
    Record<number, ItemResponseDto["customFields"][number]["value"]>
  >(
    Object.fromEntries(
      item.customFields.map((field) => [field.id, field.value]),
    ),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showNameWarning, setShowNameWarning] = useState(false);
  const [toast, setToast] = useState("");
  const validation = useFormValidation(() => ({
    name: { label: "name", value: name, rules: [required()] },
    unit: {
      label: "unit",
      value: unit,
      enabled: quantityTracked,
      rules: [required()],
    },
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
    const missingCustomFields = current.customFields.filter(
      (field) =>
        field.required &&
        field.status === "ACTIVE" &&
        isEmptyCustomValue(customValues[field.id]),
    );
    const blockers = Update({
      quantityTracked,
      unit: quantityTracked && unit ? unit : null,
      missingRequiredCustomFields: missingCustomFields.map(({ name: fieldName }) => fieldName),
    });
    if (blockers.length) {
      setError(blockers[0]!.message);
      return;
    }
    setSaving(true);
    try {
      const payload: ItemPatchRequestDto = {
        name: name.trim(),
        description: description.trim(),
        categoryId: categoryId ? Number(categoryId) : null,
        unit: quantityTracked && unit ? unit : null,
        quantityTracked,
        dimensionUnit: dimensionUnit || null,
        dimensionHeight: measurement(dimensionHeight),
        dimensionWidth: measurement(dimensionWidth),
        dimensionDepth: measurement(dimensionDepth),
        weightUnit: weightUnit || null,
        weight: measurement(weight),
        customFields: current.customFields
          .filter(({ status }) => status === "ACTIVE")
          .map((field) => ({
            customFieldId: field.id,
            value: customValues[field.id] ?? null,
          })),
      };
      const response = await request(
        `/api/inventory/items/${encodeURIComponent(current.sku)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response) return;
      const changed = (await response.json()) as ItemResponseDto;
      setCurrent(changed);
      setCustomValues(
        Object.fromEntries(
          changed.customFields.map((field) => [field.id, field.value]),
        ),
      );
      setToast(`Item ${changed.sku} saved`);
    } finally {
      setSaving(false);
    }
  };
  const requestSave = () => {
    if (current.inUse && name.trim() !== current.name) setShowNameWarning(true);
    else void save();
  };
  const transition = async (action: "activate" | "deactivate") => {
    const response = await request(
      `/api/inventory/items/${encodeURIComponent(current.sku)}/${action}`,
      { method: "POST" },
    );
    if (!response) return;
    const changed = (await response.json()) as ItemResponseDto;
    setCurrent(changed);
    setToast(`Item ${changed.sku} ${action}d`);
  };
  const requestDelete = async () => {
    const response = await request(
      "/api/inventory/items/batch/deletion-impact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skus: [current.sku] }),
      },
    );
    if (!response) return;
    const impacts = (await response.json()) as ItemDeletionImpactDto[];
    const blockers = Delete([{ hasUnitsOnHand: impacts.length > 0 }]);
    if (blockers.length) {
      setError(blockers[0]!.message);
      return;
    }
    setShowDelete(true);
  };
  const remove = async () => {
    const response = await request(
      `/api/inventory/items/${encodeURIComponent(current.sku)}`,
      {
      method: "DELETE",
    });
    if (!response) return;
    window.sessionStorage.setItem(
      "inventory-items-toast",
      `Item ${current.sku} deleted`,
    );
    router.push("/inventory/items");
    router.refresh();
  };
  const showRequiredCustomErrors = error.startsWith(
    "Complete required custom field",
  );
  const details = (
    <div className={styles.detailStack}>
      <section className={detailStyles.card}>
        <div className={detailStyles.cardHeader}>
          <h2
            className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}
          >
            Item Details
          </h2>
          <div className={detailStyles.cardHeaderActions}>
            <Button
              variant="secondary"
              icon="save"
              disabled={saving}
              onClick={requestSave}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className={detailStyles.formGrid}>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>SKU</label>
            <Input value={current.sku} disabled />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Name</label>
            <Input
              value={name}
              invalid={validation.hasError("name")}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div
            className={`${detailStyles.fieldGroup} ${detailStyles.fieldFull}`}
          >
            <label className={typography.fieldLabel}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              rows={3}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Category</label>
            <SearchableSelect
              value={categoryId}
              onChange={setCategoryId}
              clearable
              options={categories.map((category) => ({
                value: String(category.id),
                label: category.name,
                code: category.code,
              }))}
              placeholder="Uncategorised"
            />
          </div>
          <label className={styles.checkboxField}>
            <Checkbox
              checked={quantityTracked}
              onChange={(checked) => {
                setQuantityTracked(checked);
                if (!checked) setUnit("");
              }}
            />
            <span>Quantity Tracked</span>
          </label>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Unit</label>
            <SearchableSelect
              value={unit}
              onChange={(value) => setUnit(value as Unit)}
              hasError={validation.hasError("unit")}
              options={UNIT_OPTIONS}
              searchable={false}
              disabled={!quantityTracked}
              placeholder={quantityTracked ? "Select a unit" : "Not applicable"}
            />
          </div>
          <div className={detailStyles.fieldFull}>
            <h3 className={typography.sectionHeading}>
              Dimensions &amp; Weight
            </h3>
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Dimension Unit</label>
            <SearchableSelect
              value={dimensionUnit}
              onChange={(value) => setDimensionUnit(value as DimensionUnit)}
              clearable
              searchable={false}
              options={DIMENSION_UNIT_OPTIONS}
              placeholder="Select a unit"
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Height</label>
            <Input
              type="number"
              min="0"
              step="any"
              value={dimensionHeight}
              onChange={(event) => setDimensionHeight(event.target.value)}
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Width</label>
            <Input
              type="number"
              min="0"
              step="any"
              value={dimensionWidth}
              onChange={(event) => setDimensionWidth(event.target.value)}
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Depth</label>
            <Input
              type="number"
              min="0"
              step="any"
              value={dimensionDepth}
              onChange={(event) => setDimensionDepth(event.target.value)}
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Weight Unit</label>
            <SearchableSelect
              value={weightUnit}
              onChange={(value) => setWeightUnit(value as WeightUnit)}
              clearable
              searchable={false}
              options={WEIGHT_UNIT_OPTIONS}
              placeholder="Select a unit"
            />
          </div>
          <div className={detailStyles.fieldGroup}>
            <label className={typography.fieldLabel}>Weight</label>
            <Input
              type="number"
              min="0"
              step="any"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
  const customFields = (
    <section className={detailStyles.card}>
      <div className={detailStyles.cardHeader}>
        <h2
          className={`${typography.sectionHeading} ${detailStyles.cardHeaderTitle}`}
        >
          Custom Fields
        </h2>
        <Button
          variant="secondary"
          icon="save"
          disabled={
            saving ||
            !current.customFields.some(({ status }) => status === "ACTIVE")
          }
          onClick={requestSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      {current.customFields.length ? (
        <div className={detailStyles.formGrid}>
          {current.customFields.map((field) => {
            const disabled = field.status !== "ACTIVE";
            const value = customValues[field.id];
            const label = `${field.name}${field.required ? " *" : ""}`;
            if (field.dataType === "BOOLEAN")
              return (
                <label key={field.id} className={styles.checkboxField}>
                  <Checkbox
                    checked={value === true}
                    disabled={disabled}
                    onChange={(checked) =>
                      setCustomValues((values) => ({
                        ...values,
                        [field.id]: checked,
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              );
            if (field.dataType === "OPTION")
              return (
                <div key={field.id} className={detailStyles.fieldGroup}>
                  <label className={typography.fieldLabel}>{label}</label>
                  <SearchableSelect
                    value={typeof value === "number" ? String(value) : ""}
                    onChange={(selected) =>
                      setCustomValues((values) => ({
                        ...values,
                        [field.id]: selected ? Number(selected) : null,
                      }))
                    }
                    hasError={
                      showRequiredCustomErrors &&
                      field.required &&
                      isEmptyCustomValue(value)
                    }
                    clearable
                    disabled={disabled}
                    options={field.options.map((option) => ({
                      value: String(option.id),
                      label: option.value,
                    }))}
                  />
                </div>
              );
            if (field.dataType === "MULTIPLE_OPTIONS")
              return (
                <div key={field.id} className={detailStyles.fieldGroup}>
                  <label className={typography.fieldLabel}>{label}</label>
                  <SearchableSelect
                    multiple
                    value={Array.isArray(value) ? value.map(String) : []}
                    onChange={(selected) =>
                      setCustomValues((values) => ({
                        ...values,
                        [field.id]: selected.map(Number),
                      }))
                    }
                    hasError={
                      showRequiredCustomErrors &&
                      field.required &&
                      isEmptyCustomValue(value)
                    }
                    disabled={disabled}
                    options={field.options.map((option) => ({
                      value: String(option.id),
                      label: option.value,
                    }))}
                  />
                </div>
              );
            return (
              <div key={field.id} className={detailStyles.fieldGroup}>
                <label className={typography.fieldLabel}>{label}</label>
                <Input
                  type={
                    field.dataType === "NUMBER"
                      ? "number"
                      : field.dataType === "DATE"
                        ? "date"
                        : "text"
                  }
                  disabled={disabled}
                  invalid={
                    showRequiredCustomErrors &&
                    field.required &&
                    isEmptyCustomValue(value)
                  }
                  value={
                    typeof value === "string" || typeof value === "number"
                      ? value
                      : ""
                  }
                  onChange={(event) =>
                    setCustomValues((values) => ({
                      ...values,
                      [field.id]:
                        field.dataType === "NUMBER"
                          ? event.target.value === ""
                            ? null
                            : Number(event.target.value)
                          : event.target.value,
                    }))
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className={typography.bodyText}>
          No item custom fields are configured for this organization.
        </p>
      )}
    </section>
  );

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
                box
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
            <DetailBackButton fallbackHref="/inventory/items" />
            <div className={detailStyles.headerActionSeparator} />
            <Button
              variant="secondary"
              icon="check_circle"
              disabled={current.status === "ACTIVE"}
              onClick={() => {
                void transition("activate");
              }}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              icon="block"
              disabled={current.status === "INACTIVE"}
              onClick={() => {
                void transition("deactivate");
              }}
            >
              Deactivate
            </Button>
            <div className={detailStyles.headerActionSeparator} />
            <Button
              variant="danger"
              icon="delete"
              title="Delete item"
              onClick={() => {
                void requestDelete();
              }}
            />
          </div>
        </div>
        <div className={layout.slotAlert}>
          <ValidationAlert
            errors={[
              ...(validation.showErrors ? validation.errors : []),
              ...(error ? [error] : []),
            ]}
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
            color={current.status === "ACTIVE" ? "success" : "neutral"}
          >
            {current.status}
          </Badge>
          {current.inUse ? (
            <Badge variant="soft" size="medium" color="success">
              IN USE
            </Badge>
          ) : null}
        </div>
        <AuditPanel
          id={current.id}
          creationDate={current.audit.created.date}
          updatedDate={current.audit.updated.date}
          creationActorType={current.audit.created.actorType}
          creationUser={current.audit.created.user}
          updatedActorType={current.audit.updated.actorType}
          updatedUser={current.audit.updated.user}
          auditHref={(() => {
            const mutationId =
              current.audit.updated.mutationId ??
              current.audit.created.mutationId;
            const filter = mutationId
              ? `mutationId=${encodeURIComponent(mutationId)}`
              : `entityType=item&entityId=${current.id}`;
            return detailLinkWithBackContext(
              `/settings/audit?${filter}`,
              "audit",
              pathname,
            );
          })()}
          onNavigate={(href) => router.push(href)}
        />
      </aside>
      <main className={layout.mainSection}>
        <TabGroup
          defaultKey="details"
          tabs={[
            { key: "details", label: "Details", content: details },
            {
              key: "custom-fields",
              label: "Custom Fields",
              content: customFields,
            },
          ]}
        />
      </main>
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Item"
        message={`Permanently delete ${current.sku} — ${current.name}?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          void remove();
        }}
      />
      <ConfirmDialog
        isOpen={showNameWarning}
        title="Rename In-use Item"
        message={`This item is in use. Changing its name may affect how it is recognised in existing inventory records. Continue?`}
        confirmLabel="Continue and Save"
        onClose={() => setShowNameWarning(false)}
        onConfirm={() => {
          setShowNameWarning(false);
          void save();
        }}
      />
      <Toast isVisible={!!toast} onClose={() => setToast("")} message={toast} />
    </div>
  );
}
