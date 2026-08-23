"use client";

import { Alert } from "@voyzu/ui-components";

export function StandardSettingsReadOnlyAlert() {
  return (
    <Alert
      variant="soft"
      color="info"
      title="Finance template settings are enabled"
      text="This company uses finance template settings, so settings are read only here."
      dismissable
    />
  );
}
