import type { AccountType } from "@voyzu/finance/types/modules/core";
import type { TaxControlAccountPatchRequestDto } from "@voyzu/finance/types/modules/tax-control-accounts";
import type { TaxControlAccountResponseDto } from "@voyzu/finance/types/modules/tax-control-accounts";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { UpdateGLAccount } from "@voyzu/finance/common/tax-control-accounts/domain/operation-policy";
import { createUpdateAuditStamp, withAuditActors } from "../../../server";

import { TaxControlAccountRepo } from "../db/tax-control-account.repo";
import type { TaxControlAccountRow } from "../db/tax-control-account.row.types";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId } from "../../../server/settings-scope";
const REQUIRED_ACCOUNT_TYPE: Record<string, AccountType | null> = {
  TAX_ON_SALES: "LIABILITY",
  TAX_ON_PURCHASES: "ASSET",
};

function toDto(row: TaxControlAccountRow): TaxControlAccountResponseDto {
  const accountType = row.gl_account_type as AccountType;
  return {
    code: row.code,
    ledger: row.ledger,
    name: row.name,
    description: row.description,
    requiredAccountType: REQUIRED_ACCOUNT_TYPE[row.code] ?? null,
    glAccountId: row.gl_account_id,
    glAccount: {
      code: row.gl_account_code,
      name: row.gl_account_name,
      accountType: accountType as AccountType,
    },
    status: row.status === "ACTIVE" || row.status === "INACTIVE" ? row.status : null,
    hasPostings: row.companies_with_postings.length > 0,
    companiesWithPostings: row.companies_with_postings,
    linkedBy: [],
    audit: {
      created: { date: row.creation_date, actorType: row.creation_actor_type, userId: row.creation_user_id, mutationId: row.creation_mutation_id },
      updated: { date: row.updated_date, actorType: row.updated_actor_type, userId: row.updated_user_id, mutationId: row.updated_mutation_id },
    },
  };
}

async function enrichRow(row: TaxControlAccountRow): Promise<TaxControlAccountResponseDto> {
  const dto = await withAuditActors(toDto(row), row);
  return dto;
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  if (companyId === undefined) throw new BusinessRuleError("Financial entity context is required");
  return resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

export async function listTaxControlAccounts(companyId?: number): Promise<TaxControlAccountResponseDto[]> {
  const rows = await new TaxControlAccountRepo(getDb()).list(await scopedCompanyId(companyId));
  return Promise.all(rows.map(enrichRow));
}

export async function getTaxControlAccount(code: string, companyId?: number): Promise<TaxControlAccountResponseDto | null> {
  const row = await new TaxControlAccountRepo(getDb()).get(await scopedCompanyId(companyId), code);
  return row ? enrichRow(row) : null;
}

export async function patchTaxControlAccount(
  code: string,
  input: TaxControlAccountPatchRequestDto,
  companyId?: number,
): Promise<TaxControlAccountResponseDto> {
  if (input.glAccountId == null) throw new InputValidationError("glAccountId is required");
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);

  const row = await withTransaction(async (client) => {
    const repo = new TaxControlAccountRepo(client);
    const movement = await repo.get(resolvedCompanyId, code);
    if (!movement) throw new NotFoundError(`Tax control account ${code} not found`);
    const requiredAccountType = REQUIRED_ACCOUNT_TYPE[code];
    if (!requiredAccountType) throw new BusinessRuleError(`${code} does not have an editable control GL account`);

    const glAccount = await repo.getGlAccount(resolvedCompanyId, input.glAccountId as number);
    if (!glAccount) throw new NotFoundError(`GL account id ${input.glAccountId} not found`);
    const blockers = UpdateGLAccount(
      { code: movement.code, glAccountId: movement.gl_account_id, hasPostings: movement.has_postings },
      { id: glAccount.id, status: glAccount.status, accountType: glAccount.account_type },
      { requiredAccountType },
    );
    if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));

    return repo.patchGlAccount(resolvedCompanyId, code, input.glAccountId as number, await createUpdateAuditStamp());
  });

  return enrichRow(row);
}

