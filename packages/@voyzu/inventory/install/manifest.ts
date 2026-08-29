export const install = {
  sql: [
    "./install/db/sql/inventory.sql",
    "./install/db/sql/inventory-organization-scope.sql",
    "./install/db/sql/inventory-unit-nullable.sql",
    "./install/db/sql/inventory-item-posting-profile.remove.sql",
    "./install/db/sql/inventory-costing.remove.sql",
  ],
} as const;
