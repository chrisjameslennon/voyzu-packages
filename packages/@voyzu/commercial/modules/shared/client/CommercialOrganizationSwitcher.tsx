"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContextSwitcher } from "@voyzu/ui-components";
import type { OrganizationSelectionUpdateRequestDto } from "@voyzu/erp-core/organization-switcher/types";
import type { OrganizationSelectionResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

export function CommercialOrganizationSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationResponseDto[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResponseDto | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSelection() {
      try {
        const response = await fetch("/api/organization-selection");
        const selection = response.ok
          ? await response.json() as OrganizationSelectionResponseDto
          : { organizations: [], selectedOrganization: null, selectedOrganizationId: null };

        if (!cancelled) {
          setOrganizations(selection.organizations);
          setSelectedOrganization(selection.selectedOrganization ?? selection.organizations[0] ?? null);
        }
      } catch {
        if (!cancelled) {
          setOrganizations([]);
          setSelectedOrganization(null);
        }
      }
    }

    void loadSelection();
    return () => { cancelled = true; };
  }, []);

  const selectOrganization = async (organization: OrganizationResponseDto) => {
    const response = await fetch("/api/organization-selection", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: organization.id } satisfies OrganizationSelectionUpdateRequestDto),
    });
    if (!response.ok) return false;

    setSelectedOrganization(organization);
    router.push("/commercial/products");
    router.refresh();
  };

  return (
    <ContextSwitcher
      label="Organization"
      collapsed={isCollapsed}
      selectedId={selectedOrganization ? String(selectedOrganization.id) : null}
      options={organizations.map((organization) => ({
        id: String(organization.id),
        name: organization.name,
        subtitle: `${organization.code} - ${organization.baseCurrencyCode}`,
        inactive: organization.status === "INACTIVE",
      }))}
      onSelect={(id) => {
        const organization = organizations.find((candidate) => String(candidate.id) === id);
        return organization ? selectOrganization(organization) : false;
      }}
    />
  );
}
