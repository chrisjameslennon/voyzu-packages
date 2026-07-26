"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AuditPanel, type AuditPanelProps } from "@voyzu-modules/all-modules/common/client";
import { detailLinkWithBackContext } from "@voyzu/ui-surface/client";

interface CompanyAuditPanelProps extends Omit<AuditPanelProps, "onNavigate"> {
  mutationId?: string | null;
}

function withMutationId(auditHref: string | undefined, mutationId: string | null | undefined) {
  if (!auditHref || !mutationId) return auditHref;
  const [path] = auditHref.split("?");
  return `${path}?mutationId=${encodeURIComponent(mutationId)}`;
}

async function latestMutationId(auditHref: string): Promise<string | null> {
  const response = await fetch(`/api${auditHref.startsWith("/") ? auditHref : `/${auditHref}`}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;
  const payload = await response.json() as { items?: Array<{ mutationId?: string | null }> };
  return payload.items?.find((item) => item.mutationId)?.mutationId ?? null;
}

export function CompanyAuditPanel({ auditHref, mutationId, ...props }: CompanyAuditPanelProps) {
  const router = useRouter();
  const pathname = usePathname();

  const resolveHref = useCallback((href: string, resolvedMutationId?: string | null) => {
    const target = withMutationId(href, resolvedMutationId);
    return target ? detailLinkWithBackContext(target, "companyAudit", pathname) : undefined;
  }, [pathname]);

  const targetHref = auditHref ? resolveHref(auditHref, mutationId) : undefined;

  const navigateToAudit = useCallback(async (href: string) => {
    if (!auditHref || mutationId) {
      router.push(href);
      return;
    }
    const resolvedMutationId = await latestMutationId(auditHref);
    router.push(resolveHref(auditHref, resolvedMutationId) ?? href);
  }, [auditHref, mutationId, resolveHref, router]);

  return <AuditPanel {...props} auditHref={targetHref} onNavigate={navigateToAudit} />;
}
