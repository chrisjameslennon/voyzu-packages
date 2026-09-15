import Type from "typebox";
export const PricingCategoryInputDto = Type.Object({ code: Type.String({ pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*$", maxLength: 50 }), name: Type.String({ pattern: "\\S", maxLength: 100 }) }, { additionalProperties: false });
export type PricingCategoryInput = Type.Static<typeof PricingCategoryInputDto>;
export type PricingCategory = PricingCategoryInput & { id: number; status: "ACTIVE" | "INACTIVE"; count: number; createdAt?: number; updatedAt?: number };

export const PricingAdjustmentDto = Type.Object({ codes: Type.Array(Type.String({ minLength: 1 }), { minItems: 1, uniqueItems: true }), direction: Type.Union([Type.Literal("increase"), Type.Literal("decrease")]), method: Type.Union([Type.Literal("percentage"), Type.Literal("amount")]), value: Type.Number({ exclusiveMinimum: 0 }) }, { additionalProperties: false });
export type PricingAdjustment = Type.Static<typeof PricingAdjustmentDto>;
