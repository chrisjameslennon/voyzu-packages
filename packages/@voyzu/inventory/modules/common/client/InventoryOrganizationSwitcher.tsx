"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvatarColor } from "@voyzu/erp-core/common/client";
import type { OrganizationSelectionUpdateRequestDto } from "@voyzu/erp-core/organization-switcher/types";
import type { OrganizationSelectionResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

import styles from "./inventory-organization-switcher.module.css";

export function InventoryOrganizationSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [organizations, setOrganizations] = useState<OrganizationResponseDto[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResponseDto | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingOrganizationId, setIsSelectingOrganizationId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const displayName = selectedOrganization?.name ?? "Select Organization";

  const selectOrganization = async (organization: OrganizationResponseDto) => {
    setIsSelectingOrganizationId(organization.id);
    try {
      const response = await fetch("/api/organization-selection", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: organization.id } satisfies OrganizationSelectionUpdateRequestDto),
      });
      if (!response.ok) return;

      setSelectedOrganization(organization);
      setIsOpen(false);
      router.push("/inventory/items");
      router.refresh();
    } finally {
      setIsSelectingOrganizationId(null);
    }
  };

  return (
    <div ref={rootRef} className={`${styles.context} ${isCollapsed ? styles.contextCollapsed : ""}`}>
      {!isCollapsed && <div className={styles.label}>Organization</div>}
      <button
        className={`${styles.trigger} ${isCollapsed ? styles.triggerCollapsed : ""}`}
        type="button"
        title={isCollapsed ? displayName : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.triggerLeft}>
          <span className={`${styles.dot} ${selectedOrganization?.status === "INACTIVE" ? styles.dotArchived : ""}`} />
          {!isCollapsed && <span className={styles.name}>{displayName}</span>}
        </span>
        {!isCollapsed && (
          <span className={`material-symbols-outlined ${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
            expand_more
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`${styles.panel} ${isCollapsed ? styles.panelCollapsed : ""}`}>
          <button
            className={styles.adminOption}
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push("/inventory/admin");
            }}
          >
            <span className={`material-symbols-outlined ${styles.adminIcon}`}>inventory_2</span>
            <span className={styles.optionContent}>
              <span className={styles.optionName}>Inventory Admin</span>
              <span className={styles.optionMeta}>Manage inventory settings</span>
            </span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className={styles.panelDivider} />
          <div className={styles.panelLabel}>Select Organization</div>
          <div className={styles.grid}>
            {organizations.map((organization) => {
              const isActive = selectedOrganization?.id === organization.id;
              const color = getAvatarColor(organization.code);
              return (
                <button
                  key={organization.id}
                  className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
                  type="button"
                  disabled={isSelectingOrganizationId !== null}
                  onClick={() => void selectOrganization(organization)}
                >
                  <span className={styles.avatar} style={{ backgroundColor: color.bg, color: color.fg }}>
                    {organization.name.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.optionContent}>
                    <span className={styles.optionName}>{organization.name}</span>
                    <span className={styles.optionMeta}>{organization.code} - {organization.baseCurrencyCode}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
