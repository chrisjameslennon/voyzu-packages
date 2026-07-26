import type {
  TaxAuthorityResponseDto,
  TaxComponentResponseDto,
  TaxRuleResponseDto,
} from "@voyzu-modules/types/modules/tax";
import type { ActorType, Status } from "@voyzu/types/modules/core";

import type {
  TaxAuthorityRow,
  TaxComponentRow,
  TaxRuleRow,
} from "../db/tax.row.types";

function audit(row: {
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}) {
  return {
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        mutationId: row.updated_mutation_id,
      },
    },
  };
}

export function toTaxAuthorityDto(row: TaxAuthorityRow): TaxAuthorityResponseDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    countryCode: row.country_code,
    regionCode: row.region_code,
    jurisdictionLevel: row.jurisdiction_level as TaxAuthorityResponseDto["jurisdictionLevel"],
    taxFamilyCode: row.tax_family_code as TaxAuthorityResponseDto["taxFamilyCode"],
    description: row.description,
    status: row.status as Status,
    ...audit(row),
  };
}

export function toTaxRuleDto(row: TaxRuleRow): TaxRuleResponseDto {
  return {
    id: row.id,
    code: row.code,
    countryCode: row.country_code,
    regionCode: row.region_code,
    name: row.name,
    invoiceLabel: row.invoice_label,
    reportLabel: row.report_label,
    calculationMethod: row.calculation_method as TaxRuleResponseDto["calculationMethod"],
    componentMode: row.component_mode as TaxRuleResponseDto["componentMode"],
    componentCount: row.component_count,
    description: row.description,
    status: row.status as Status,
    ...audit(row),
  };
}

export function toTaxComponentDto(row: TaxComponentRow): TaxComponentResponseDto {
  return {
    id: row.id,
    code: row.code,
    taxRuleCode: row.tax_rule_code,
    taxAuthorityCode: row.tax_authority_code,
    schemeCode: row.scheme_code as TaxComponentResponseDto["schemeCode"],
    invoiceLabel: row.invoice_label,
    reportLabel: row.report_label,
    rate: row.rate,
    baseAmountType: row.base_amount_type as TaxComponentResponseDto["baseAmountType"],
    calculationOrder: row.calculation_order,
    description: row.description,
    status: row.status as Status,
    ...audit(row),
  };
}
