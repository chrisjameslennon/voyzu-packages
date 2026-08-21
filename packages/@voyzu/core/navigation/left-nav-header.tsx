"use client";

import type { VoyzuSurfaceLeftNavHeaderProps } from "@voyzu/ui-surface/types";
import { CompanySwitcher } from "@voyzu/organization/company-switcher/client";

export const leftNavHeaderRootPaths = ["/finance"] as const;

export default function CoreLeftNavHeader({ isCollapsed }: VoyzuSurfaceLeftNavHeaderProps) {
  return <CompanySwitcher isCollapsed={isCollapsed} />;
}
