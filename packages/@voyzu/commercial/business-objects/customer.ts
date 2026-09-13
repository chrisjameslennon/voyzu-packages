import Type, { type Static } from "typebox";

export const CustomerExtensionSchema = Type.Object({
  creditLimit: Type.Number(),
}, { additionalProperties: false });

// Commercial contributes customer-specific behaviour, not shared retrieval.
export interface CustomerExtension extends Static<typeof CustomerExtensionSchema> {
  adjustCreditLimit(amount: number): Promise<void>;
}
