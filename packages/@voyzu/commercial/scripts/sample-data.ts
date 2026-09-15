import { seedPricingCategory } from "../modules/product-pricing-categories/server/lib/pricing-category.service";
import { internalApi } from "@voyzu/capability/internal-api";
import { upsertSampleProduct } from "../modules/products/server/lib/product.service";
import { upsertProductConfiguration } from "../modules/products/server/lib/product-configuration.service";

const products = [
  { code: "COFFEE", name: "Premium Coffee Beans", basePrice: 32.5, type: "Physical", category: "Coffee & Tea", brand: "Voyzu Roasters", manufacturer: "Voyzu Roasters", salesUnit: "Bag", status: "ACTIVE" },
  { code: "BOX", name: "Gift Shipping Box", basePrice: 4.5, type: "Other", category: "Packaging", brand: "Pack & Send", manufacturer: "Pack & Send", salesUnit: "Each", status: "ACTIVE" },
  { code: "GIFT", name: "Coffee Gift Set", basePrice: 65, type: "Other", category: "Gift Sets", brand: "Voyzu Roasters", manufacturer: "Voyzu Roasters", salesUnit: "Set", status: "ACTIVE" },
  { code: "MUG", name: "Ceramic Coffee Mug", basePrice: 18, type: "Physical", category: "Drinkware", brand: "Everyday Home", manufacturer: "Everyday Home", salesUnit: "Each", status: "ACTIVE" },
  { code: "FILTER", name: "Reusable Coffee Filter", basePrice: 24.9, type: "Physical", category: "Coffee Accessories", brand: "Brew Essentials", manufacturer: "Brew Essentials", salesUnit: "Each", status: "INACTIVE" },
  { code: "TEA", name: "Earl Grey Tea", basePrice: 14.5, type: "Physical", category: "Coffee & Tea", brand: "Tea Garden", manufacturer: "Tea Garden", salesUnit: "Box", status: "ACTIVE" },
  { code: "BOTTLE", name: "Insulated Water Bottle", basePrice: 39.9, type: "Physical", category: "Drinkware", brand: "Trailware", manufacturer: "Trailware", salesUnit: "Each", status: "ACTIVE" },
  { code: "DELIVERY", name: "Local Delivery", basePrice: 8, type: "Service", category: "Delivery Services", brand: "Voyzu Delivery", manufacturer: "Voyzu Delivery", salesUnit: "Delivery", status: "ACTIVE" },
  { code: "TRAINING", name: "Barista Training Session", basePrice: 150, type: "Service", category: "Training", brand: "Voyzu Academy", manufacturer: "Voyzu Academy", salesUnit: "Session", status: "ACTIVE" },
  { code: "APRON", name: "Canvas Apron", basePrice: 45, type: "Physical", category: "Workwear", brand: "Brew Essentials", manufacturer: "Brew Essentials", salesUnit: "Each", status: "INACTIVE" },
] as const;

/** Inserts or replaces sample products by code, preserving their identities. */
export async function sampleData(): Promise<void> {
  const organization = await internalApi.call("@core/organization", "get", { code: "TESTCO" });
  if (!organization || organization.status !== "ACTIVE") {
    throw new Error("Active organization TESTCO was not found. Run @voyzu/organization:sampleData first.");
  }
  await seedSampleProducts(organization.organization_id);
  console.log(`Commercial sample data ready for TESTCO: ${products.length} products in this process's memory.`);
}

export async function seedSampleProducts(organizationId: number): Promise<void> {
  for (const list of [
    { code: "COLOURS", name: "Colours", values: ["Black", "White", "Red", "Blue", "Green"] },
    { code: "SIZES", name: "Sizes", values: ["Small", "Medium", "Large", "Extra Large"] },
    { code: "FINISHES", name: "Finishes", values: ["Matte", "Gloss", "Satin"] },
  ]) {
    upsertProductConfiguration(organizationId, "optionLists", { ...list, description: "Shared product variant options.", status: "ACTIVE" });
  }
  const lists = [
    { code: "BRAND", name: "Brand", description: "Brands used to merchandise products.", field: "brand" },
    { code: "MANUFACTURER", name: "Manufacturer", description: "Manufacturers and providers of products.", field: "manufacturer" },
    { code: "SALES-UNIT", name: "Sales Unit", description: "Units used when selling products.", field: "salesUnit" },
  ] as const;
  for (const { field, ...list } of lists) {
    upsertProductConfiguration(organizationId, "lists", {
      ...list, values: [...new Set(products.map((product) => product[field]))].sort(), status: "ACTIVE",
    });
  }
  for (const category of new Set(products.map((product) => product.category))) {
    upsertProductConfiguration(organizationId, "categories", {
      code: category.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: category, description: `Products in ${category.toLowerCase()}.`, values: [], status: "ACTIVE",
    });
  }
  for (const category of [{ code: "COFFEE-TEA", name: "Coffee and Tea" }, { code: "ACCESSORIES", name: "Accessories" }, { code: "SERVICES", name: "Services" }]) seedPricingCategory(organizationId, category);
  for (const product of products) {
    const pricingCategoryCode = product.type === "Service" ? "SERVICES" : product.category === "Coffee & Tea" ? "COFFEE-TEA" : "ACCESSORIES";
    await upsertSampleProduct(organizationId, { ...product, pricingCategoryCode });
  }
}

export default sampleData;
