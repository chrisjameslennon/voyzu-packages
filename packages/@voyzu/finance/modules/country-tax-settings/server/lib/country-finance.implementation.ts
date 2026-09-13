import type { CountryFinanceMethods } from "@voyzu/types/business-objects/country-finance";
import { getCountryTaxSetting } from "./country-tax-setting.service";
export const countryFinanceMethods = {
  async get({ code }) {
    const value = await getCountryTaxSetting(code);
    if (!value) return null;
    const { financialPeriodStartMonth, taxFilingAnchorMonth, taxFilingIntervalMonths, taxAuthorities, taxRules, taxComponents } = value;
    return { code: value.code, financialPeriodStartMonth, taxFilingAnchorMonth, taxFilingIntervalMonths, taxAuthorities, taxRules, taxComponents };
  },
} satisfies CountryFinanceMethods;
