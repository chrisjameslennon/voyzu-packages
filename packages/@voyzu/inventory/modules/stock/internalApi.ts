export const implementations = {
  "@erp/stock-activity": () => import("./server/lib/inventory-activity.provider").then(m => ({ methods: {
    get: ({ id }: { id: number }) => m.get(id),
    byCode: ({ organization_id, code }: { organization_id: number; code: string }) => m.byCode({ organizationId: organization_id, code }),
  } })),
};
