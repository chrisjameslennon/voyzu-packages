import type { Filter, ListOptions } from "@voyzu/types/params";
import type { AccountType } from "@voyzu/types/modules";
import type {
  ControlAccountPatchRequestDto,
  ControlAccountResponseDto,
  ControlAccountSettingResponseDto,
} from "@voyzu/types/modules/control-accounts";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { runtime } from "@voyzu/capability/runtime";
import { BusinessRuleError, DataError, NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import { UpdateGLAccount } from "@voyzu/modules/common/control-accounts/domain/operation-policy";
import { createUpdateAuditStamp, withAuditActors } from "../../../server";

import { ControlAccountRepo } from "../db/control-account.repo";
import type { ControlAccountRow } from "../db/control-account.row.types";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";

import { toDto } from "./control-account.mapper";
import { validatePatch, validateResponse } from "./control-account.validator";

const FIXED_CONTROL_ACCOUNT_SETTINGS: Array<{
  code: string;
  ledger: ControlAccountSettingResponseDto["ledger"];
  name: string;
  supportingLedger: ControlAccountSettingResponseDto["supportingLedger"];
  requiredAccountType: AccountType;
}> = [
  { code: "AP_TRADE_PAYABLES", ledger: "ACCOUNTS_PAYABLE", name: "Trade Payables", supportingLedger: "Accounts Payable", requiredAccountType: "LIABILITY" },
  { code: "AP_UNAPPLIED_PAYMENTS", ledger: "ACCOUNTS_PAYABLE", name: "Supplier Payments Awaiting Allocation", supportingLedger: "Accounts Payable", requiredAccountType: "LIABILITY" },
  { code: "AR_TRADE_RECEIVABLES", ledger: "ACCOUNTS_RECEIVABLE", name: "Trade Receivables", supportingLedger: "Accounts Receivable", requiredAccountType: "ASSET" },
  { code: "AR_UNAPPLIED_CASH", ledger: "ACCOUNTS_RECEIVABLE", name: "Customer Receipts Awaiting Allocation", supportingLedger: "Accounts Receivable", requiredAccountType: "ASSET" },
];

export type ControlAccountLedger = typeof FIXED_CONTROL_ACCOUNT_SETTINGS[number]["ledger"];

function checkedResponse(dto: ControlAccountResponseDto): ControlAccountResponseDto {
  const errors = validateResponse(dto);
  if (errors.length) {
    const message = `Invalid control account response (code=${dto.code}): ${errors.join("; ")}`;
    if (runtime.isDevLike) {
      throw new Error(message);
    }
    console.error(message);
  }
  return dto;
}

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

export async function getControlAccount(code: string, companyId?: number): Promise<ControlAccountResponseDto | null> {
  const row = await new ControlAccountRepo(getDb()).get(await scopedCompanyId(companyId), code);
  if (!row) return null;
  return checkedResponse(await withAuditActors(toDto(row), row));
}

function toSettingDto(
  setting: typeof FIXED_CONTROL_ACCOUNT_SETTINGS[number],
  row: ControlAccountRow | undefined,
): ControlAccountSettingResponseDto {
  return {
    code: setting.code,
    ledger: row?.ledger ?? setting.ledger,
    name: setting.name,
    supportingLedger: setting.supportingLedger,
    requiredAccountType: setting.requiredAccountType,
    glAccountId: row?.gl_account_id ?? null,
    glAccount: row?.gl_account_code != null ? {
      code: row.gl_account_code,
      name: row.gl_account_name ?? "",
      accountType: row.gl_account_type as AccountType,
    } : null,
    status: row?.status === "ACTIVE" || row?.status === "INACTIVE" ? row.status : null,
    hasPostings: (row?.companies_with_postings ?? []).length > 0,
    companiesWithPostings: row?.companies_with_postings ?? [],
    linkedBy: [],
  };
}

export async function listControlAccountSettings(companyId?: number): Promise<ControlAccountSettingResponseDto[]> {
  const rows = await new ControlAccountRepo(getDb()).listByCodes(await scopedCompanyId(companyId), FIXED_CONTROL_ACCOUNT_SETTINGS.map((setting) => setting.code));
  const rowByCode = new Map(rows.map((row) => [row.code, row]));
  return FIXED_CONTROL_ACCOUNT_SETTINGS.map((setting) => toSettingDto(setting, rowByCode.get(setting.code)));
}

export async function listControlAccountSettingsByLedger(
  ledger: ControlAccountLedger,
  companyId?: number,
): Promise<ControlAccountSettingResponseDto[]> {
  const accounts = await listControlAccountSettings(companyId);
  return accounts.filter((account) => account.ledger === ledger);
}

export async function getControlAccountByLedger(
  code: string,
  ledger: ControlAccountLedger,
  companyId?: number,
): Promise<ControlAccountResponseDto | null> {
  const account = await getControlAccount(code, companyId);
  return account?.ledger === ledger ? account : null;
}

export async function listControlAccounts(companyId?: number): Promise<ControlAccountResponseDto[]> {
  const rows = await new ControlAccountRepo(getDb()).listAll(await scopedCompanyId(companyId));
  return Promise.all(rows.map(async (r) => checkedResponse(await withAuditActors(toDto(r), r))));
}

export async function filterControlAccounts(
  filters: Filter[],
  options?: ListOptions,
  companyId?: number,
): Promise<ControlAccountResponseDto[]> {
  const rows = await new ControlAccountRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options);
  return Promise.all(rows.map(async (r) => checkedResponse(await withAuditActors(toDto(r), r))));
}

export async function searchControlAccounts(
  phrase: string,
  options?: ListOptions,
  companyId?: number,
): Promise<ControlAccountResponseDto[]> {
  const rows = await new ControlAccountRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options);
  return Promise.all(rows.map(async (r) => checkedResponse(await withAuditActors(toDto(r), r))));
}

export async function patchControlAccount(
  code: string,
  input: ControlAccountPatchRequestDto,
  companyId?: number,
): Promise<ControlAccountResponseDto> {
  const errors = validatePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));

  const setting = FIXED_CONTROL_ACCOUNT_SETTINGS.find((item) => item.code === code);
  if (!setting) throw new NotFoundError(`Control account ${code} not found`);
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);

  try {
    const row = await withTransaction(async (client) => {
      const repo = new ControlAccountRepo(client);
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new NotFoundError(`Control account ${code} not found`);

      const glAccount = await repo.getGlAccount(resolvedCompanyId, input.glAccountId as number);
      if (!glAccount) throw new NotFoundError(`GL account id ${input.glAccountId} not found`);

      const blockers = UpdateGLAccount(
        {
          code: existing.code,
          glAccountId: existing.gl_account_id,
          hasPostings: existing.has_postings,
        },
        {
          id: glAccount.id,
          status: glAccount.status,
          accountType: glAccount.account_type,
        },
        { requiredAccountType: setting.requiredAccountType },
      );
      if (blockers.length > 0) {
        throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
      }

      if (glAccount.id === existing.gl_account_id) return existing;
      return repo.patchGlAccount(resolvedCompanyId, code, input.glAccountId as number, await createUpdateAuditStamp());
    });

    return checkedResponse(await withAuditActors(toDto(row), row));
  } catch (err) {
    if (err instanceof DataError) throw new NotFoundError(`Control account ${code} not found`);
    throw err;
  }
}
