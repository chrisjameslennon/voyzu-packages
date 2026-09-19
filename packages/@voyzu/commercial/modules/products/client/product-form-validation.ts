import { readRichTextDocument } from "@voyzu/ui-components/rich-text-editor/document";
import { required, maxLength, type FieldDescriptor } from "@voyzu/ui-components";
import { variantMatchesOptions } from "../domain/product-variants";
import type { ProductDetail } from "../types/product-detail.dto";

export function productTabFields(product: ProductDetail, tab: string): Record<string, FieldDescriptor> {
  const fields: Record<string, FieldDescriptor> = {};
  const text = (key: string, label: string, value: string, maximum: number, mandatory = true) => {
    fields[key] = { label, value, rules: [...(mandatory ? [required()] : []), maxLength(maximum, label + " must be " + maximum + " characters or less")] };
  };
  if (tab === "details") {
    text("name", "product name", product.name, 200);
    text("shortDescription", "short description", product.shortDescription, 2000, false);
    text("description", "description", readRichTextDocument(product.description).textContent, 20000, false);
  }
  if (tab === "images") {
    product.images.forEach((image, index) => text("image-" + index, "image path for row " + (index + 1), image.path, 2000));
  }
  if (tab === "variants" && product.useVariants) {
    fields.variants = { label: "variants", value: "variants", rules: [{ kind: "format", test: () => product.options.length > 0 && product.variants.filter((variant) => variant.status === "ACTIVE" && variantMatchesOptions(variant, product.options)).length >= 2, message: "A product must have at least two variants when Use Variants is enabled." }] };
    product.variants.forEach((variant) => {
      text("sku-" + variant.id, "SKU for variant " + (Object.values(variant.options).join(" / ") || "Default"), variant.sku, 100);
      fields["sku-" + variant.id].rules.push({
        kind: "format",
        test: (value) => !value.trim() || product.variants.filter((row) => row.sku.trim().toUpperCase() === value.trim().toUpperCase()).length === 1,
        message: "Variant SKUs must be unique",
      });
      if (product.variantPricing === "OWN_PRICES" && Object.keys(variant.options).length > 0) fields["variant-price-" + variant.id] = {
        label: "price for " + variant.sku, value: Number.isFinite(variant.basePrice) ? String(variant.basePrice) : "",
        rules: [required(), { kind: "format", test: (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), message: "Variant prices must be zero or greater" }],
      };
      text("variant-image-" + variant.id, "variant image path", variant.imagePath, 2000, false);
    });
  }
  if (tab === "pricing") {
    fields.basePrice = {
      label: "base price", value: Number.isFinite(product.basePrice) ? String(product.basePrice) : "",
      rules: [required(), { kind: "format", test: (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), message: "Base price must be zero or greater" }],
    };
  }

  if (tab === "custom") {
    product.customFields.forEach((field, index) => {
      text("custom-name-" + index, "field name for row " + (index + 1), field.name, 200);
      text("custom-value-" + index, "custom field value", field.value, 2000, false);
    });
  }
  return fields;
}
