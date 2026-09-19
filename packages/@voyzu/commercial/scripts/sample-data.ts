import { getCustomerConfiguration, saveCustomerConfiguration, transitionCustomerConfiguration } from "../modules/customers/server/lib/customer-configuration.service";
import { emptyCustomer, emptyAddress } from "../modules/customers/types/customer.dto";
import { getCustomer, saveCustomer, transitionCustomers } from "../modules/customers/server/lib/customer.service";
import { seedPricingCategory } from "../modules/product-pricing-categories/server/lib/pricing-category.service";
import { internalApi } from "@voyzu/capability/internal-api";
import { getProduct, upsertSampleProduct } from "../modules/products/server/lib/product.service";
import { loadInventoryItems, saveInventoryLinks } from "../modules/products/server/lib/product-inventory.service";
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
  seedSampleCustomers(organization.organization_id);
  console.log(`Commercial sample data ready for TESTCO: ${products.length} products and 3 customers in this process's memory.`);
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
  const inventoryItems = await loadInventoryItems(organizationId);
  for (const product of products) {
    const pricingCategoryCode = product.type === "Service" ? "SERVICES" : product.category === "Coffee & Tea" ? "COFFEE-TEA" : "ACCESSORIES";
    const descriptions: Record<string, string> = {
      COFFEE: "A balanced whole-bean blend with chocolate and caramel notes. Roasted for espresso and filter brewing.",
      BOX: "A protective shipping box for coffee gifts and accessories. Supplied flat for easy storage.",
      GIFT: "A selection of coffee and accessories, packaged together for gifting.",
      MUG: "A ceramic mug for everyday coffee and tea. Dishwasher safe.",
      FILTER: "A reusable filter for pour-over coffee. Rinse after use and allow to dry.",
      TEA: "Black tea blended with bergamot for a classic Earl Grey flavour.",
      BOTTLE: "A reusable insulated bottle for hot and cold drinks. Hand wash recommended.",
      DELIVERY: "Local delivery of your order to an address within our delivery area.",
      TRAINING: "A practical barista training session covering espresso preparation and milk texturing.",
      APRON: "A durable canvas apron with useful pockets for cafe and workshop use.",
    };
    await upsertSampleProduct(organizationId, { ...product, pricingCategoryCode, sampleDetails: {
      shortDescription: descriptions[product.code].split(". ")[0] + ".",
      description: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: descriptions[product.code] }] }] },
      customFields: product.type === "Service" ? [{ name: "Booking required", value: product.code === "TRAINING" ? "Yes" : "No" }] : [{ name: "Care instructions", value: product.code === "MUG" ? "Dishwasher safe" : product.code === "BOTTLE" ? "Hand wash" : "Store in a cool, dry place" }],
    } });
    const item = inventoryItems?.find((item) => item.status === "ACTIVE" && item.sku.toUpperCase() === product.code);
    if (item) { const saved = await getProduct(organizationId, product.code); if (saved) saveInventoryLinks(organizationId, product.code, { [saved.variants[0].id]: item.id }); }
  }
}

export default sampleData;

/** Inserts or replaces sample customers by code, preserving their identities. */
export function seedSampleCustomers(organizationId: number): void {
  for (const [kind, rows] of [
    ["categories", [
      { code: "HOSPITALITY", name: "Hospitality", description: "Cafes and hospitality businesses.", direction: "decrease", method: "percentage", value: 0 },
      { code: "CORPORATE", name: "Corporate", description: "Office and business customers.", direction: "decrease", method: "percentage", value: 0 },
      { code: "RETAIL", name: "Retail", description: "Retail businesses.", direction: "decrease", method: "percentage", value: 0 },
    ]],
    ["priceLists", [
      { code: "STANDARD", name: "Standard", description: "Standard customer pricing.", direction: "decrease", method: "percentage", value: 0 },
      { code: "PREFERRED", name: "Preferred", description: "Preferred customer discount.", direction: "decrease", method: "amount", value: 5 },
      { code: "WHOLESALE", name: "Wholesale", description: "Wholesale customer discount.", direction: "decrease", method: "percentage", value: 10 },
      { code: "PREMIUM", name: "Premium", description: "Premium service pricing.", direction: "increase", method: "percentage", value: 5 },
      { code: "HANDLING", name: "Handling", description: "Fixed handling adjustment.", direction: "increase", method: "amount", value: 2 },
    ]],
  ] as const) {
    for (const row of rows) {
      const current = getCustomerConfiguration(organizationId, kind, row.code);
      saveCustomerConfiguration(organizationId, kind, row, current?.code);
      transitionCustomerConfiguration(organizationId, kind, [row.code], "activate");
    }
  }
  const samples = [
    { code: "HARBOUR-CAFE", name: "Harbour Cafe", primaryContactName: "Alex Morgan", email: "alex@harbour-cafe.example", city: "Auckland", region: "Auckland", postal: "1010", street: "12 Sample Street", status: "ACTIVE" },
    { code: "CITY-OFFICES", name: "City Offices", primaryContactName: "Sam Taylor", email: "sam@city-offices.example", city: "Wellington", region: "Wellington", postal: "6011", street: "24 Example Road", status: "ACTIVE" },
    { code: "GARDEN-STORE", name: "Garden Store", primaryContactName: "Jamie Lee", email: "jamie@garden-store.example", city: "Christchurch", region: "Canterbury", postal: "8011", street: "36 Demo Lane", status: "INACTIVE" },
  ] as const;
  for (const sample of samples) {
    const postal = { ...emptyAddress("POSTAL"), address_line_1: sample.street, city: sample.city, region_or_state: sample.region, postal_code: sample.postal, country_code: "NZ" };
    const current = getCustomer(organizationId, sample.code);
    saveCustomer(organizationId, { ...emptyCustomer(), code: sample.code, name: sample.name, primaryContactName: sample.primaryContactName, email: sample.email,
      categoryCode: sample.code === "HARBOUR-CAFE" ? "HOSPITALITY" : sample.code === "CITY-OFFICES" ? "CORPORATE" : "RETAIL",
      priceListCode: sample.code === "HARBOUR-CAFE" ? "WHOLESALE" : sample.code === "CITY-OFFICES" ? "PREFERRED" : "STANDARD",
      usePostalAddressForShipping: sample.code === "HARBOUR-CAFE",
      addresses: [postal, { ...postal, address_type: "SHIPPING", address_line_2: "Deliver to reception" }],
      notes: "Sample customer for the Commercial prototype.",
    }, current?.code);
    transitionCustomers(organizationId, [sample.code], sample.status === "ACTIVE" ? "activate" : "deactivate");
  }
}
