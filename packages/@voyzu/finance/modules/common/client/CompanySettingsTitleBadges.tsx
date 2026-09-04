"use client";

import { Badge } from "@voyzu/ui-components";

export interface CompanySettingsTitleBadgesProps {
  showArchived: boolean;
  showReadOnly: boolean;
}

export function CompanySettingsTitleBadges({
  showArchived,
  showReadOnly,
}: CompanySettingsTitleBadgesProps) {
  return (
    <>
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
