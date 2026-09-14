"use client";
import { OrganizationSwitcher } from "@voyzu/ui-business-components";
import { useRouter } from "next/navigation";
import type { UiSurfaceHeaderProps } from "@voyzu/types/ui-surface";
export default function FinanceHeader({ presentation }: UiSurfaceHeaderProps) {
 const router = useRouter();
 return <OrganizationSwitcher isCollapsed={presentation === "collapsed"} selectionUrl="/api/organization-selection" onSelected={() => router.refresh()} />;
}
