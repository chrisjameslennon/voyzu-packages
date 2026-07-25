"use client";

import { Alert } from "@voyzu/ui-components";

export function StandardSettingsReadOnlyAlert() {
  return (
    <Alert
      variant="soft"
      color="info"
      title="Organization standard settings are enabled"
      text="This company uses organization standard settings, so settings are read only here."
      dismissable
    />
  );
}
