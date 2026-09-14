"use client";

import type { UiSurfaceHeaderProps } from "@voyzu/types/ui-surface";

import { InventoryOrganizationSwitcher } from "../modules/common/client";


export default function InventoryLeftNavHeader({ presentation }: UiSurfaceHeaderProps) {
  return <InventoryOrganizationSwitcher isCollapsed={presentation === "collapsed"} />;
}
