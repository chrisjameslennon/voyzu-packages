import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OperationReference } from "../../common/types";

export const GlAccountPointerName = Type.Union([
  Type.Literal("Accounts Payable Control Accounts"),
  Type.Literal("Accounts Receivable Control Accounts"),
  Type.Literal("Bank / Cash Accounts"), Type.Literal("Tax Control Accounts"),
  Type.Literal("Inventory Control Accounts"),
  Type.Literal("Financial Document Defaults"), Type.Literal("Item Posting Profiles"),
]);
export type GlAccountPointerName = Type.Static<typeof GlAccountPointerName>;

export const GlAccountPointerReference = StrictObject({
  ...OperationReference.properties,
  type: GlAccountPointerName,
});
export type GlAccountPointerReference = Type.Static<typeof GlAccountPointerReference>;
