import "server-only";
import { CountryTaxSettingsList } from "../../client";
import { listCountryTaxSettings } from "../lib/country-tax-setting.service";

export async function CountryTaxSettingsListPage() {
  return <CountryTaxSettingsList initialCountries={await listCountryTaxSettings()} />;
}
