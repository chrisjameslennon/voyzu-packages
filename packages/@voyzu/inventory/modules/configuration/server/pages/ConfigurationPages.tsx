import "server-only";
import { notFound } from "next/navigation";
import { ConfigurationDetailView, ConfigurationListView } from "../../client";
import type { ConfigurationKind } from "../../types/configuration.types";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import {
  getConfiguration,
  listConfiguration,
} from "../lib/configuration.service";
const meta = {
  category: {
    title: "Item Categories",
    singular: "Item Category",
    description: "Categories used to organise and group inventory items.",
    icon: "category",
    href: "/inventory/item-categories",
  },
  warehouse: {
    title: "Warehouses",
    singular: "Warehouse",
    description: "Warehouses and internal stock locations.",
    icon: "warehouse",
    href: "/inventory/warehouses",
  },
  "custom-field": {
    title: "Inventory Custom Fields",
    singular: "Custom Field",
    description: "Custom fields can be added to items and stock transactions.",
    icon: "dynamic_form",
    href: "/inventory/custom-fields",
  },
  "option-list": {
    title: "Custom Field Option Lists",
    singular: "Option List",
    description:
      "Shared option lists used by Select and Multi Select custom fields.",
    icon: "list_alt",
    href: "/inventory/custom-field-option-lists",
  },
} as const;
async function listPage(kind: ConfigurationKind) {
  const organization = await getSelectedOrganization();
  const [rows, optionLists] = organization
    ? await Promise.all([
        listConfiguration(organization.id, kind),
        listConfiguration(organization.id, "option-list"),
      ])
    : [[], []];
  return (
    <ConfigurationListView
      kind={kind}
      meta={meta[kind]}
      rows={rows}
      optionLists={optionLists}
    />
  );
}
async function detailPage(kind: ConfigurationKind, id?: string) {
  const organization = await getSelectedOrganization();
  if (!organization || !id) notFound();
  const [record, optionLists] = await Promise.all([
    getConfiguration(organization.id, kind, Number(id)),
    listConfiguration(organization.id, "option-list"),
  ]);
  if (!record) notFound();
  return (
    <ConfigurationDetailView
      kind={kind}
      meta={meta[kind]}
      record={record}
      optionLists={optionLists}
    />
  );
}
export const CategoriesPage = () => listPage("category");
export const WarehousesPage = () => listPage("warehouse");
export const CustomFieldsPage = () => listPage("custom-field");
export const OptionListsPage = () => listPage("option-list");
export const CategoryDetailPage = ({ id }: { id?: string }) =>
  detailPage("category", id);
export const WarehouseDetailPage = ({ id }: { id?: string }) =>
  detailPage("warehouse", id);
export const CustomFieldDetailPage = ({ id }: { id?: string }) =>
  detailPage("custom-field", id);
export const OptionListDetailPage = ({ id }: { id?: string }) =>
  detailPage("option-list", id);
