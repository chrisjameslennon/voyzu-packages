"use client";

import { Badge } from "@voyzu/ui-components";

export interface CompanySettingsTitleBadgesProps {
  showOrganizationBaseSettings: boolean;
  showArchived: boolean;
  showReadOnly: boolean;
}

export function CompanySettingsTitleBadges({
  showOrganizationBaseSettings,
  showArchived,
  showReadOnly,
}: CompanySettingsTitleBadgesProps) {
  return (
    <>
      {showOrganizationBaseSettings ? (
        <Badge variant="soft" size="x-small" color="neutral" icon="link">
          Organization base settings
        </Badge>
      ) : null}
      {showArchived ? (
        <Badge variant="soft" size="x-small" color="neutral" icon="inactive_order">
          ARCHIVED
        </Badge>
      ) : null}
      {showReadOnly ? (
        <Badge variant="soft" size="x-small" color="info" icon="lock">
          Read only
        </Badge>
      ) : null}
    </>
  );
}
