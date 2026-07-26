import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu-modules/all-modules/common/server";

import type { EntityNotFoundErrorResponseDto, InternalServerErrorResponseDto, InputValidationErrorResponseDto } from "@voyzu/types/errors";
import type { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto } from "@voyzu-modules/types/modules/inventory-ledger";
import { serverError } from "@voyzu/capability/http";
import { notFoundError, ok } from "@voyzu/capability/http";

import { getInventoryLedgerEntry, listInventoryLedgerEntries } from "../lib/inventory-ledger.service";

function companyIdFrom(req: NextRequest): Promise<number> {
  return resolveApiCompanyIdFromPath(req);
}

export async function handleListInventoryEntries(
  req: NextRequest,
): Promise<NextResponse<InventoryLedgerEntryResponseDto[] | InputValidationErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  try {
    return ok(await listInventoryLedgerEntries(companyId));
  } catch (err) {
    return serverError(err);
  }
}

export async function handleGetInventoryEntry(
  req: NextRequest,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse<InventoryLedgerEntryDetailResponseDto | InputValidationErrorResponseDto | EntityNotFoundErrorResponseDto | InternalServerErrorResponseDto>> {
  const companyId = await companyIdFrom(req);
  const { code } = await context.params;
  try {
    const entry = await getInventoryLedgerEntry(companyId, decodeURIComponent(code));
    if (!entry) return notFoundError("Inventory ledger entry not found");
    return ok(entry);
  } catch (err) {
    return serverError(err);
  }
}


