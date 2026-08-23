import { type NextRequest, NextResponse } from "next/server";

import type { CodesRequestDto, FilterRequestDto } from "@voyzu/types/params";
import type { BusinessRuleErrorResponseDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types/errors";
import type {
  BankCashAccountBatchPatchRequestDto,
  BankCashAccountBatchUpdateRequestDto,
  BankCashAccountCreateRequestDto,
  BankCashAccountPatchRequestDto,
  BankCashAccountResponseDto,
  BankCashAccountUpdateRequestDto,
} from "@voyzu/finance/types/modules/bank-cash-accounts";
import { businessRuleError, conflictError, created, inputValidationError, noContent, notFoundError, ok, parseBody, serverError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import {
  activateBankCashAccount,
  activateBankCashAccounts,
  batchCreateBankCashAccounts,
  batchDeleteBankCashAccounts,
  batchGetBankCashAccounts,
  batchPatchBankCashAccounts,
  batchUpdateBankCashAccounts,
  createBankCashAccount,
  deactivateBankCashAccount,
  deactivateBankCashAccounts,
  deleteBankCashAccount,
  filterBankCashAccounts,
  getBankCashAccount,
  listBankCashAccounts,
  patchBankCashAccount,
  searchBankCashAccounts,
  updateBankCashAccount,
} from "../lib/bank-cash-account.service";
import { resolveApiSettingsScope } from "../../../server/settings-scope";

export async function handleList(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await listBankCashAccounts(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleFilter(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | InternalServerErrorResponseDto>> {
  try {
    const { filters, options } = await parseBody<FilterRequestDto>(req);
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await filterBankCashAccounts(filters ?? [], options, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleSearch(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return inputValidationError("Query parameter 'q' is required");
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await searchBankCashAccounts(q, undefined, companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleCreate(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await createBankCashAccount(await parseBody<BankCashAccountCreateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

export async function handleGet(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<BankCashAccountResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);
    const { companyId } = await resolveApiSettingsScope(req);
    const account = await getBankCashAccount(decodedCode, companyId);
    if (!account) return notFoundError(`Bank / Cash Account ${decodedCode} not found`);
    return ok(account);
  } catch (err) {
    return serverError(err);
  }
}

export async function handleUpdate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<BankCashAccountResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await updateBankCashAccount(decodeURIComponent(code), await parseBody<BankCashAccountUpdateRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handlePatch(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<BankCashAccountResponseDto | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await patchBankCashAccount(decodeURIComponent(code), await parseBody<BankCashAccountPatchRequestDto>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDelete(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    await deleteBankCashAccount(decodeURIComponent(code), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleActivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<BankCashAccountResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateBankCashAccount(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleDeactivate(req: NextRequest, { params }: { params: Promise<{ code: string }> }): Promise<NextResponse<BankCashAccountResponseDto | BusinessRuleErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { code } = await params;
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateBankCashAccount(decodeURIComponent(code), companyId));
  } catch (err) {
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

async function parseCodes(req: NextRequest): Promise<string[]> {
  const { codes } = await parseBody<CodesRequestDto>(req);
  return codes;
}

export async function handleBatchGet(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchGetBankCashAccounts(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    return serverError(err);
  }
}

export async function handleBatchCreate(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | ConflictErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return created(await batchCreateBankCashAccounts(await parseBody<BankCashAccountCreateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof ConflictError) return conflictError(err.message);
    return serverError(err);
  }
}

export async function handleBatchUpdate(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchUpdateBankCashAccounts(await parseBody<BankCashAccountBatchUpdateRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchPatch(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await batchPatchBankCashAccounts(await parseBody<BankCashAccountBatchPatchRequestDto[]>(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDelete(req: NextRequest): Promise<NextResponse<null | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    await batchDeleteBankCashAccounts(await parseCodes(req), companyId);
    return noContent();
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchActivate(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await activateBankCashAccounts(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}

export async function handleBatchDeactivate(req: NextRequest): Promise<NextResponse<BankCashAccountResponseDto[] | BusinessRuleErrorResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  try {
    const { companyId } = await resolveApiSettingsScope(req);
    return ok(await deactivateBankCashAccounts(await parseCodes(req), companyId));
  } catch (err) {
    if (err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof BusinessRuleError) return businessRuleError(err.message);
    if (err instanceof NotFoundError) return notFoundError(err.message);
    return serverError(err);
  }
}
