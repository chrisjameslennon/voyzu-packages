export const implementations = {
  "@erp/inventory-finance": () => import("./server/lib/inventory-finance.provider").then(m => ({ methods: {
    processInventoryMovement: ({ organization_id, movement }: { organization_id: number; movement: Parameters<typeof m.processInventoryMovement>[0]["movement"] }) =>
      m.processInventoryMovement({ organizationId: organization_id, movement }),
  }, transactionalMethods: ["processInventoryMovement"] })),
};
