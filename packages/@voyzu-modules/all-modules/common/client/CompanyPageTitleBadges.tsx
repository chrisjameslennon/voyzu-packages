"use client";

import { createContext, useContext, type ReactNode } from "react";

import { Badge } from "@voyzu/ui-components";

const CompanyPageStateContext = createContext(false);

export interface CompanyPageStateProviderProps {
  archived: boolean;
  children: ReactNode;
}

export function CompanyPageStateProvider({ archived, children }: CompanyPageStateProviderProps) {
  return (
    <CompanyPageStateContext.Provider value={archived}>
      {children}
    </CompanyPageStateContext.Provider>
  );
}

export function CompanyPageTitleBadges() {
  const archived = useContext(CompanyPageStateContext);

  if (!archived) return null;

  return (
    <>
      <Badge variant="soft" size="x-small" color="neutral" icon="inactive_order">
        ARCHIVED
      </Badge>
      <Badge variant="soft" size="x-small" color="info" icon="lock">
        Read only
      </Badge>
    </>
  );
}
