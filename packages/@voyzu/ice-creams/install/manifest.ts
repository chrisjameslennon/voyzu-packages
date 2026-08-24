export const install = {
  sql: [
    "./install/db/sql/ice-cream-flavor.sql",
    "./install/db/sql/ice-cream.sql",
  ],
  seedSql: [
    "./install/db/seed/ice-cream-flavor.seed.sql",
    "./install/db/seed/ice-cream.seed.sql",
  ],
} as const;
