"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";
import { CommercialOrganizationSwitcher } from "../modules/shared/client/CommercialOrganizationSwitcher";

export const leftNavHeaderRootPaths = ["/commercial"] as const;

export default function CommercialLeftNavHeader({ isCollapsed }: VoyzuSurfaceLeftNavHeaderProps) {
  return <CommercialOrganizationSwitcher isCollapsed={isCollapsed} />;
}
