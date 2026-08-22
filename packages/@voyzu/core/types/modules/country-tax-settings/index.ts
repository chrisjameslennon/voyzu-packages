export {
  CountryTaxAuthorityResponseDto,
  CountryTaxComponentResponseDto,
  CountryTaxRuleResponseDto,
  CountryTaxSettingResponseDto,
} from "./country-tax-setting.response.dto";
import type { CountryTaxSettingResponseDto } from "./country-tax-setting.response.dto";

export type CountryTaxSetting = CountryTaxSettingResponseDto & { id: string };
