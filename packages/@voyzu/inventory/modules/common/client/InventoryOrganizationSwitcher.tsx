"use client";

import { useRouter } from "next/navigation";
import { clientComponent } from "@voyzu/ui-surface/client";

const OrganizationSwitcher = clientComponent.use("erp.organization-switcher");

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
