import type { ItemListRow } from "../types/item-list.types";
import type { ItemListCustomFieldDto } from "../types/item.types";

export function customFieldDisplayValues(
  field: ItemListCustomFieldDto,
): string[] {
  return field.dataType === "BOOLEAN"
    ? field.values.map((value) => value === "true" ? "Yes" : "No")
    : field.values;
}

export function ItemMatchesSearch(
  item: ItemListRow,
  search: string,
): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return [
    item.sku,
    item.name,
    item.category ?? "",
    item.unit ?? "",
    ...item.customFields.flatMap((field) => [
      ...field.values,
      ...customFieldDisplayValues(field),
    ]),
  ].some((value) => value.toLowerCase().includes(query));
}
