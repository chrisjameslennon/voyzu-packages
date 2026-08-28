"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";

import { InventoryCompanySwitcher } from "../modules/common/client";

export const leftNavHeaderRootPaths = ["/inventory"] as const;

export default function InventoryLeftNavHeader({ isCollapsed }: VoyzuSurfaceLeftNavHeaderProps) {
  return <InventoryCompanySwitcher isCollapsed={isCollapsed} />;
}
