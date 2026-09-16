# @voyzu/commercial

Commercial navigation and page shells for Customers, Suppliers, Sales, Purchasing, Products and Settings.

This prototype includes an organization-scoped Products list backed by an in-memory map. The Commercial top navigation opens Dashboard at `/commercial`, also the first left-menu item.

## Product sample data

The package-root `scripts/sample-data.ts` script is registered as `sampleData`, matching Inventory and Finance:

```shell
npm run voyzu:run-script @voyzu/commercial sampleData
```

It reads the existing active TESTCO organization through the internal API and adds the ten original demonstration products, including a default variant and the original product base price. Repeat runs replace matching products by code, including category, brand, sales unit, status and base price, while retaining IDs and creation dates. It does not create inventory links or write to the database.

Prototype data lives only in the invoking process. The CLI command cannot seed a separately running web server, and its data disappears when the command exits. Dashboard's **Add sample data** button runs the same seed function inside the web process for the selected organization. It refreshes Dashboard and Products, inserting missing sample products and replacing matching products by code. Web-process data lasts until the server restarts.

## Dashboard

Five compact number panels show Orders, Customer change, Purchase orders, Active products, and Quotes issued without charts. Panels use light borders and centered, coloured monospace numbers with slashed zeros. Each panel uses the shared dropdown menu to select the last seven days or this calendar month. Active products shows the current total and additions since the period began. Other metrics remain zero until their prototype activity is implemented. No internal API contracts are added or changed.

Each capability owns its module manifest, lightweight page routes and lazy server pages. Navigation references route IDs. The shared platform supplies the application frame, authentication, breadcrumbs and responsive navigation. Only required host libraries are declared as peer dependencies.

Follow the Voyzu platform package and module contracts when extending these modules. Add client components, DTOs, services, persistence and lifecycle resources as capabilities need them. Keep route IDs stable; do not edit generated runtime files.

## Development

### Product detail prototype

Open a product from the Products list to edit it at `/commercial/products/[code]`. Details, Images, Variants, Pricing and Custom Fields each have their own Save action, saving only that tab into the selected organization's in-memory store. The header provides Back, Activate, Deactivate and Delete. Product codes remain fixed. Brand, manufacturer, sales unit and category selectors use the seeded reference data.

The Variants tab flows from Use Variants to Product Options and then the variant matrix. Turning Use Variants off hides the configuration and uses the default variant; existing combinations are retained as inactive records. Options can use shared option lists or product-specific values. Add/Edit Option opens a modal; the Variants tab keeps the matrix on the page. Generation retains matching variant IDs and marks obsolete combinations inactive. Individual variants must use the configured dimensions. Save validates the request and basic combination, SKU and primary-image rules. Pricing uses a single basePrice and an optional pricingCategoryCode for bulk adjustments, with no product price list or pricing matrix; custom fields are simple editable rows for the prototype; inventory relationships and full variant business rules remain deferred.

The sample-data action also upserts Colours and Sizes for the shared option selector. It replaces sample products, so rerunning it resets edits to those sample records. No internal API definitions or database tables are changed. Chokidar handles development updates.

### Product reference data

Products supports Physical, Service and Other types. The list shows Number of Variants in place of Sales Unit; current sample products each have one default variant.

Under Products, **Manage Lists** (`/commercial/products/manage-lists`) lists Brand, Manufacturer and Sales Unit with their values and counts. **Product Categories** (`/commercial/products/product-categories`) lists categories and product counts. Both screens use organization-scoped in-memory services and the standard list controls.

Run **Add sample data** again from Dashboard to upsert the three reference lists, eight categories and ten products. BOX and GIFT demonstrate the Other type. Sales unit and manufacturer remain stored product attributes. New-screen Add buttons are prototype controls; creation and editing are not implemented yet.

From the development workspace root, link with `npm run voyzu:link-package @voyzu/commercial`. For subsequent changes, compose using `npm run voyzu:compose -- --no-install` and restart the development server when required.

## Product pricing categories

The product-pricing-categories module uses organization-scoped in-memory storage. Its list supports create/edit, activation, deactivation, deletion, search, status filtering, selection, refresh and export. Codes are stable and unique; categories assigned to products cannot be deleted.

Assign a category on a product's Pricing tab. Counts include active and inactive products. View Products opens the products list with selected pricing categories checked and all statuses included, so the list matches those counts. Pricing Category is a filter, not a product list column.

Add sample data upserts Coffee and Tea, Accessories, and Services pricing categories and assigns the ten sample products to them.

## Product screen completion

Products has a Create Product modal and list activation, deactivation and deletion actions. Product Categories and Product Option Lists have create modals. These screens and Manage Lists have detail routes, status actions, audit panels and usage displays. Manage Lists only edits the built-in Brand, Manufacturer and Sales Unit lists; creating additional lists is not supported. List values can be added, edited and removed, then persisted with Save. Used values cannot be renamed or removed, and referenced categories/lists cannot be deactivated or deleted. Renaming a product category preserves its product assignments. Brand, Manufacturer and Sales Unit remain required lists.

Sample data upserts descriptive product content and custom fields, shared values, categories and pricing assignments. Variants remain off and pricing defaults to the product base price. Existing active Inventory items are linked only when their SKU matches the sample product code; no inventory records are created. Images remain user-supplied paths. The legacy Product Options route redirects to Product Option Lists.

## Customer prototype

Customers have organization-scoped in-memory CRUD at /commercial/customers, independent of Party and the composed customer internal API. Fields are code, name, status, primary contact name, email, notes, and an addresses array. Addresses have an address_type (PRIMARY, SHIPPING, POSTAL) plus address_line_1, address_line_2, city, region_or_state, postal_code and country_code. Country codes use two uppercase letters. Code is immutable after creation. The detail page uses the shared status and audit panels; audit events and database persistence are deferred until after prototyping.

The standard sample-data script and dashboard button upsert three customers, including contact details, all address types and an inactive customer. Records reset with the server process.

Customer Categories and Customer Price Lists provide in-memory CRUD, status filtering, bulk actions, export, customer counts and linked-customer detail sections. Customers store categoryCode and priceListCode; selectors allow active references and retain current selections. In-use records cannot be deleted or deactivated. Customer price lists store an increase/decrease rule by percentage or amount, with two-decimal precision. Percentage decreases cannot exceed 100%. The customer-pricing service applies the saved rule to a resolved product or variant base price on demand, rounds to two decimals, and rejects negative results without changing product base prices. Sales screens can consume this service when implemented. Existing composed customer/price-list internal API contracts remain unchanged. The sample-data script upserts three categories and five price lists and links the three sample customers.
