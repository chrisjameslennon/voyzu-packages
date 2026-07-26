import { type NextRequest, NextResponse } from "next/server";
import { countAuditEvents, listAuditEvents, exportAuditEvents, getAuditEvent } from "@voyzu-modules/core/common/audit/server";
import type { OrganizationAuditCountResponseDto } from "@voyzu-modules/core/types/modules/audit";

export async function handleCount(_req: NextRequest): Promise<NextResponse> {
  try {
    const count = await countAuditEvents();
    const response: OrganizationAuditCountResponseDto = { count };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[audit] handleCount error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleList(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;
    const list = await listAuditEvents({
      companyId: searchParams.get("companyId") ?? undefined,
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
    console.error("[audit] handleList error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleExportAll(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;
    const rows = await exportAuditEvents({
      companyId: searchParams.get("companyId") ?? undefined,
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
    console.error("[audit] handleExportAll error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function handleGetById(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const event = await getAuditEvent(Number(id));
    if (!event) return NextResponse.json({ error: "Audit event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (err) {
    console.error("[audit] handleGetById error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

