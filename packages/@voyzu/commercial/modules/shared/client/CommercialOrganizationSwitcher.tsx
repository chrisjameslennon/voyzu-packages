"use client";

import { useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/erp-core/exports/components";

export function CommercialOrganizationSwitcher({ isCollapsed }: { isCollapsed: boolean; }) {
  const router = useRouter();
  return <OrganizationSwitcher
    isCollapsed={isCollapsed}
    onSelected={() => {
      router.push("/commercial/products");
      router.refresh();
    }}
  />;
}
