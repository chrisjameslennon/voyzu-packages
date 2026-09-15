import type { ProductOption, ProductVariant } from "../types/product-detail.dto";

export const combinationKey = (options: Record<string, string>) =>
  JSON.stringify(Object.entries(options).sort(([a], [b]) => a.localeCompare(b)));

export function variantMatchesOptions(variant: ProductVariant, options: ProductOption[]) {
  return Object.keys(variant.options).length === options.length
    && options.every((option) => option.values.includes(variant.options[option.id]));
}

export function generateVariants(code: string, options: ProductOption[], existing: ProductVariant[], basePrice: number): ProductVariant[] {
  const count = options.reduce((total, option) => total * option.values.length, 1);
  if (count > 200) throw new Error("Please limit generation to 200 combinations at a time.");
  let combinations: Record<string, string>[] = [{}];
  for (const option of options) {
    combinations = combinations.flatMap((combination) => option.values.map((value) => ({ ...combination, [option.id]: value })));
  }
  const result = existing.map((variant) => ({ ...variant, basePrice: variant.basePrice ?? basePrice, status: variantMatchesOptions(variant, options) ? variant.status : "INACTIVE" as const }));
  const keys = new Set(existing.map((variant) => combinationKey(variant.options)));
  for (const combination of combinations) {
    if (keys.has(combinationKey(combination))) continue;
    const id = crypto.randomUUID();
    result.push({ id, basePrice, options: combination, sku: options.length ? code + "-" + id.slice(0, 8).toUpperCase() : code, status: "ACTIVE", imagePath: "" });
  }
  if (result.length > 500) throw new Error("A product can contain up to 500 variants in this prototype.");
  return result;
}
