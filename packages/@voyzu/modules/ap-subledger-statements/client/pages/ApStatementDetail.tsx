"use client";


import { DetailBackButton } from "@voyzu/ui-surface/client";
import { CompanyPageTitleBadges, type DetailBackSource } from "@voyzu/modules/common/client";
import type { ApCounterpartyStatementResponseDto } from "@voyzu/types/modules/ap-subledger";
import { Breadcrumbs, DataTable, type DataTableColumn } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detailStyles from "@voyzu/ui-style/css-modules/detail.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const moneyFormat = new Intl.NumberFormat("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number) => value === 0 ? "-" : moneyFormat.format(value);

type StatementLine = ApCounterpartyStatementResponseDto["groups"][number] & { id: string };

const columns: DataTableColumn<StatementLine>[] = [
  { key: "postingDate", label: "Date", width: "8rem" },
  { key: "documentTypeLabel", label: "Document", width: "12rem" },
  { key: "documentId", label: "Document ID", width: "12rem", render: (row) => <span className={listStyles.codeCell}>{row.documentId}</span> },
  { key: "description", label: "Description", width: "20rem" },
  { key: "debit", label: "Debit", width: "9rem", align: "right", render: (row) => money(row.debit) },
  { key: "credit", label: "Credit", width: "9rem", align: "right", render: (row) => money(row.credit) },
  { key: "openBalance", label: "Open", width: "9rem", align: "right", render: (row) => money(row.openBalance) },
];

export function ApStatementDetail({
  statement,
  from,
  fromCode,
}: {
  statement: ApCounterpartyStatementResponseDto;
  from?: DetailBackSource;
  fromCode?: string;
}) {
  const rows = statement.groups.map((group) => ({ ...group, id: group.code }));
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}><div className={layout.slotBreadcrumb}><Breadcrumbs /></div><div className={layout.slotTitle}><div className={detailStyles.title}><div className={detailStyles.titleIcon}><span className={`material-symbols-outlined ${detailStyles.titleIconSymbol}`}>summarize</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{statement.counterpartyName}</h1></div><div className={layout.slotTitleMeta}><CompanyPageTitleBadges /></div></div><div className={layout.slotActions}><div className={detailStyles.headerActions}><DetailBackButton fallbackHref={"/finance/subledgers/ap/statements"} from={from} fromCode={fromCode} /></div></div></header>
      <aside className={layout.statusSection}><section className={detailStyles.card}><h2 className={typography.sectionHeading}>Statement Totals</h2><p>Debit <strong>{money(statement.totalDebit)}</strong></p><p>Credit <strong>{money(statement.totalCredit)}</strong></p><p>Total Owing <strong>{money(statement.totalOwing)}</strong></p></section></aside>
      <main className={layout.mainSection}><section className={detailStyles.card}><h2 className={typography.sectionHeading}>Statement</h2><p className={typography.headingByline}>As at {statement.asAtDate} - {statement.baseCurrencyCode}</p><DataTable<StatementLine, string> columns={columns} rows={rows} selectedIds={new Set<string>()} isAllSelected={false} isSomeSelected={false} onSelectAll={() => undefined} onSelectOne={() => undefined} noSelectionColumn currentPage={1} totalPages={1} onPageChange={() => undefined} totalCount={rows.length} filteredCount={rows.length} itemLabel="lines" hasData={rows.length > 0} emptyIcon="summarize" emptyTitle="No statement lines found" emptyText="No statement activity exists for this counterparty" /></section></main>
    </div>
  );
}
