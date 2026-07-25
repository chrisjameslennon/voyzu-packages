export interface SampleCompanyConfig {
  companyCode: string;
  countryCode: string;
  stateOrProvinceCode: string | null;
  currencyCode: string;
  standardTaxRule: string;
  zeroRatedTaxRule: string;
  exemptTaxRule: string;
  taxAuthorityCode: string;
  bankTxPrefix: string;
}

export const SAMPLE_POSTING_COMPANIES: SampleCompanyConfig[] = [
  {
    companyCode: "SAMP-NZ",
    countryCode: "NZ",
    stateOrProvinceCode: null,
    currencyCode: "NZD",
    standardTaxRule: "NZ_STANDARD",
    zeroRatedTaxRule: "NZ_ZERO_RATED",
    exemptTaxRule: "NZ_EXEMPT",
    taxAuthorityCode: "IRD",
    bankTxPrefix: "ASB",
  },
  {
    companyCode: "SAMP-CA",
    countryCode: "CA",
    stateOrProvinceCode: "BC",
    currencyCode: "CAD",
    standardTaxRule: "CA_BC_STANDARD",
    zeroRatedTaxRule: "CA_ZERO_RATED",
    exemptTaxRule: "CA_EXEMPT",
    taxAuthorityCode: "CA_CRA",
    bankTxPrefix: "RBC",
  },
];

export function standardGross(netAmount: number, config: SampleCompanyConfig): number {
  const rate = config.companyCode === "SAMP-CA" ? 1.12 : 1.15;
  return Number((netAmount * rate).toFixed(2));
}

export function localizeTaxRule(taxRule: string, config: SampleCompanyConfig): string {
  if (taxRule === "NZ_STANDARD") return config.standardTaxRule;
  if (taxRule === "NZ_ZERO_RATED") return config.zeroRatedTaxRule;
  if (taxRule === "NZ_EXEMPT") return config.exemptTaxRule;
  return taxRule;
}

export function localizeCounterpartyName(name: string, config: SampleCompanyConfig): string {
  if (config.companyCode !== "SAMP-CA") return name;
  return name
    .replaceAll("NZ", "Canada")
    .replaceAll("Kiwi", "Maple")
    .replaceAll("North Shore", "North Coast")
    .replaceAll("Harbour", "Harbor");
}

export function localizeBankText(value: string | null | undefined, config: SampleCompanyConfig): string | null | undefined {
  if (typeof value !== "string") return value;
  return value.replaceAll("ASB", config.bankTxPrefix).replaceAll("NZD", config.currencyCode);
}
