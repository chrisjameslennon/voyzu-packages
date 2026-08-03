export const coreUninstall = {
  sql: [
    "./uninstall/db/sql/home-page.remove.sql",
    "./uninstall/db/sql/core-objects.drop.sql",
  ],
} as const;
