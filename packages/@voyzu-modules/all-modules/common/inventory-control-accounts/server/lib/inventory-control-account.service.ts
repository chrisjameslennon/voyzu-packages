import type { AccountType } from "@voyzu/types/modules/core";
import type { InventoryControlAccountPatchRequestDto } from "@voyzu-modules/types/modules/inventory-control-accounts";
import type { InventoryControlAccountSettingResponseDto } from "@voyzu-modules/types/modules/inventory-control-accounts";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { UpdateGLAccount } from "@voyzu-modules/all-modules/common/inventory-control-accounts/domain/operation-policy";
import { createUpdateAuditStamp, withAuditActors } from "../../../server";

import { InventoryControlAccountRepo } from "../db/inventory-control-account.repo";
import type { InventoryControlAccountRow } from "../db/inventory-control-account.row.types";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";

const REQUIRED_ACCOUNT_TYPE: Record<string, AccountType | null> = {
  INVENTORY_CONTROL: "ASSET",
};

function toDto(row: InventoryControlAccountRow): InventoryControlAccountSettingResponseDto {
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
      accountType,
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

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

export async function listInventoryControlAccountSettings(companyId?: number): Promise<InventoryControlAccountSettingResponseDto[]> {
  const rows = await new InventoryControlAccountRepo(getDb()).list(await scopedCompanyId(companyId));
  return Promise.all(rows.map((row) => withAuditActors(toDto(row), row)));
}

export async function getInventoryControlAccountSetting(code: string, companyId?: number): Promise<InventoryControlAccountSettingResponseDto | null> {
  const row = await new InventoryControlAccountRepo(getDb()).get(await scopedCompanyId(companyId), code);
  return row ? withAuditActors(toDto(row), row) : null;
}

export async function patchInventoryControlAccountSetting(
  code: string,
  input: InventoryControlAccountPatchRequestDto,
  companyId?: number,
): Promise<InventoryControlAccountSettingResponseDto> {
  if (input.glAccountId == null) throw new InputValidationError("glAccountId is required");
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);

  const row = await withTransaction(async (client) => {
    const repo = new InventoryControlAccountRepo(client);
    const account = await repo.get(resolvedCompanyId, code);
    if (!account) throw new NotFoundError(`Inventory control account ${code} not found`);
    const requiredAccountType = REQUIRED_ACCOUNT_TYPE[code];
    if (!requiredAccountType) throw new BusinessRuleError(`${code} does not have an editable control GL account`);

    const glAccount = await repo.getGlAccount(resolvedCompanyId, input.glAccountId as number);
    if (!glAccount) throw new NotFoundError(`GL account id ${input.glAccountId} not found`);
    const blockers = UpdateGLAccount(
      { code: account.code, glAccountId: account.gl_account_id, hasPostings: account.has_postings },
      { id: glAccount.id, status: glAccount.status, accountType: glAccount.account_type },
      { requiredAccountType },
    );
    if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));

    return repo.patchGlAccount(resolvedCompanyId, code, input.glAccountId as number, await createUpdateAuditStamp());
  });

  return withAuditActors(toDto(row), row);
}

