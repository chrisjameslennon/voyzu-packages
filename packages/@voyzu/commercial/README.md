# @voyzu/commercial

Commercial navigation and page shells for Customers, Suppliers, Sales, Purchasing, Products and Settings.

This initial prototype contains authenticated, empty page shells only. It has no business data, APIs, commands, database installation or sample data. The Commercial top navigation opens Customers.

Each capability owns its module manifest, lightweight page routes and lazy server pages. Navigation references route IDs. The shared platform supplies the application frame, authentication, breadcrumbs and responsive navigation. Only required host libraries are declared as peer dependencies.

Follow the Voyzu platform package and module contracts when extending these modules. Add client components, DTOs, services, persistence and lifecycle resources as capabilities need them. Keep route IDs stable; do not edit generated runtime files.

## Development

From the development workspace root, link with `npm run voyzu:link-package @voyzu/commercial`. For subsequent changes, compose using `npm run voyzu:compose -- --no-install` and restart the development server when required.
