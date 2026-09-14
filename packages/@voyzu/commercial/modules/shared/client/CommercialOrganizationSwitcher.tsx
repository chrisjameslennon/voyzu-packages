"use client";

import { useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@voyzu/ui-business-components";

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
