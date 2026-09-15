import "server-only";
import { notFound } from "next/navigation";
import { internalApi } from "@voyzu/capability/internal-api";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { listPricingCategories } from "../lib/pricing-category.service";
import { PricingCategoryDetail } from "../../client/PricingCategoryDetail";
export async function PricingCategoryDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {});
  if (!code || !selectedOrganization) notFound();
  const record = listPricingCategories(selectedOrganization.organization_id).find((row) => row.code === code);
  if (!record) notFound();
  return <PricingCategoryDetail key={selectedOrganization.organization_id + "-" + record.id} initial={record} />;
}
