import { type NextRequest, NextResponse } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/finance/common/server";
import { renderHtmlToPdf } from "@voyzu/capability/pdf";
import { NotFoundError } from "@voyzu/capability/errors";
import { inputValidationError, serverError } from "@voyzu/capability/http";

import { renderBalanceSheetPdfHtml } from "../lib/balance-sheet-pdf-html";
import { getBalanceSheet } from "../lib/balance-sheet.service";

function booleanParam(searchParams: URLSearchParams, name: string, defaultValue = false): boolean {
  const value = searchParams.get(name);
  if (value == null) return defaultValue;
  return value === "true" || value === "1";
}

function safePdfFilename(raw: string | null): string {
  const stripped = (raw ?? "").replace(/\.pdf$/i, "");
  const slug = stripped.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug.slice(0, 100) || "balance_sheet";
}

function formattedGeneratedAt(): string {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function handleGetBalanceSheetPdf(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const asAtDate = searchParams.get("asAtDate") ?? undefined;
  const generatedAt = formattedGeneratedAt();
  const disposition = searchParams.get("disposition") === "inline" ? "inline" : "attachment";
  const filename = safePdfFilename(searchParams.get("filename"));

  try {
    const data = await getBalanceSheet(companyId, asAtDate);
    const html = await renderBalanceSheetPdfHtml({
      data,
      generatedAt,
      showAccountCode: booleanParam(searchParams, "showAccountCode"),
      showCompanyHeader: booleanParam(searchParams, "showCompanyHeader"),
      showCompanyFooter: booleanParam(searchParams, "showCompanyFooter"),
      showReportingCategories: booleanParam(searchParams, "showReportingCategories", true),
      showDecimals: booleanParam(searchParams, "showDecimals"),
    });
    const pdf = await renderHtmlToPdf({ html, generatedAt, landscape: false });

    return new NextResponse(pdf as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${filename}.pdf"`,
      },
    });
  } catch (err) {
    if (err instanceof NotFoundError) return inputValidationError(err.message);
    console.error("Balance sheet PDF error:", err);
    return serverError(err);
  }
}
