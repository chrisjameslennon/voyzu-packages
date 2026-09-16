import "server-only";
import { notFound } from "next/navigation";
import { internalApi } from "@voyzu/capability/internal-api";
import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import { getProductConfiguration } from "../lib/product-configuration.service";
import type { ProductConfigurationKind } from "../../types/product-configuration.dto";
import { ProductConfigurationDetailView } from "../../client/ProductConfigurationDetailView";
async function page({ context }: PageProps, kind: ProductConfigurationKind) { const { code } = pageStringParameters(context.pathParams); const { selectedOrganization } = await internalApi.call("@core/organization-context", "get", {}); if (!code || !selectedOrganization) notFound(); const record = await getProductConfiguration(selectedOrganization.organization_id, kind, code); if (!record) notFound(); return <ProductConfigurationDetailView key={kind+"-"+selectedOrganization.organization_id+"-"+record.id} initial={record} kind={kind}/>; }
export const ProductCategoryDetailPage=(props:PageProps)=>page(props,"categories");
export const ProductListDetailPage=(props:PageProps)=>page(props,"lists");
export const ProductOptionListDetailPage=(props:PageProps)=>page(props,"optionLists");
