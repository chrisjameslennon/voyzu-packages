import type {
  CountryTaxConfigurationResponseDto,
  TaxAuthorityResponseDto,
  TaxComponentResponseDto,
  TaxRuleResponseDto,
} from "@voyzu-modules/core/types/modules/tax";
import { ConflictError, DataError, NotFoundError } from "@voyzu/capability/errors";
import { getDb } from "@voyzu/capability/db";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "../../../common/server";

import type {
  InsertTaxAuthorityRow,
  InsertTaxComponentRow,
  InsertTaxRuleRow,
  PatchTaxAuthorityRow,
  PatchTaxComponentRow,
  PatchTaxRuleRow,
  UpdateTaxAuthorityRow,
  UpdateTaxComponentRow,
  UpdateTaxRuleRow,
} from "../db/tax.row.types";
import { TaxRepo } from "../db/tax.repo";
import { toTaxAuthorityDto, toTaxComponentDto, toTaxRuleDto } from "./tax.mapper";

function conflictMessage(entity: string): string {
  return `A ${entity} with this code already exists`;
}

async function enrichTaxAuthority(row: Parameters<typeof toTaxAuthorityDto>[0]): Promise<TaxAuthorityResponseDto> {
  return withAuditActors(toTaxAuthorityDto(row), row);
}

async function enrichTaxRule(row: Parameters<typeof toTaxRuleDto>[0]): Promise<TaxRuleResponseDto> {
  return withAuditActors(toTaxRuleDto(row), row);
}

async function enrichTaxComponent(row: Parameters<typeof toTaxComponentDto>[0]): Promise<TaxComponentResponseDto> {
  return withAuditActors(toTaxComponentDto(row), row);
}

export async function createTaxAuthority(input: InsertTaxAuthorityRow): Promise<TaxAuthorityResponseDto> {
  try {
    return enrichTaxAuthority(await new TaxRepo(getDb()).insertAuthority(withCreationAudit(input, await createCreationAuditStamp())));
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) throw new ConflictError(conflictMessage("tax authority"));
    throw err;
  }
}

export async function getTaxAuthority(code: string): Promise<TaxAuthorityResponseDto | null> {
  const row = await new TaxRepo(getDb()).getAuthority(code);
  return row ? enrichTaxAuthority(row) : null;
}

export async function listTaxAuthorities(countryCode?: string): Promise<TaxAuthorityResponseDto[]> {
  return Promise.all((await new TaxRepo(getDb()).listAuthorities(countryCode)).map(enrichTaxAuthority));
}

export async function listApplicableTaxAuthorities(companyId: number): Promise<Array<TaxAuthorityResponseDto & { balance: number }>> {
  return Promise.all((await new TaxRepo(getDb()).listApplicableAuthorities(companyId)).map(async (row) => ({
    ...await enrichTaxAuthority(row),
    balance: row.balance,
  })));
}

export async function updateTaxAuthority(code: string, input: UpdateTaxAuthorityRow): Promise<TaxAuthorityResponseDto> {
  try {
    return enrichTaxAuthority(await new TaxRepo(getDb()).updateAuthority(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function patchTaxAuthority(code: string, input: PatchTaxAuthorityRow): Promise<TaxAuthorityResponseDto> {
  try {
    return enrichTaxAuthority(await new TaxRepo(getDb()).patchAuthority(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function deleteTaxAuthority(code: string): Promise<void> {
  await new TaxRepo(getDb()).deleteAuthority(code);
}

export async function createTaxRule(input: InsertTaxRuleRow): Promise<TaxRuleResponseDto> {
  try {
    return enrichTaxRule(await new TaxRepo(getDb()).insertRule(withCreationAudit(input, await createCreationAuditStamp())));
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) throw new ConflictError(conflictMessage("tax rule"));
    throw err;
  }
}

export async function getTaxRule(code: string): Promise<TaxRuleResponseDto | null> {
  const row = await new TaxRepo(getDb()).getRule(code);
  return row ? enrichTaxRule(row) : null;
}

export async function listTaxRules(countryCode?: string): Promise<TaxRuleResponseDto[]> {
  return Promise.all((await new TaxRepo(getDb()).listRules(countryCode)).map(enrichTaxRule));
}

export async function updateTaxRule(code: string, input: UpdateTaxRuleRow): Promise<TaxRuleResponseDto> {
  try {
    return enrichTaxRule(await new TaxRepo(getDb()).updateRule(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function patchTaxRule(code: string, input: PatchTaxRuleRow): Promise<TaxRuleResponseDto> {
  try {
    return enrichTaxRule(await new TaxRepo(getDb()).patchRule(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function deleteTaxRule(code: string): Promise<void> {
  await new TaxRepo(getDb()).deleteRule(code);
}

export async function createTaxComponent(input: InsertTaxComponentRow): Promise<TaxComponentResponseDto> {
  try {
    return enrichTaxComponent(await new TaxRepo(getDb()).insertComponent(withCreationAudit(input, await createCreationAuditStamp())));
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) throw new ConflictError(conflictMessage("tax component"));
    throw err;
  }
}

export async function getTaxComponent(code: string): Promise<TaxComponentResponseDto | null> {
  const row = await new TaxRepo(getDb()).getComponent(code);
  return row ? enrichTaxComponent(row) : null;
}

export async function listTaxComponents(countryCode?: string): Promise<TaxComponentResponseDto[]> {
  return Promise.all((await new TaxRepo(getDb()).listComponents(countryCode)).map(enrichTaxComponent));
}

export async function updateTaxComponent(code: string, input: UpdateTaxComponentRow): Promise<TaxComponentResponseDto> {
  try {
    return enrichTaxComponent(await new TaxRepo(getDb()).updateComponent(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function patchTaxComponent(code: string, input: PatchTaxComponentRow): Promise<TaxComponentResponseDto> {
  try {
    return enrichTaxComponent(await new TaxRepo(getDb()).patchComponent(code, withUpdateAudit(input, await createUpdateAuditStamp())));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(err.message);
    throw err;
  }
}

export async function deleteTaxComponent(code: string): Promise<void> {
  await new TaxRepo(getDb()).deleteComponent(code);
}

export async function getCountryTaxConfiguration(countryCode: string): Promise<CountryTaxConfigurationResponseDto> {
  const repo = new TaxRepo(getDb());
  const [authorities, rules, components] = await Promise.all([
    repo.listAuthorities(countryCode),
    repo.listRules(countryCode),
    repo.listComponents(countryCode),
  ]);

  return {
    taxAuthorities: await Promise.all(authorities.map(enrichTaxAuthority)),
    taxRules: await Promise.all(rules.map(enrichTaxRule)),
    taxComponents: await Promise.all(components.map(enrichTaxComponent)),
  };
}
