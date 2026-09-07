// Only the Inventory-specific company/warehouse arrangement remains local.
export const stockCountReportCss = `
.inventoryDocumentCompany { grid-column: 1 / 7; min-width: 0; }
.inventoryDocumentWarehouse { grid-column: 7 / 13; min-width: 0; }
`;
export const stockCountReportStyles = {
  topCompany: "inventoryDocumentCompany",
  topWarehouse: "inventoryDocumentWarehouse",
} as const;
