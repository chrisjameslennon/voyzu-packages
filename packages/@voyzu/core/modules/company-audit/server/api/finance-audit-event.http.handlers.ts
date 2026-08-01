import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/core/common/server";
import { getAuditEvent, listAuditEvents, exportAuditEvents } from "@voyzu/audit/server";
import type { CompanyAuditCountResponseDto } from "@voyzu/audit/types";

export async function handleFinanceCount(req: NextRequest): Promise<NextResponse> {
  try {
    const companyId = String(await resolveApiCompanyIdFromPath(req));

    const list = await listAuditEvents({ companyId });
    const response: CompanyAuditCountResponseDto = { count: list.totalMatching };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[finance-audit] handleFinanceCount error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleFinanceList(req: NextRequest): Promise<NextResponse> {
  try {
    const companyId = String(await resolveApiCompanyIdFromPath(req));

    const { searchParams } = req.nextUrl;
    const list = await listAuditEvents({
      companyId,
      entityType: searchParams.get("entityType") ?? undefined,
      entityCode: searchParams.get("entityCode") ?? undefined,
      entityId: searchParams.get("entityId") ?? undefined,
      mutationId: searchParams.get("mutationId") ?? undefined,
      actorId: searchParams.get("actorId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined,
    });
    return NextResponse.json(list);
  } catch (err) {
    console.error("[finance-audit] handleFinanceList error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleFinanceExportAll(req: NextRequest): Promise<NextResponse> {
  try {
    const companyId = String(await resolveApiCompanyIdFromPath(req));

    const { searchParams } = req.nextUrl;
    const rows = await exportAuditEvents({
      companyId,
      entityType: searchParams.get("entityType") ?? undefined,
      entityCode: searchParams.get("entityCode") ?? undefined,
      entityId: searchParams.get("entityId") ?? undefined,
      mutationId: searchParams.get("mutationId") ?? undefined,
      actorId: searchParams.get("actorId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[finance-audit] handleFinanceExportAll error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleFinanceGetById(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const companyId = String(await resolveApiCompanyIdFromPath(req));

    const { id } = await params;
    const event = await getAuditEvent(Number(id));
    if (!event || String(event.companyId ?? "") !== companyId) {
      return NextResponse.json({ error: "Audit event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("[finance-audit] handleFinanceGetById error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
