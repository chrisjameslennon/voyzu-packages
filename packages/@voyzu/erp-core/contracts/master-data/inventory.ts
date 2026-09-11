import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/types/modules/core";
const Id = Type.Integer({ minimum: 1 });
const Text = Type.String();
const NullableText = Type.Union([Text, Type.Null()]);
const Status = Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]);
const StockActivityDetail = StrictObject({
  id: Id, code: Text, date: Text, type: Text, reference: NullableText, notes: Text,
  linkedDocuments: Type.Array(StrictObject({
    documentType: Text, documentId: Id, documentCode: Text, creationDate: Text, href: NullableText,
  })),
  lines: Type.Array(StrictObject({
    id: Id, itemId: Id, sku: Text, itemName: Text, warehouseId: Id, warehouse: Text,
    quantityChange: Type.Number(), reasonCode: NullableText,
  })),
  audit: AuditMetadataDto,
});


export const inventoryDataContracts = {
  inventoryItem: {
    identifier: "id", identifierDataDefinition: Id,
    dataDefinition: StrictObject({ sku: Text, name: Text, category: NullableText, unit: NullableText, quantityTracked: Type.Boolean(), status: Status }),
    queries: { byOrganization: { inputDataDefinition: StrictObject({ organizationId: Id }) } },
  },
  "inventoryItem.operational": {
    extends: "inventoryItem",
    dataDefinition: StrictObject({ sku: Text, name: Text, description: Text, quantityTracked: Type.Boolean(), status: Status }),
    queries: { bySkus: { inputDataDefinition: StrictObject({ organizationId: Id, skus: Type.Array(Text) }) } },
  },
  stockActivity: {
    identifier: "id", identifierDataDefinition: Id,
    dataDefinition: Type.Omit(StockActivityDetail, ["id"]),
    queries: { byCode: { inputDataDefinition: StrictObject({ organizationId: Id, code: Text }) } },
  },
} as const;
