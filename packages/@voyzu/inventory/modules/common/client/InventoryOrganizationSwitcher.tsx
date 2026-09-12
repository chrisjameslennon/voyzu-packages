"use client";

import { useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/erp-core/exports/components";

export function InventoryOrganizationSwitcher({ isCollapsed }: { isCollapsed: boolean; }) {
  const router = useRouter();
  return <OrganizationSwitcher
    isCollapsed={isCollapsed}
    onSelected={() => {
      router.push("/inventory/items");
      router.refresh();
    }}
  />;
}
