import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/types/modules/core";

const Id = Type.Integer({ minimum: 1 });
const Text = Type.String();
const NullableText = Type.Union([Text, Type.Null()]);
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

export const inventoryActivityCapability = {
  getStockActivityDetail: {
    input: StrictObject({ organizationId: Id, code: Text }),
    output: StrictObject({ record: Type.Union([StockActivityDetail, Type.Null()]) }),
  },
} as const;
