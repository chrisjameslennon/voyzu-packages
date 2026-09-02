import type { NextRequest } from "next/server";
import { businessRuleError, conflictError, created, noContent, notFoundError, ok, parseBody, serverError } from "@voyzu/capability/http";
import { BusinessRuleError, ConflictError, NotFoundError } from "@voyzu/capability/errors";
import type { ItemCategoryChangeRequestDto, ItemCodeListRequestDto, ItemCreateRequestDto, ItemPatchRequestDto } from "../../types/item.types";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { activateItem, activateItems, changeItemsCategory, createItem, deactivateItem, deactivateItems, deleteItem, deleteItems, getItem, getItemDeletionImpact, listItemCategories, listItems, patchItem, reserveItemSku } from "../lib/item.service";

type RouteContext = { params: Promise<{ sku: string }> };
function errorResponse(error: unknown) {
  if (error instanceof BusinessRuleError) return businessRuleError(error.message);
  if (error instanceof ConflictError) return conflictError(error.message);
  if (error instanceof NotFoundError) return notFoundError(error.message);
  return serverError(error);
}
async function organizationId() {
  const organization = await getSelectedOrganization();
  if (!organization) throw new BusinessRuleError("Select an organization before managing inventory items");
  return organization.id;
}

export async function handleList(request: NextRequest) { try { return ok(await listItems(await organizationId(), request.nextUrl.searchParams.get("q") ?? undefined)); } catch (error) { return errorResponse(error); } }
export async function handleOptions() { try { return ok({ categories: await listItemCategories(await organizationId()) }); } catch (error) { return errorResponse(error); } }
export async function handleReserveSku() { try { await organizationId(); return ok(await reserveItemSku()); } catch (error) { return errorResponse(error); } }
export async function handleGet(_request: NextRequest, { params }: RouteContext) { try { const { sku } = await params; const item = await getItem(await organizationId(), sku); return item ? ok(item) : notFoundError(`Item ${sku} was not found`); } catch (error) { return errorResponse(error); } }
export async function handleCreate(request: NextRequest) { try { return created(await createItem(await organizationId(), await parseBody<ItemCreateRequestDto>(request))); } catch (error) { return errorResponse(error); } }
export async function handlePatch(request: NextRequest, { params }: RouteContext) { try { const { sku } = await params; return ok(await patchItem(await organizationId(), sku, await parseBody<ItemPatchRequestDto>(request))); } catch (error) { return errorResponse(error); } }
export async function handleDelete(_request: NextRequest, { params }: RouteContext) { try { const { sku } = await params; await deleteItem(await organizationId(), sku); return noContent(); } catch (error) { return errorResponse(error); } }
export async function handleActivate(_request: NextRequest, { params }: RouteContext) { try { const { sku } = await params; return ok(await activateItem(await organizationId(), sku)); } catch (error) { return errorResponse(error); } }
export async function handleDeactivate(_request: NextRequest, { params }: RouteContext) { try { const { sku } = await params; return ok(await deactivateItem(await organizationId(), sku)); } catch (error) { return errorResponse(error); } }
export async function handleBatchActivate(request: NextRequest) { try { const { skus } = await parseBody<ItemCodeListRequestDto>(request); return ok(await activateItems(await organizationId(), skus)); } catch (error) { return errorResponse(error); } }
export async function handleBatchDeactivate(request: NextRequest) { try { const { skus } = await parseBody<ItemCodeListRequestDto>(request); return ok(await deactivateItems(await organizationId(), skus)); } catch (error) { return errorResponse(error); } }
export async function handleBatchChangeCategory(request: NextRequest) { try { const { skus, categoryId } = await parseBody<ItemCategoryChangeRequestDto>(request); return ok(await changeItemsCategory(await organizationId(), skus, categoryId)); } catch (error) { return errorResponse(error); } }
export async function handleBatchDelete(request: NextRequest) { try { const { skus } = await parseBody<ItemCodeListRequestDto>(request); await deleteItems(await organizationId(), skus); return noContent(); } catch (error) { return errorResponse(error); } }
export async function handleDeletionImpact(request: NextRequest) { try { const { skus } = await parseBody<ItemCodeListRequestDto>(request); return ok(await getItemDeletionImpact(await organizationId(), skus)); } catch (error) { return errorResponse(error); } }
