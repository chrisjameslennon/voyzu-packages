"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationSelectionResponseDto } from "@voyzu/erp-core/types/modules/organization-switcher";
import type { OrganizationSelectionUpdateRequestDto } from "@voyzu/erp-core/organization-switcher/types";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { getAvatarColor } from "@voyzu/erp-core/common/client";

import localStyles from "./finance-company-switcher.module.css";

interface FinanceCompanySwitcherProps {
  isCollapsed: boolean;
  isTemplateMode?: boolean;
  companyPath?: string;
  templatePath?: string;
}

export function FinanceCompanySwitcher({
  isCollapsed,
  isTemplateMode = false,
  companyPath = "/finance/journals",
  templatePath = "/finance",
}: FinanceCompanySwitcherProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [companies, setCompanies] = useState<OrganizationResponseDto[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<OrganizationResponseDto | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingCompanyId, setIsSelectingCompanyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizationSelection() {
      try {
        const selectionResponse = await fetch("/api/finance/company-selection");
        const selectionData = selectionResponse.ok
          ? await selectionResponse.json() as OrganizationSelectionResponseDto
          : { organizations: [], selectedOrganization: null, selectedOrganizationId: null };

        if (cancelled) return;

        setCompanies(selectionData.organizations);
        setSelectedCompany(selectionData.selectedOrganization ?? selectionData.organizations[0] ?? null);
      } catch {
        if (!cancelled) {
          setCompanies([]);
          setSelectedCompany(null);
        }
      }
    }

    void loadOrganizationSelection();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const displayName = isTemplateMode ? "Finance Admin" : selectedCompany?.name ?? "Select Financial Entity";

  const selectCompany = async (company: OrganizationResponseDto) => {
    setIsSelectingCompanyId(company.id);

    try {
      const response = await fetch("/api/finance/company-selection", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId: company.id } satisfies OrganizationSelectionUpdateRequestDto),
      });

      if (!response.ok) return;

      setSelectedCompany(company);
      setIsOpen(false);
      router.push(companyPath);
    } finally {
      setIsSelectingCompanyId(null);
    }
  };

  return (
    <div ref={rootRef} className={`${localStyles.context} ${isCollapsed ? localStyles.contextCollapsed : ""}`}>
      {!isCollapsed && <div className={localStyles.label}>Financial Entity</div>}
      <button
        className={`${localStyles.trigger} ${isCollapsed ? localStyles.triggerCollapsed : ""}`}
        type="button"
        title={isCollapsed ? displayName : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={localStyles.triggerLeft}>
          <span
            className={`${localStyles.dot} ${isTemplateMode ? localStyles.dotTemplate : selectedCompany?.status === "INACTIVE" ? localStyles.dotArchived : ""}`}
          />
          {!isCollapsed && <span className={localStyles.name}>{displayName}</span>}
        </span>
        {!isCollapsed && (
          <span className={`material-symbols-outlined ${localStyles.chevron} ${isOpen ? localStyles.chevronOpen : ""}`}>
            expand_more
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`${localStyles.panel} ${isCollapsed ? localStyles.panelCollapsed : ""}`}>
          <button
            className={localStyles.templateOption}
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push(templatePath);
            }}
          >
            <span className={`material-symbols-outlined ${localStyles.templateIcon}`}>account_balance</span>
            <span className={localStyles.optionContent}>
              <span className={localStyles.optionName}>Finance Admin</span>
              <span className={localStyles.optionMeta}>Manage financial entities and the financial template</span>
            </span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className={localStyles.panelDivider} />
          <div className={localStyles.panelLabel}>Select Financial Entity</div>
          <div className={localStyles.grid}>
            {companies.map((company) => {
              const isActive = !isTemplateMode && selectedCompany?.id === company.id;
              const color = getAvatarColor(company.code);
              return (
                <button
                  key={company.id}
                  className={`${localStyles.option} ${isActive ? localStyles.optionActive : ""}`}
                  type="button"
                  disabled={isSelectingCompanyId !== null}
                  onClick={() => void selectCompany(company)}
                >
                  <span
                    className={localStyles.avatar}
                    style={{ backgroundColor: color.bg, color: color.fg }}
                  >
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                  <span className={localStyles.optionContent}>
                    <span className={localStyles.optionName}>{company.name}</span>
                    <span className={localStyles.optionMeta}>{company.code} - {company.baseCurrencyCode}</span>
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
