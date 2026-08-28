export const install = {
  sql: [
    "./install/db/sql/inventory.sql",
    "./install/db/sql/inventory-organization-scope.sql",
    "./install/db/sql/inventory-unit-nullable.sql",
  ],
} as const;
