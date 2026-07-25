import { type NextRequest } from "next/server";
import { resolveApiCompanyIdFromPath } from "@voyzu/modules/common/server";
import { ok } from "@voyzu/capability/http";
import { serverError, inputValidationError } from "@voyzu/capability/http";
import { NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import type { ProfitLossBreakdownDto, ProfitLossDimensionSelectionDto } from "@voyzu/types/modules/company-reports";

import { getProfitLossAnalysis } from "../lib/profit-loss.service";

function parseSelections(raw: string | null): ProfitLossDimensionSelectionDto[] {
  if (!raw) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.dimensionCode !== "string" || typeof record.dimensionName !== "string" || !Array.isArray(record.valueNames)) {
      return [];
    }
    return [{
      dimensionCode: record.dimensionCode,
      dimensionName: record.dimensionName,
      valueNames: record.valueNames.filter((value): value is string => typeof value === "string"),
    }];
  });
}

function parseBreakdown(raw: string | null): ProfitLossBreakdownDto | null {
  if (!raw) return null;
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") return null;
  const record = parsed as Record<string, unknown>;
  if (typeof record.dimensionCode !== "string" || typeof record.dimensionName !== "string" || !Array.isArray(record.valueNames)) {
    return null;
  }
  return {
    dimensionCode: record.dimensionCode,
    dimensionName: record.dimensionName,
    valueNames: record.valueNames.filter((value): value is string => typeof value === "string"),
  };
}

export async function handleGetProfitLossAnalysis(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = await resolveApiCompanyIdFromPath(request);

  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate || !toDate) {
    return inputValidationError("fromDate and toDate are required");
  }

  try {
    const dimensionFilters = parseSelections(searchParams.get("dimensionFilters"));
    const breakdown = parseBreakdown(searchParams.get("breakdown"));
    const data = await getProfitLossAnalysis(companyId, fromDate, toDate, dimensionFilters, breakdown);
    return ok(data);
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof InputValidationError) return inputValidationError(err.message);
    if (err instanceof SyntaxError) return inputValidationError("Invalid dimension report parameters");
    console.error("Profit and loss dimensions error:", err);
    return serverError("Failed to generate profit and loss dimensions");
  }
}

