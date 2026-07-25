import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

interface TaxAuthoritySeed {
  code: string;
  name: string;
  countryCode: string;
  regionCode: string | null;
  jurisdictionLevel: "FEDERAL" | "PROVINCIAL" | "STATE" | "NATIONAL";
  taxFamilyCode: "INDIRECT_TAX";
  description: string;
  status: "ACTIVE";
}

interface TaxRuleSeed {
  code: string;
  countryCode: string;
  regionCode: string | null;
  name: string;
  invoiceLabel: string;
  reportLabel: string;
  calculationMethod: "NO_TAX" | "CONFIGURED_COMPONENTS" | "CALLER_SUPPLIED";
  componentMode: "NONE" | "CONFIGURED" | "CALLER_SUPPLIED";
  componentCount: number;
  description: string;
  status: "ACTIVE";
}

interface TaxComponentSeed {
  code: string;
  taxRuleCode: string;
  taxAuthorityCode: string;
  schemeCode: "GST" | "VAT" | "HST" | "PST" | "RST" | "QST" | "GET" | "GRT" | "SALES_TAX";
  invoiceLabel: string;
  reportLabel: string;
  rate: string;
  baseAmountType: "LINE_NET_AMOUNT";
  calculationOrder: number;
  description: string;
  status: "ACTIVE";
}

const TAX_AUTHORITIES: TaxAuthoritySeed[] = [
  {
    code: "IRD",
    name: "Inland Revenue Department",
    countryCode: "NZ",
    regionCode: null,
    jurisdictionLevel: "NATIONAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "New Zealand authority for GST.",
    status: "ACTIVE",
  },
  {
    code: "ATO",
    name: "Australian Taxation Office",
    countryCode: "AU",
    regionCode: null,
    jurisdictionLevel: "NATIONAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Australian authority for GST.",
    status: "ACTIVE",
  },
  {
    code: "HMRC",
    name: "HM Revenue & Customs",
    countryCode: "GB",
    regionCode: null,
    jurisdictionLevel: "NATIONAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "United Kingdom authority for VAT.",
    status: "ACTIVE",
  },
  {
    code: "CA_CRA",
    name: "Canada Revenue Agency",
    countryCode: "CA",
    regionCode: null,
    jurisdictionLevel: "FEDERAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Federal authority for GST and HST. Used for GST-only provinces and HST provinces.",
    status: "ACTIVE",
  },
  {
    code: "CA_BC_FINANCE",
    name: "British Columbia Ministry of Finance",
    countryCode: "CA",
    regionCode: "BC",
    jurisdictionLevel: "PROVINCIAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Provincial authority for British Columbia PST.",
    status: "ACTIVE",
  },
  {
    code: "CA_MB_FINANCE",
    name: "Manitoba Finance",
    countryCode: "CA",
    regionCode: "MB",
    jurisdictionLevel: "PROVINCIAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Provincial authority for Manitoba Retail Sales Tax.",
    status: "ACTIVE",
  },
  {
    code: "CA_SK_FINANCE",
    name: "Saskatchewan Ministry of Finance",
    countryCode: "CA",
    regionCode: "SK",
    jurisdictionLevel: "PROVINCIAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Provincial authority for Saskatchewan PST.",
    status: "ACTIVE",
  },
  {
    code: "CA_REVENU_QUEBEC",
    name: "Revenu Québec",
    countryCode: "CA",
    regionCode: "QC",
    jurisdictionLevel: "PROVINCIAL",
    taxFamilyCode: "INDIRECT_TAX",
    description: "Québec authority for QST. Revenu Québec also administers GST/HST in Québec under agreement with the federal government.",
    status: "ACTIVE",
  },
];

const TAX_RULES: TaxRuleSeed[] = [
  {
    code: "NZ_STANDARD",
    countryCode: "NZ",
    regionCode: null,
    name: "New Zealand Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply in New Zealand. Resolves to national GST.",
    status: "ACTIVE",
  },
  {
    code: "NZ_ZERO_RATED",
    countryCode: "NZ",
    regionCode: null,
    name: "New Zealand Zero Rated Supply",
    invoiceLabel: "Zero Rated",
    reportLabel: "Zero-rated supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Taxable supply at 0%. No tax component is calculated, but the supply remains tax-classified for reporting.",
    status: "ACTIVE",
  },
  {
    code: "NZ_EXEMPT",
    countryCode: "NZ",
    regionCode: null,
    name: "New Zealand Exempt Supply",
    invoiceLabel: "Exempt Supply",
    reportLabel: "Exempt supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Supply is exempt from GST. No tax component is calculated, but the exemption classification is retained.",
    status: "ACTIVE",
  },
  {
    code: "AU_STANDARD",
    countryCode: "AU",
    regionCode: null,
    name: "Australia Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply in Australia. Resolves to national GST.",
    status: "ACTIVE",
  },
  {
    code: "AU_ZERO_RATED",
    countryCode: "AU",
    regionCode: null,
    name: "Australia Zero Rated Supply",
    invoiceLabel: "Zero Rated",
    reportLabel: "Zero-rated supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Taxable supply at 0%. No tax component is calculated, but the supply remains tax-classified for reporting.",
    status: "ACTIVE",
  },
  {
    code: "AU_EXEMPT",
    countryCode: "AU",
    regionCode: null,
    name: "Australia Exempt Supply",
    invoiceLabel: "Exempt Supply",
    reportLabel: "Exempt supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Supply is exempt from GST. No tax component is calculated, but the exemption classification is retained.",
    status: "ACTIVE",
  },
  {
    code: "GB_STANDARD",
    countryCode: "GB",
    regionCode: null,
    name: "United Kingdom Standard VAT",
    invoiceLabel: "VAT",
    reportLabel: "VAT collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply in the United Kingdom. Resolves to national VAT.",
    status: "ACTIVE",
  },
  {
    code: "GB_REDUCED",
    countryCode: "GB",
    regionCode: null,
    name: "United Kingdom Reduced VAT",
    invoiceLabel: "Reduced VAT",
    reportLabel: "Reduced VAT collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Reduced-rate taxable supply in the United Kingdom. Resolves to national VAT.",
    status: "ACTIVE",
  },
  {
    code: "GB_ZERO_RATED",
    countryCode: "GB",
    regionCode: null,
    name: "United Kingdom Zero Rated Supply",
    invoiceLabel: "Zero Rated",
    reportLabel: "Zero-rated supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Taxable supply at 0%. No tax component is calculated, but the supply remains tax-classified for reporting.",
    status: "ACTIVE",
  },
  {
    code: "GB_EXEMPT",
    countryCode: "GB",
    regionCode: null,
    name: "United Kingdom Exempt Supply",
    invoiceLabel: "Exempt Supply",
    reportLabel: "Exempt supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Supply is exempt from VAT. No tax component is calculated, but the exemption classification is retained.",
    status: "ACTIVE",
  },
  {
    code: "CA_ZERO_RATED",
    countryCode: "CA",
    regionCode: null,
    name: "Canada Zero Rated Supply",
    invoiceLabel: "Zero Rated",
    reportLabel: "Zero-rated supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Taxable supply at 0%. No tax component is calculated, but the supply remains tax-classified for reporting.",
    status: "ACTIVE",
  },
  {
    code: "CA_ZERO_RATED_EXPORT",
    countryCode: "CA",
    regionCode: null,
    name: "Canada Zero Rated Export",
    invoiceLabel: "Zero Rated Export",
    reportLabel: "Zero-rated export supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Export or international supply treated as zero-rated where applicable. No tax component is calculated.",
    status: "ACTIVE",
  },
  {
    code: "CA_EXEMPT",
    countryCode: "CA",
    regionCode: null,
    name: "Canada Exempt Supply",
    invoiceLabel: "Exempt Supply",
    reportLabel: "Exempt supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Supply is exempt from GST/HST. No tax component is calculated, but the exemption classification is retained.",
    status: "ACTIVE",
  },
  {
    code: "CA_OUT_OF_SCOPE",
    countryCode: "CA",
    regionCode: null,
    name: "Canada Out of Scope Supply",
    invoiceLabel: "Out of Scope",
    reportLabel: "Out-of-scope supplies",
    calculationMethod: "NO_TAX",
    componentMode: "NONE",
    componentCount: 0,
    description: "Supply is outside the Canadian indirect tax system for this transaction.",
    status: "ACTIVE",
  },
  {
    code: "CA_AB_STANDARD",
    countryCode: "CA",
    regionCode: "AB",
    name: "Alberta Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Alberta is the place of supply. Resolves to federal GST only.",
    status: "ACTIVE",
  },
  {
    code: "CA_BC_STANDARD",
    countryCode: "CA",
    regionCode: "BC",
    name: "British Columbia Standard GST/PST",
    invoiceLabel: "GST/PST",
    reportLabel: "GST and PST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 2,
    description: "Standard taxable supply where British Columbia is the place of supply. Resolves to GST plus BC PST.",
    status: "ACTIVE",
  },
  {
    code: "CA_MB_STANDARD",
    countryCode: "CA",
    regionCode: "MB",
    name: "Manitoba Standard GST/RST",
    invoiceLabel: "GST/RST",
    reportLabel: "GST and RST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 2,
    description: "Standard taxable supply where Manitoba is the place of supply. Resolves to GST plus Manitoba RST.",
    status: "ACTIVE",
  },
  {
    code: "CA_NB_STANDARD",
    countryCode: "CA",
    regionCode: "NB",
    name: "New Brunswick Standard HST",
    invoiceLabel: "HST",
    reportLabel: "HST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where New Brunswick is the place of supply. Resolves to a single HST component.",
    status: "ACTIVE",
  },
  {
    code: "CA_NL_STANDARD",
    countryCode: "CA",
    regionCode: "NL",
    name: "Newfoundland and Labrador Standard HST",
    invoiceLabel: "HST",
    reportLabel: "HST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Newfoundland and Labrador is the place of supply. Resolves to a single HST component.",
    status: "ACTIVE",
  },
  {
    code: "CA_NS_STANDARD",
    countryCode: "CA",
    regionCode: "NS",
    name: "Nova Scotia Standard HST",
    invoiceLabel: "HST",
    reportLabel: "HST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Nova Scotia is the place of supply. Resolves to a single HST component.",
    status: "ACTIVE",
  },
  {
    code: "CA_NT_STANDARD",
    countryCode: "CA",
    regionCode: "NT",
    name: "Northwest Territories Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Northwest Territories is the place of supply. Resolves to federal GST only.",
    status: "ACTIVE",
  },
  {
    code: "CA_NU_STANDARD",
    countryCode: "CA",
    regionCode: "NU",
    name: "Nunavut Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Nunavut is the place of supply. Resolves to federal GST only.",
    status: "ACTIVE",
  },
  {
    code: "CA_ON_STANDARD",
    countryCode: "CA",
    regionCode: "ON",
    name: "Ontario Standard HST",
    invoiceLabel: "HST",
    reportLabel: "HST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Ontario is the place of supply. Resolves to a single HST component.",
    status: "ACTIVE",
  },
  {
    code: "CA_PE_STANDARD",
    countryCode: "CA",
    regionCode: "PE",
    name: "Prince Edward Island Standard HST",
    invoiceLabel: "HST",
    reportLabel: "HST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Prince Edward Island is the place of supply. Resolves to a single HST component.",
    status: "ACTIVE",
  },
  {
    code: "CA_QC_STANDARD",
    countryCode: "CA",
    regionCode: "QC",
    name: "Québec Standard GST/QST",
    invoiceLabel: "GST/QST",
    reportLabel: "GST and QST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 2,
    description: "Standard taxable supply where Québec is the place of supply. Resolves to GST plus QST.",
    status: "ACTIVE",
  },
  {
    code: "CA_SK_STANDARD",
    countryCode: "CA",
    regionCode: "SK",
    name: "Saskatchewan Standard GST/PST",
    invoiceLabel: "GST/PST",
    reportLabel: "GST and PST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 2,
    description: "Standard taxable supply where Saskatchewan is the place of supply. Resolves to GST plus Saskatchewan PST.",
    status: "ACTIVE",
  },
  {
    code: "CA_YT_STANDARD",
    countryCode: "CA",
    regionCode: "YT",
    name: "Yukon Standard GST",
    invoiceLabel: "GST",
    reportLabel: "GST collected",
    calculationMethod: "CONFIGURED_COMPONENTS",
    componentMode: "CONFIGURED",
    componentCount: 1,
    description: "Standard taxable supply where Yukon is the place of supply. Resolves to federal GST only.",
    status: "ACTIVE",
  },
];

const TAX_COMPONENTS: TaxComponentSeed[] = [
  { code: "NZ_STANDARD_GST", taxRuleCode: "NZ_STANDARD", taxAuthorityCode: "IRD", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.15000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "National GST component for New Zealand standard taxable supplies.", status: "ACTIVE" },
  { code: "AU_STANDARD_GST", taxRuleCode: "AU_STANDARD", taxAuthorityCode: "ATO", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.10000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "National GST component for Australia standard taxable supplies.", status: "ACTIVE" },
  { code: "GB_STANDARD_VAT", taxRuleCode: "GB_STANDARD", taxAuthorityCode: "HMRC", schemeCode: "VAT", invoiceLabel: "VAT", reportLabel: "VAT collected", rate: "0.20000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "National VAT component for United Kingdom standard taxable supplies.", status: "ACTIVE" },
  { code: "GB_REDUCED_VAT", taxRuleCode: "GB_REDUCED", taxAuthorityCode: "HMRC", schemeCode: "VAT", invoiceLabel: "Reduced VAT", reportLabel: "Reduced VAT collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "National VAT component for United Kingdom reduced-rate taxable supplies.", status: "ACTIVE" },
  { code: "CA_AB_STANDARD_GST", taxRuleCode: "CA_AB_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Alberta standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_BC_STANDARD_GST", taxRuleCode: "CA_BC_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for British Columbia standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_BC_STANDARD_PST", taxRuleCode: "CA_BC_STANDARD", taxAuthorityCode: "CA_BC_FINANCE", schemeCode: "PST", invoiceLabel: "PST", reportLabel: "BC PST collected", rate: "0.07000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 20, description: "Provincial PST component for British Columbia standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_MB_STANDARD_GST", taxRuleCode: "CA_MB_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Manitoba standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_MB_STANDARD_RST", taxRuleCode: "CA_MB_STANDARD", taxAuthorityCode: "CA_MB_FINANCE", schemeCode: "RST", invoiceLabel: "RST", reportLabel: "Manitoba RST collected", rate: "0.07000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 20, description: "Provincial RST component for Manitoba standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_NB_STANDARD_HST", taxRuleCode: "CA_NB_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "HST", invoiceLabel: "HST", reportLabel: "HST collected", rate: "0.15000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Harmonized sales tax component for New Brunswick standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_NL_STANDARD_HST", taxRuleCode: "CA_NL_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "HST", invoiceLabel: "HST", reportLabel: "HST collected", rate: "0.15000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Harmonized sales tax component for Newfoundland and Labrador standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_NS_STANDARD_HST", taxRuleCode: "CA_NS_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "HST", invoiceLabel: "HST", reportLabel: "HST collected", rate: "0.14000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Harmonized sales tax component for Nova Scotia standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_NT_STANDARD_GST", taxRuleCode: "CA_NT_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Northwest Territories standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_NU_STANDARD_GST", taxRuleCode: "CA_NU_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Nunavut standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_ON_STANDARD_HST", taxRuleCode: "CA_ON_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "HST", invoiceLabel: "HST", reportLabel: "HST collected", rate: "0.13000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Harmonized sales tax component for Ontario standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_PE_STANDARD_HST", taxRuleCode: "CA_PE_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "HST", invoiceLabel: "HST", reportLabel: "HST collected", rate: "0.15000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Harmonized sales tax component for Prince Edward Island standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_QC_STANDARD_GST", taxRuleCode: "CA_QC_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Québec standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_QC_STANDARD_QST", taxRuleCode: "CA_QC_STANDARD", taxAuthorityCode: "CA_REVENU_QUEBEC", schemeCode: "QST", invoiceLabel: "QST", reportLabel: "QST collected", rate: "0.09975", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 20, description: "Québec sales tax component for Québec standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_SK_STANDARD_GST", taxRuleCode: "CA_SK_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Saskatchewan standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_SK_STANDARD_PST", taxRuleCode: "CA_SK_STANDARD", taxAuthorityCode: "CA_SK_FINANCE", schemeCode: "PST", invoiceLabel: "PST", reportLabel: "Saskatchewan PST collected", rate: "0.06000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 20, description: "Provincial PST component for Saskatchewan standard taxable supplies.", status: "ACTIVE" },
  { code: "CA_YT_STANDARD_GST", taxRuleCode: "CA_YT_STANDARD", taxAuthorityCode: "CA_CRA", schemeCode: "GST", invoiceLabel: "GST", reportLabel: "GST collected", rate: "0.05000", baseAmountType: "LINE_NET_AMOUNT", calculationOrder: 10, description: "Federal GST component for Yukon standard taxable supplies.", status: "ACTIVE" },
];

for (const countryCode of ["NZ", "AU", "GB", "CA", "US"]) {
  TAX_RULES.push({
    code: "CALLER_SUPPLIED",
    countryCode,
    regionCode: null,
    name: "Caller Supplied Tax",
    invoiceLabel: "Caller Supplied Tax",
    reportLabel: "Caller supplied tax",
    calculationMethod: "CALLER_SUPPLIED",
    componentMode: "CALLER_SUPPLIED",
    componentCount: 0,
    description: "Tax components are supplied by the caller and validated against configured tax authorities.",
    status: "ACTIVE",
  });
}

interface UsStateTaxSeed {
  code: string;
  name: string;
  authorityName: string;
  schemeCode: "GET" | "GRT" | "SALES_TAX";
  schemeLabel: string;
  rate: string;
}

const US_STATE_TAXES: UsStateTaxSeed[] = [
  { code: "AL", name: "Alabama", authorityName: "Alabama Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04000" },
  { code: "AK", name: "Alaska", authorityName: "Alaska Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.00000" },
  { code: "AZ", name: "Arizona", authorityName: "Arizona Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05600" },
  { code: "AR", name: "Arkansas", authorityName: "Arkansas Department of Finance", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06500" },
  { code: "CA", name: "California", authorityName: "California Tax and Fee Administration", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.07250" },
  { code: "CO", name: "Colorado", authorityName: "Colorado Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.02900" },
  { code: "CT", name: "Connecticut", authorityName: "Connecticut Department of Revenue Services", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06350" },
  { code: "DE", name: "Delaware", authorityName: "Delaware Division of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.00000" },
  { code: "FL", name: "Florida", authorityName: "Florida Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "GA", name: "Georgia", authorityName: "Georgia Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04000" },
  { code: "HI", name: "Hawaii", authorityName: "Hawaii Department of Taxation", schemeCode: "GET", schemeLabel: "GET", rate: "0.04000" },
  { code: "ID", name: "Idaho", authorityName: "Idaho State Tax Commission", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "IL", name: "Illinois", authorityName: "Illinois Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06250" },
  { code: "IN", name: "Indiana", authorityName: "Indiana Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.07000" },
  { code: "IA", name: "Iowa", authorityName: "Iowa Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "KS", name: "Kansas", authorityName: "Kansas Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06500" },
  { code: "KY", name: "Kentucky", authorityName: "Kentucky Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "LA", name: "Louisiana", authorityName: "Louisiana Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05000" },
  { code: "ME", name: "Maine", authorityName: "Maine Revenue Services", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05500" },
  { code: "MD", name: "Maryland", authorityName: "Maryland Comptroller's Office", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "MA", name: "Massachusetts", authorityName: "Massachusetts Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06250" },
  { code: "MI", name: "Michigan", authorityName: "Michigan Department of Treasury", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "MN", name: "Minnesota", authorityName: "Minnesota Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06875" },
  { code: "MS", name: "Mississippi", authorityName: "Mississippi Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.07000" },
  { code: "MO", name: "Missouri", authorityName: "Missouri Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04225" },
  { code: "MT", name: "Montana", authorityName: "Montana Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.00000" },
  { code: "NE", name: "Nebraska", authorityName: "Nebraska Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05500" },
  { code: "NV", name: "Nevada", authorityName: "Nevada Department of Taxation", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06850" },
  { code: "NH", name: "New Hampshire", authorityName: "New Hampshire Department of Revenue Administration", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.00000" },
  { code: "NJ", name: "New Jersey", authorityName: "New Jersey Division of Taxation", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06625" },
  { code: "NM", name: "New Mexico", authorityName: "New Mexico Taxation and Revenue Department", schemeCode: "GRT", schemeLabel: "GRT", rate: "0.04875" },
  { code: "NY", name: "New York", authorityName: "New York Department of Taxation and Finance", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04000" },
  { code: "NC", name: "North Carolina", authorityName: "North Carolina Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04750" },
  { code: "ND", name: "North Dakota", authorityName: "North Dakota Office of State Tax Commissioner", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05000" },
  { code: "OH", name: "Ohio", authorityName: "Ohio Department of Taxation", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05750" },
  { code: "OK", name: "Oklahoma", authorityName: "Oklahoma Tax Commission", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04500" },
  { code: "OR", name: "Oregon", authorityName: "Oregon Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.00000" },
  { code: "PA", name: "Pennsylvania", authorityName: "Pennsylvania Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "RI", name: "Rhode Island", authorityName: "Rhode Island Division of Taxation", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.07000" },
  { code: "SC", name: "South Carolina", authorityName: "South Carolina Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "SD", name: "South Dakota", authorityName: "South Dakota Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04200" },
  { code: "TN", name: "Tennessee", authorityName: "Tennessee Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.07000" },
  { code: "TX", name: "Texas", authorityName: "Texas Comptroller of Public Accounts", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06250" },
  { code: "UT", name: "Utah", authorityName: "Utah State Tax Commission", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04850" },
  { code: "VT", name: "Vermont", authorityName: "Vermont Department of Taxes", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "VA", name: "Virginia", authorityName: "Virginia Department of Taxation", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04300" },
  { code: "WA", name: "Washington", authorityName: "Washington Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06500" },
  { code: "WV", name: "West Virginia", authorityName: "West Virginia Tax Division", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.06000" },
  { code: "WI", name: "Wisconsin", authorityName: "Wisconsin Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.05000" },
  { code: "WY", name: "Wyoming", authorityName: "Wyoming Department of Revenue", schemeCode: "SALES_TAX", schemeLabel: "Sales Tax", rate: "0.04000" },
];

TAX_RULES.push({
  code: "US_EXEMPT",
  countryCode: "US",
  regionCode: null,
  name: "United States Exempt Supply",
  invoiceLabel: "Exempt Supply",
  reportLabel: "Exempt supplies",
  calculationMethod: "NO_TAX",
  componentMode: "NONE",
  componentCount: 0,
  description: "Supply is exempt from state sales tax. No tax component is calculated, but the exemption classification is retained.",
  status: "ACTIVE",
});

for (const state of US_STATE_TAXES) {
  const authorityCode = `US_${state.code}_TAX`;
  const ruleCode = `US_${state.code}_STANDARD`;
  const componentCode = `US_${state.code}_STANDARD_${state.schemeCode}`;
  const hasStateRate = state.rate !== "0.00000";

  TAX_AUTHORITIES.push({
    code: authorityCode,
    name: state.authorityName,
    countryCode: "US",
    regionCode: state.code,
    jurisdictionLevel: "STATE",
    taxFamilyCode: "INDIRECT_TAX",
    description: `State authority for ${state.name} ${state.schemeLabel}.`,
    status: "ACTIVE",
  });

  TAX_RULES.push({
    code: ruleCode,
    countryCode: "US",
    regionCode: state.code,
    name: `${state.name} Standard ${state.schemeLabel}`,
    invoiceLabel: hasStateRate ? state.schemeLabel : "No State Sales Tax",
    reportLabel: hasStateRate ? `${state.name} ${state.schemeLabel} collected` : "No state sales tax",
    calculationMethod: hasStateRate ? "CONFIGURED_COMPONENTS" : "NO_TAX",
    componentMode: hasStateRate ? "CONFIGURED" : "NONE",
    componentCount: hasStateRate ? 1 : 0,
    description: hasStateRate
      ? `Standard taxable supply where ${state.name} is the place of supply. Resolves to state-level ${state.schemeLabel}.`
      : `Standard supply where ${state.name} is the place of supply. No statewide sales tax component is calculated.`,
    status: "ACTIVE",
  });

  if (hasStateRate) {
    TAX_COMPONENTS.push({
      code: componentCode,
      taxRuleCode: ruleCode,
      taxAuthorityCode: authorityCode,
      schemeCode: state.schemeCode,
      invoiceLabel: state.schemeLabel,
      reportLabel: `${state.name} ${state.schemeLabel} collected`,
      rate: state.rate,
      baseAmountType: "LINE_NET_AMOUNT",
      calculationOrder: 10,
      description: `State-level ${state.schemeLabel} component for ${state.name} standard taxable supplies.`,
      status: "ACTIVE",
    });
  }
}

async function main() {
  const pool = getPool();

  for (const row of TAX_AUTHORITIES) {
    await pool.query(
      `INSERT INTO tax_authority (code, name, country_code, region_code, jurisdiction_level, tax_family_code, description, status, creation_actor_type, updated_actor_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'SYSTEM', 'SYSTEM')
       ON CONFLICT (code) DO UPDATE
       SET name = EXCLUDED.name,
           country_code = EXCLUDED.country_code,
           region_code = EXCLUDED.region_code,
           jurisdiction_level = EXCLUDED.jurisdiction_level,
           tax_family_code = EXCLUDED.tax_family_code,
           description = EXCLUDED.description,
           status = EXCLUDED.status,
           updated_date = NOW(),
           updated_actor_type = 'SYSTEM'`,
      [row.code, row.name, row.countryCode, row.regionCode, row.jurisdictionLevel, row.taxFamilyCode, row.description, row.status],
    );
  }

  for (const row of TAX_RULES) {
    await pool.query(
      `INSERT INTO tax_rule (code, country_code, region_code, name, invoice_label, report_label, calculation_method, component_mode, component_count, description, status, creation_actor_type, updated_actor_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'SYSTEM', 'SYSTEM')
       ON CONFLICT (country_code, code) DO UPDATE
       SET country_code = EXCLUDED.country_code,
           region_code = EXCLUDED.region_code,
           name = EXCLUDED.name,
           invoice_label = EXCLUDED.invoice_label,
           report_label = EXCLUDED.report_label,
           calculation_method = EXCLUDED.calculation_method,
           component_mode = EXCLUDED.component_mode,
           component_count = EXCLUDED.component_count,
           description = EXCLUDED.description,
           status = EXCLUDED.status,
           updated_date = NOW(),
           updated_actor_type = 'SYSTEM'`,
      [
        row.code,
        row.countryCode,
        row.regionCode,
        row.name,
        row.invoiceLabel,
        row.reportLabel,
        row.calculationMethod,
        row.componentMode,
        row.componentCount,
        row.description,
        row.status,
      ],
    );
  }

  const ruleCountryByCode = new Map(TAX_RULES.map((row) => [row.code, row.countryCode]));

  for (const row of TAX_COMPONENTS) {
    const taxRuleCountryCode = ruleCountryByCode.get(row.taxRuleCode);
    if (!taxRuleCountryCode) throw new Error(`Missing tax rule ${row.taxRuleCode} for component ${row.code}`);
    await pool.query(
      `INSERT INTO tax_component (code, tax_rule_country_code, tax_rule_code, tax_authority_code, scheme_code, invoice_label, report_label, rate, base_amount_type, calculation_order, description, status, creation_actor_type, updated_actor_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'SYSTEM', 'SYSTEM')
       ON CONFLICT (code) DO UPDATE
       SET tax_rule_country_code = EXCLUDED.tax_rule_country_code,
           tax_rule_code = EXCLUDED.tax_rule_code,
           tax_authority_code = EXCLUDED.tax_authority_code,
           scheme_code = EXCLUDED.scheme_code,
           invoice_label = EXCLUDED.invoice_label,
           report_label = EXCLUDED.report_label,
           rate = EXCLUDED.rate,
           base_amount_type = EXCLUDED.base_amount_type,
           calculation_order = EXCLUDED.calculation_order,
           description = EXCLUDED.description,
           status = EXCLUDED.status,
           updated_date = NOW(),
           updated_actor_type = 'SYSTEM'`,
      [
        row.code,
        taxRuleCountryCode,
        row.taxRuleCode,
        row.taxAuthorityCode,
        row.schemeCode,
        row.invoiceLabel,
        row.reportLabel,
        row.rate,
        row.baseAmountType,
        row.calculationOrder,
        row.description,
        row.status,
      ],
    );
  }

  console.log(`Seeded ${TAX_AUTHORITIES.length} tax authorities, ${TAX_RULES.length} tax rules, and ${TAX_COMPONENTS.length} tax components.`);
  await pool.end();
}

main();
