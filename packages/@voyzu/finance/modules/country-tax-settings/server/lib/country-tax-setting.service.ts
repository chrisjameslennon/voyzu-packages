import "server-only";

import { getDb } from "@voyzu/capability/db";
import type { CountryTaxSetting } from "@voyzu/finance/types/modules/country-tax-settings";
import { CountryTaxSettingRepo } from "../db/country-tax-setting.repo";

export async function listCountryTaxSettings(): Promise<CountryTaxSetting[]> {
  return new CountryTaxSettingRepo(getDb()).list();
}

export async function getCountryTaxSetting(code: string): Promise<CountryTaxSetting | null> {
  return new CountryTaxSettingRepo(getDb()).get(code.trim().toUpperCase());
}
