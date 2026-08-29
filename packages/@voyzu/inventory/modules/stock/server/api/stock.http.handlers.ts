import type { NextRequest } from "next/server";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import {
  businessRuleError,
  created,
  noContent,
  notFoundError,
  ok,
  parseBody,
  serverError,
} from "@voyzu/capability/http";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import type {
  AdjustmentRequest,
  MovementRequest,
  ReservationRequest,
  StockCountRequest,
  TransferRequest,
} from "../../types/stock.types";
import {
  adjustStock,
  completeStockCount,
  createStockCount,
  deleteStockCount,
  getStockCount,
  getStockOptions,
  issueStock,
  listStockActivity,
  listStockCounts,
  listStockPositions,
  receiveStock,
  reserveStock,
  saveStockCount,
  transferStock,
} from "../lib/stock.service";
type C = { params: Promise<{ id?: string }> };
const org = async () => {
  const x = await getSelectedOrganization();
  if (!x) throw new BusinessRuleError("Select an organization first");
  return x.id;
};
const fail = (e: unknown) =>
  e instanceof BusinessRuleError
    ? businessRuleError(e.message)
    : e instanceof NotFoundError
      ? notFoundError(e.message)
      : serverError(e);
export const handlePositions = async () => {
  try {
    return ok(await listStockPositions(await org()));
  } catch (e) {
    return fail(e);
  }
};
export const handleActivity = async () => {
  try {
    return ok(await listStockActivity(await org()));
  } catch (e) {
    return fail(e);
  }
};
export const handleOptions = async () => {
  try {
    return ok(await getStockOptions(await org()));
  } catch (e) {
    return fail(e);
  }
};
export async function handleReceive(r: NextRequest) {
  try {
    return created(
      await receiveStock(await org(), await parseBody<MovementRequest>(r)),
    );
  } catch (e) {
    return fail(e);
  }
}
export async function handleIssue(r: NextRequest) {
  try {
    return created(
      await issueStock(await org(), await parseBody<MovementRequest>(r)),
    );
  } catch (e) {
    return fail(e);
  }
}
export async function handleTransfer(r: NextRequest) {
  try {
    return created(
      await transferStock(await org(), await parseBody<TransferRequest>(r)),
    );
  } catch (e) {
    return fail(e);
  }
}
export async function handleReserve(r: NextRequest) {
  try {
    await reserveStock(await org(), await parseBody<ReservationRequest>(r));
    return noContent();
  } catch (e) {
    return fail(e);
  }
}
export async function handleAdjust(r: NextRequest) {
  try {
    return created(
      await adjustStock(await org(), await parseBody<AdjustmentRequest>(r)),
    );
  } catch (e) {
    return fail(e);
  }
}
export const handleCounts = async () => {
  try {
    return ok(await listStockCounts(await org()));
  } catch (e) {
    return fail(e);
  }
};
export async function handleCreateCount(r: NextRequest) {
  try {
    return created(
      await createStockCount(
        await org(),
        await parseBody<StockCountRequest>(r),
      ),
    );
  } catch (e) {
    return fail(e);
  }
}
export async function handleCount(_r: NextRequest, { params }: C) {
  try {
    const { id } = await params;
    const result = await getStockCount(await org(), Number(id));
    return result ? ok(result) : notFoundError("Stocktake was not found");
  } catch (e) {
    return fail(e);
  }
}
export async function handleSaveCount(r: NextRequest, { params }: C) {
  try {
    const { id } = await params;
    const body = await parseBody<
      StockCountRequest & { status: "DRAFT" | "IN_PROGRESS" }
    >(r);
    return ok(await saveStockCount(await org(), Number(id), body, body.status));
  } catch (e) {
    return fail(e);
  }
}
export async function handleCompleteCount(_r: NextRequest, { params }: C) {
  try {
    const { id } = await params;
    return ok(await completeStockCount(await org(), Number(id)));
  } catch (e) {
    return fail(e);
  }
}
export async function handleDeleteCount(_r: NextRequest, { params }: C) {
  try {
    const { id } = await params;
    await deleteStockCount(await org(), Number(id));
    return noContent();
  } catch (e) {
    return fail(e);
  }
}
