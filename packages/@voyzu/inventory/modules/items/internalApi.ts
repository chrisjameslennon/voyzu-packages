export const implementations = {
  "@erp/inventory-item": () => import("./server/lib/inventory-catalog.provider").then(m => ({ methods: {
    availabilityByOrganization: ({ organization_id }: { organization_id: number }) => m.availabilityByOrganization({ organizationId: organization_id }),
    get: ({ id }: { id: number }) => m.get(id),
    byOrganization: ({ organization_id }: { organization_id: number }) => m.byOrganization({ organizationId: organization_id }),
  } })),
  "@erp/inventory-item-operational": () => import("./server/lib/inventory-catalog.provider").then(m => ({ methods: {
    get: ({ id }: { id: number }) => m.getOperational(id),
    bySkus: ({ organization_id, skus }: { organization_id: number; skus: string[] }) => m.bySkus({ organizationId: organization_id, skus }),
  } })),
};
