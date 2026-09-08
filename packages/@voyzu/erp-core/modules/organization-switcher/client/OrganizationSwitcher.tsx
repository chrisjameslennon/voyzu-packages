"use client";

import { useEffect, useState } from "react";
import type { OrganizationSwitcherProps } from "@voyzu/ui-surface/types";
import { ContextSwitcher } from "@voyzu/ui-components";
import type { OrganizationSelectionUpdateRequestDto } from "../types";
import type { OrganizationSelectionResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

export function OrganizationSwitcher({ isCollapsed, selectionUrl = "/api/organization-selection", onSelected }: OrganizationSwitcherProps) {
  const [organizations, setOrganizations] = useState<OrganizationResponseDto[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResponseDto | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSelection() {
      try {
        const response = await fetch(selectionUrl);
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
  }, [selectionUrl]);

  const selectOrganization = async (organization: OrganizationResponseDto) => {
    const response = await fetch(selectionUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: organization.id } satisfies OrganizationSelectionUpdateRequestDto),
    });
    if (!response.ok) return false;

    setSelectedOrganization(organization);
    onSelected?.(organization.id);
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
