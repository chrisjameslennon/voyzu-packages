import "server-only";

import { ComponentSlot } from "@voyzu/ui-surface/server";

export function CountryTaxSettingDetailSlotPage({ code }: { code?: string }) {
  return <ComponentSlot id="settings.country-tax-settings" code={code} />;
}
