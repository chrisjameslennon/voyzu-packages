"use client";
import { useMemo, useState } from "react";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  DatePicker,
  DropdownMenu,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/report.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type {
  InventoryReport,
  InventoryReportKey,
} from "../types/report.types";
import { InventoryReportTemplate } from "./InventoryReportTemplate";
import localStyles from "./inventory-report.module.css";

const STOCK_ACTIVITY_REPORT_KEYS: InventoryReportKey[] = [
  "stock-activity",
  "stock-reservation-activity",
  "stock-issuances",
  "stock-receipts",
  "stock-transfers",
  "quantity-adjustments",
];

const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function rangeForPreset(
  value: string,
  allDates: { fromDate: string; toDate: string },
): { fromDate: string; toDate: string } {
  const today = new Date();
  if (value === "all-dates") return allDates;
  if (value === "this-month")
    return {
      fromDate: toIso(new Date(today.getFullYear(), today.getMonth(), 1)),
      toDate: toIso(today),
    };
  if (value === "previous-2-complete-months")
    return {
      fromDate: toIso(new Date(today.getFullYear(), today.getMonth() - 2, 1)),
      toDate: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
  if (value === "last-three-months")
    return {
      fromDate: toIso(new Date(today.getFullYear(), today.getMonth() - 3, 1)),
      toDate: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
  if (value === "previous-6-complete-months")
    return {
      fromDate: toIso(new Date(today.getFullYear(), today.getMonth() - 6, 1)),
      toDate: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
  if (value === "previous-90-days")
    return {
      fromDate: toIso(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 90,
        ),
      ),
      toDate: toIso(today),
    };
  return {
    fromDate: toIso(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    toDate: toIso(new Date(today.getFullYear(), today.getMonth(), 0)),
  };
}

const rangeLabels: Record<string, string> = {
  "this-month": "Month to date",
  "last-month": "Previous month",
  "previous-2-complete-months": "Previous 2 full months",
  "last-three-months": "Previous 3 full months",
  "previous-6-complete-months": "Previous 6 full months",
  "previous-90-days": "Previous 90 days",
  "all-dates": "All dates",
  custom: "Custom",
};

export function InventoryReportView({
  report,
  reportKey,
  generatedAt,
  printable = false,
  initialShowInactive = false,
  initialShowCustomFields = true,
  initialRangePreset = "previous-90-days",
  initialFromDate,
  initialToDate,
}: {
  report: InventoryReport;
  reportKey: InventoryReportKey;
  generatedAt: string;
  printable?: boolean;
  initialShowInactive?: boolean;
  initialShowCustomFields?: boolean;
  initialRangePreset?: string;
  initialFromDate: string;
  initialToDate: string;
}) {
  const hasCustomFieldOption = [
    "items",
    "stock-issuances",
    "stock-receipts",
  ].includes(reportKey);
  const hasInactiveItemOption = [
    "items",
    "item-categories",
    "stock-on-hand",
    "stock-availability",
  ].includes(reportKey);
  const hasDateRangeOption = STOCK_ACTIVITY_REPORT_KEYS.includes(reportKey);
  const reportDates = report.rows
    .map(({ date }) => date)
    .filter((date): date is string => Boolean(date))
    .sort();
  const allDates = {
    fromDate: reportDates[0] ?? "",
    toDate: reportDates.at(-1) ?? "",
  };
  const [showInactive, setShowInactive] = useState(initialShowInactive);
  const [showCustomFields, setShowCustomFields] = useState(
    initialShowCustomFields,
  );
  const [rangePreset, setRangePreset] = useState(initialRangePreset);
  const [rangeLabel, setRangeLabel] = useState(
    rangeLabels[initialRangePreset] ?? "Custom",
  );
  const [fromDate, setFromDate] = useState(
    initialRangePreset === "all-dates"
      ? initialFromDate || allDates.fromDate
      : initialFromDate,
  );
  const [toDate, setToDate] = useState(
    initialRangePreset === "all-dates"
      ? initialToDate || allDates.toDate
      : initialToDate,
  );
  const reportParams = () => {
    const params = new URLSearchParams();
    if (hasInactiveItemOption) {
      params.set("showInactive", String(showInactive));
    }
    if (hasCustomFieldOption) {
      params.set("showCustomFields", String(showCustomFields));
    }
    if (hasDateRangeOption) {
      params.set("rangePreset", rangePreset);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
    }
    return params;
  };
  const printablePath = () => {
    const params = reportParams();
    const query = params.toString();
    return `/inventory/reports/${reportKey}/printable${query ? `?${query}` : ""}`;
  };
  const pdf = (mode: "pdf" | "pdf-view") => {
    const params = new URLSearchParams({
      path: `/inventory/reports/${reportKey}/printable`,
      filename: `inventory-${reportKey}`,
      orientation: "landscape",
    });
    for (const [key, value] of reportParams()) params.set(key, value);
    return `/api/capability/${mode}?${params}`;
  };
  const optionItems: DropdownMenuItem[] = useMemo(
    () => [
      {
        value: "show-custom-fields",
        label: (
          <span className={localStyles.checkboxOption}>
            <Checkbox
              checked={showCustomFields}
              onChange={() => undefined}
              tabIndex={-1}
            />
            <span>Include custom fields</span>
          </span>
        ),
        onSelect: () => setShowCustomFields((current) => !current),
      },
    ],
    [showCustomFields],
  );
  const applyPreset = (value: string, label: string) => {
    const range = rangeForPreset(value, allDates);
    setRangePreset(value);
    setRangeLabel(label);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
  };
  const rangeItems: DropdownMenuItem[] = [
    { value: "this-month", label: "Month to date", onSelect: () => applyPreset("this-month", "Month to date") },
    { value: "last-month", label: "Previous month", onSelect: () => applyPreset("last-month", "Previous month") },
    { value: "previous-2-complete-months", label: "Previous 2 full months", onSelect: () => applyPreset("previous-2-complete-months", "Previous 2 full months") },
    { value: "last-three-months", label: "Previous 3 full months", onSelect: () => applyPreset("last-three-months", "Previous 3 full months") },
    { value: "previous-6-complete-months", label: "Previous 6 full months", onSelect: () => applyPreset("previous-6-complete-months", "Previous 6 full months") },
    { value: "previous-90-days", label: "Previous 90 days", onSelect: () => applyPreset("previous-90-days", "Previous 90 days") },
    { value: "all-dates", label: "All dates", onSelect: () => applyPreset("all-dates", "All dates") },
  ];
  const customFromDate = (value: string) => {
    setRangePreset("custom");
    setRangeLabel("Custom");
    setFromDate(value);
  };
  const customToDate = (value: string) => {
    setRangePreset("custom");
    setRangeLabel("Custom");
    setToDate(value);
  };
  const visibleReport = useMemo(
    () => ({
      ...report,
      rows: report.rows
        .filter(
          (row) =>
            (!hasInactiveItemOption || showInactive || !row.inactive) &&
            (!hasDateRangeOption ||
              rangePreset === "all-dates" ||
              (!!row.date &&
                (!fromDate || row.date >= fromDate) &&
                (!toDate || row.date <= toDate))),
        )
        .map((row) =>
          !hasCustomFieldOption || showCustomFields
            ? row
            : { ...row, details: undefined },
        ),
    }),
    [
      hasCustomFieldOption,
      hasInactiveItemOption,
      hasDateRangeOption,
      report,
      rangePreset,
      fromDate,
      toDate,
      showCustomFields,
      showInactive,
    ],
  );
  const document = (
    <InventoryReportTemplate report={visibleReport} generatedAt={generatedAt} />
  );
  if (printable) return document;
  return (
    <div className={layout.reportView}>
      <header className={layout.reportHeader}>
        <div className={layout.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layout.slotTitle}>
          <h1
            className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}
          >
            {report.title}
          </h1>
        </div>
        {hasInactiveItemOption ? (
          <div className={`${layout.slotToolbarLeft} ${localStyles.toolbarLeft}`}>
            <label className={localStyles.inlineCheckboxOption}>
              <Checkbox
                checked={showInactive}
                onChange={() => setShowInactive((current) => !current)}
              />
              <span>Show inactive items</span>
            </label>
          </div>
        ) : null}
        {hasDateRangeOption ? (
          <div className={`${layout.slotToolbarLeft} ${localStyles.dateRange}`}>
            <DropdownMenu
              alignment="left"
              width={240}
              selectedValue={rangePreset}
              items={rangeItems}
              trigger={
                <Button variant="secondary" icon="date_range">
                  {rangeLabel}
                </Button>
              }
            />
            <div className={localStyles.dateControl}>
              <DatePicker
                value={fromDate}
                onChange={customFromDate}
                clearable={false}
              />
            </div>
            <span className={localStyles.rangeSeparator}>through</span>
            <div className={localStyles.dateControl}>
              <DatePicker
                value={toDate}
                onChange={customToDate}
                clearable={false}
              />
            </div>
          </div>
        ) : null}
        <div className={layout.slotToolbarRight}>
          {hasCustomFieldOption ? (
            <DropdownMenu
              trigger={
                <Button variant="plain" icon="tune">
                  Options
                </Button>
              }
              items={optionItems}
              alignment="right"
              closeOnSelect={false}
            />
          ) : null}
          <Button
            variant="secondary"
            icon="open_in_new"
            title="Printable Page"
            onClick={() =>
              window.open(printablePath(), "_blank", "noopener,noreferrer")
            }
          />
          <Button
            variant="secondary"
            icon="picture_as_pdf"
            title="View PDF"
            onClick={() =>
              window.open(pdf("pdf-view"), "_blank", "noopener,noreferrer")
            }
          />
          <Button
            variant="secondary"
            icon="download"
            title="Download PDF"
            onClick={() => {
              window.location.href = pdf("pdf");
            }}
          />
        </div>
      </header>
      <div className={layout.slotDocument}>
        <div className={layout.document} style={{ maxWidth: "297mm" }}>
          {document}
        </div>
      </div>
    </div>
  );
}
