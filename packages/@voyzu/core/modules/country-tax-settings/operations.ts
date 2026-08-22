import "server-only";
import * as service from "./server/lib/country-tax-setting.service";

export const listCountryTaxSettings = (...args: Parameters<typeof service.listCountryTaxSettings>) => service.listCountryTaxSettings(...args);
export const getCountryTaxSetting = (...args: Parameters<typeof service.getCountryTaxSetting>) => service.getCountryTaxSetting(...args);
export const operations = { listCountryTaxSettings, getCountryTaxSetting } as const;
