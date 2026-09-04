import "server-only";
import { notFound } from "next/navigation";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import {
  getConfiguration,
  listConfiguration,
} from "../../../configuration/server/lib/configuration.service";
import {
  StockActivityView,
  StockTransactionDetailView,
  StockTransactionReportTemplate,
  StockCountEditor,
  StockCountReportTemplate,
  StockCountsView,
  StockOperationView,
  StockPositionsView,
} from "../../client";
import {
  getStockCount,
  getStockActivityDetail,
  getStockOptions,
  listStockActivity,
  listStockCounts,
  listStockPositions,
} from "../lib/stock.service";
async function context() {
  const organization = await getSelectedOrganization();
  if (!organization)
    return {
      organizationId: null,
      positions: [],
      options: { items: [], warehouses: [] },
    };
  const [positions, options] = await Promise.all([
    listStockPositions(organization.id),
    getStockOptions(organization.id),
  ]);
  return { organizationId: organization.id, positions, options };
}
export async function StockPage() {
  const c = await context();
  return <StockPositionsView positions={c.positions} />;
}
export async function StockActivityPage() {
  const organization = await getSelectedOrganization();
  return (
    <StockActivityView
      rows={organization ? await listStockActivity(organization.id) : []}
    />
  );
}
export async function StockTransactionDetailPage({
  code,
  surface,
}: {
  code?: string;
  surface?: { unframed?: boolean };
}) {
  const organization = await getSelectedOrganization();
  if (!organization || !code) notFound();
  const record = await getStockActivityDetail(organization.id, code);
  if (!record) notFound();
  if (surface?.unframed) {
    return (
      <StockTransactionReportTemplate
        record={record}
        organization={organization}
        generatedAt={new Date().toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    );
  }
  return <StockTransactionDetailView record={record} organization={organization} />;
}
export async function StockCountsPage() {
  const organization = await getSelectedOrganization();
  return (
    <StockCountsView
      rows={organization ? await listStockCounts(organization.id) : []}
    />
  );
}
async function operation(
  kind: "receive" | "issue" | "transfer" | "reserve" | "adjust",
) {
  const c = await context();
  let customFields: Awaited<ReturnType<typeof getConfiguration>>[] = [];
  if (c.organizationId && (kind === "receive" || kind === "issue")) {
    const rows = await listConfiguration(c.organizationId, "custom-field");
    customFields = await Promise.all(
      rows.map((row) =>
        getConfiguration(c.organizationId!, "custom-field", row.id),
      ),
    );
  }
  return (
    <StockOperationView
      kind={kind}
      positions={c.positions}
      items={c.options.items}
      warehouses={c.options.warehouses}
      customFields={customFields.filter(
        (field): field is NonNullable<typeof field> =>
          field !== null &&
          field.appliesTo === (kind === "receive" ? "RECEIPT" : "ISSUE"),
      )}
    />
  );
}
export const ReceiveStockPage = () => operation("receive");
export const IssueStockPage = () => operation("issue");
export const TransferStockPage = () => operation("transfer");
export const ReserveStockPage = () => operation("reserve");
export const AdjustStockPage = () => operation("adjust");
export async function StockCountNewPage() {
  const c = await context();
  return (
    <StockCountEditor
      positions={c.positions}
      warehouses={c.options.warehouses}
    />
  );
}
export async function StockCountDetailPage({
  id,
  surface,
}: {
  id?: string;
  surface?: { unframed?: boolean };
}) {
  const c = await context();
  if (!c.organizationId || !id) notFound();
  const record = await getStockCount(c.organizationId, Number(id));
  if (!record) notFound();
  const organization = await getSelectedOrganization();
  if (!organization) notFound();
  if (surface?.unframed) {
    return (
      <StockCountReportTemplate
        record={record}
        organization={organization}
        generatedAt={new Date().toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    );
  }
  return (
    <StockCountEditor
      record={record}
      organization={organization}
      positions={c.positions}
      warehouses={c.options.warehouses}
    />
  );
}
