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
