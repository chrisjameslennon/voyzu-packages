import "server-only";
import { notFound } from "next/navigation";
import { CountryTaxSettingDetail } from "../../client";
import { getCountryTaxSetting } from "../lib/country-tax-setting.service";

export async function CountryTaxSettingDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const country = await getCountryTaxSetting(decodeURIComponent(code));
  if (!country) notFound();
  return <CountryTaxSettingDetail country={country} />;
}
