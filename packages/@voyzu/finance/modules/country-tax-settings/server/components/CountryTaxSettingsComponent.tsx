import "server-only";

import { CountryTaxSettingDetailPage } from "../pages/CountryTaxSettingDetailPage";
import { CountryTaxSettingsListPage } from "../pages/CountryTaxSettingsListPage";

export function CountryTaxSettingsComponent({ code }: { code?: string }) {
  return code
    ? <CountryTaxSettingDetailPage code={code} />
    : <CountryTaxSettingsListPage />;
}
