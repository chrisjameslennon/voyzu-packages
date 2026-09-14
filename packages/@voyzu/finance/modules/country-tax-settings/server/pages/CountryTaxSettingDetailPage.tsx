import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";
import { notFound } from "next/navigation";
import { CountryTaxSettingDetail } from "../../client/index";
import { getCountryTaxSetting } from "../lib/country-tax-setting.service";

export async function CountryTaxSettingDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const country = await getCountryTaxSetting((code));
  if (!country) notFound();
  return <CountryTaxSettingDetail country={country} />;
}
