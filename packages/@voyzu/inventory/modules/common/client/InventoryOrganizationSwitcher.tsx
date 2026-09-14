"use client";

import { useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/ui-business-components";

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
