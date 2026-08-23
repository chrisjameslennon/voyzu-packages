import {
  handleBatchCreate,
  handleBatchActivate,
  handleBatchDeactivate,
  handleBatchDelete,
  handleBatchGet,
  handleBatchPatch,
  handleBatchUpdate,
  handleActivate,
  handleCreate,
  handleDeactivate,
  handleDelete,
  handleFilter,
  handleGet,
  handleList,
  handlePatch,
  handleSearch,
  handleUpdate,
} from "./server/api/organization.http.handlers";
import { OrganizationsListPage, OrganizationDetailPage } from "@voyzu/erp-core/organizations/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organizations.page.list",
    pageTitle: "Organizations",
    helpPath: "modules-help/organization-financial-settings/organization",
    apiDocsUrl: "organizations",
    path: "/organization/organizations",
    Page: OrganizationsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organizations.page.detail",
    pageTitle: "Organization",
    helpPath: "modules-help/organization-financial-settings/organization",
    apiDocsUrl: "organizations",
    path: "/organization/organizations/[code]",
    Page: OrganizationDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Organizations",
        href: "/organization/organizations",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
