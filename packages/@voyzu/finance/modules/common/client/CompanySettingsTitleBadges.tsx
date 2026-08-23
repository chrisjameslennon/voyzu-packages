"use client";

import { Badge } from "@voyzu/ui-components";

export interface CompanySettingsTitleBadgesProps {
  showFinanceTemplateSettings: boolean;
  showArchived: boolean;
  showReadOnly: boolean;
}

export function CompanySettingsTitleBadges({
  showFinanceTemplateSettings,
  showArchived,
  showReadOnly,
}: CompanySettingsTitleBadgesProps) {
  return (
    <>
      {showFinanceTemplateSettings ? (
        <Badge variant="soft" size="x-small" color="neutral" icon="link">
          Finance template settings
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
