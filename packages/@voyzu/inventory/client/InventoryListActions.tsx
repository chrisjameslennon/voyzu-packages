"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  DropdownMenu,
  type DropdownMenuItem,
} from "@voyzu/ui-components";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";

export type InventoryExportColumn = {
  key: string;
  label: string;
};

export function InventoryListActions<Row extends { id: number }>({
  rows,
  visibleRows,
  selectedIds,
  filename,
  columns,
  toExportRow,
}: {
  rows: Row[];
  visibleRows: Row[];
  selectedIds: Set<number>;
  filename: string;
  columns: InventoryExportColumn[];
  toExportRow: (row: Row) => Record<string, unknown>;
}) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const selectedRows = useMemo(
    () => rows.filter((row) => selectedIds.has(row.id)),
    [rows, selectedIds],
  );

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      router.refresh();
      setRefreshing(false);
    }, 500);
  };

  const exportCsv = async (exportRows: Row[], suffix: string) => {
    const response = await fetch("/api/capability/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: `${filename}_${suffix}`,
        columns,
        rows: exportRows.map(toExportRow),
      }),
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${suffix}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportItems = useMemo<DropdownMenuItem[]>(
    () => [
      {
        value: "selected",
        label: `Selected (${selectedRows.length})`,
        icon: "check_box",
        disabled: selectedRows.length === 0,
        onSelect: () => void exportCsv(selectedRows, "selected"),
      },
      {
        value: "current-view",
        label: `Current view (${visibleRows.length})`,
        icon: "visibility",
        disabled: visibleRows.length === 0,
        onSelect: () => void exportCsv(visibleRows, "current_view"),
      },
      {
        value: "full-dataset",
        label: `Full dataset (${rows.length})`,
        icon: "database",
        disabled: rows.length === 0,
        onSelect: () => void exportCsv(rows, "full_dataset"),
      },
    ],
    [rows, selectedRows, visibleRows],
  );

  return (
    <>
      <Button
        variant="plain"
        icon="sync"
        className={refreshing ? listStyles.spinning : undefined}
        disabled={refreshing}
        title="Refresh"
        onClick={refresh}
      />
      <DropdownMenu
        trigger={<Button variant="plain" icon="file_download" title="Export" />}
        items={exportItems}
        alignment="right"
        width={260}
      />
    </>
  );
}
