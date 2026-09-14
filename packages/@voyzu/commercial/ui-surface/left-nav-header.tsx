"use client";

import type { UiSurfaceHeaderProps } from "@voyzu/types/ui-surface";
import { CommercialOrganizationSwitcher } from "../modules/shared/client/CommercialOrganizationSwitcher";


export default function CommercialLeftNavHeader({ presentation }: UiSurfaceHeaderProps) {
  return <CommercialOrganizationSwitcher isCollapsed={presentation === "collapsed"} />;
}
