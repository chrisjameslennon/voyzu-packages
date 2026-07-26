import { getDb } from "@voyzu/capability/db";
import { NotFoundError, InputValidationError } from "@voyzu/capability/errors";
import type { ProfitLossResponseDto } from "@voyzu-modules/types/modules/company-reports";
import type {
  ProfitLossBreakdownDto,
  ProfitLossAnalysisLineDto,
  ProfitLossAnalysisResponseDto,
  ProfitLossDimensionSelectionDto,
} from "@voyzu-modules/types/modules/company-reports";

import { ProfitLossRepo } from "../db/profit-loss.repo";
import type { ProfitLossDimensionSourceLine } from "../db/profit-loss.repo";

async function fetchCompany(db: ReturnType<typeof getDb>, companyId: number): Promise<{ name: string; reportLine1: string | null; reportLine2: string | null; reportFooter: string | null; baseCurrencyCode: string }> {
  const { rows } = await db.query(
    `SELECT name, report_line_1, report_line_2, report_footer, base_currency_code FROM company WHERE id = $1`,
    [companyId],
  );
  if (!rows[0]) throw new NotFoundError(`Company id ${companyId} not found`);
  const r = rows[0] as Record<string, unknown>;
  return {
    name: String(r.name),
    reportLine1: r.report_line_1 == null ? null : String(r.report_line_1),
    reportLine2: r.report_line_2 == null ? null : String(r.report_line_2),
    reportFooter: r.report_footer == null ? null : String(r.report_footer),
    baseCurrencyCode: String(r.base_currency_code),
  };
}

export async function getProfitLoss(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<ProfitLossResponseDto> {
  const db = getDb();
  const repo = new ProfitLossRepo(db);

  const [company, lines] = await Promise.all([
    fetchCompany(db, companyId),
    repo.getLines(companyId, fromDate, toDate),
  ]);

  const incomeLines = lines.filter((line) => line.section === "INCOME");
  const expenseLines = lines.filter((line) => line.section === "EXPENSE");
  const totalIncome = incomeLines.reduce((sum, line) => sum + line.amount, 0);
  const totalExpenses = expenseLines.reduce((sum, line) => sum + line.amount, 0);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    fromDate,
    toDate,
    incomeLines,
    expenseLines,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
  };
}

export async function getProfitLossAnalysis(
  companyId: number,
  fromDate: string,
  toDate: string,
  dimensionFilters: ProfitLossDimensionSelectionDto[],
  breakdown: ProfitLossBreakdownDto | null,
): Promise<ProfitLossAnalysisResponseDto> {
  const db = getDb();
  const repo = new ProfitLossRepo(db);

  const [company, sourceLines] = await Promise.all([
    fetchCompany(db, companyId),
    repo.getDimensionSourceLines(companyId, fromDate, toDate),
  ]);

  const { filters, breakdown: validBreakdown } = await validateDimensionSelections(db, companyId, dimensionFilters, breakdown);
  const filteredLines = applyDimensionFilters(sourceLines, filters);
  const { lines, columns } = aggregateDimensionLines(filteredLines, validBreakdown);
  const incomeLines = lines.filter((line) => line.section === "INCOME");
  const expenseLines = lines.filter((line) => line.section === "EXPENSE");
  const totalIncome = incomeLines.reduce((sum, line) => sum + line.amount, 0);
  const totalExpenses = expenseLines.reduce((sum, line) => sum + line.amount, 0);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    fromDate,
    toDate,
    dimensionFilters: filters,
    breakdown: validBreakdown,
    breakdownColumns: columns,
    incomeLines,
    expenseLines,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
  };
}

async function validateDimensionSelections(
  db: ReturnType<typeof getDb>,
  companyId: number,
  filters: ProfitLossDimensionSelectionDto[],
  breakdown: ProfitLossBreakdownDto | null,
): Promise<{ filters: ProfitLossDimensionSelectionDto[]; breakdown: ProfitLossBreakdownDto | null }> {
  const { rows } = await db.query(
    `SELECT d.code AS dimension_code, d.name AS dimension_name, dv.name AS value_name
     FROM dimension d
     LEFT JOIN dimension_value dv ON dv.company_id = d.company_id AND dv.dimension_id = d.id AND dv.status = 'ACTIVE'
     WHERE d.company_id = $1 AND d.status = 'ACTIVE'
     ORDER BY d.name, dv.name`,
    [companyId],
  );

  const dimensionLookup = new Map<string, { name: string; values: Set<string> }>();
  for (const row of rows as Array<Record<string, unknown>>) {
    const code = String(row.dimension_code);
    const existing = dimensionLookup.get(code) ?? { name: String(row.dimension_name), values: new Set<string>() };
    if (row.value_name != null) existing.values.add(String(row.value_name));
    dimensionLookup.set(code, existing);
  }

  const validateValues = (selection: ProfitLossDimensionSelectionDto): ProfitLossDimensionSelectionDto => {
    const dimension = dimensionLookup.get(selection.dimensionCode);
    if (!dimension) throw new InputValidationError(`Unknown or inactive dimension ${selection.dimensionCode}`);
    const valueNames = [...new Set(selection.valueNames)];
    for (const valueName of valueNames) {
      if (!dimension.values.has(valueName)) {
        throw new InputValidationError(`Unknown or inactive dimension value ${selection.dimensionCode}=${valueName}`);
      }
    }
    return { dimensionCode: selection.dimensionCode, dimensionName: dimension.name, valueNames };
  };

  const validFilters = filters.filter((selection) => selection.valueNames.length > 0).map(validateValues);
  let validBreakdown: ProfitLossBreakdownDto | null = null;
  if (breakdown) {
    const dimension = dimensionLookup.get(breakdown.dimensionCode);
    if (!dimension) throw new InputValidationError(`Unknown or inactive dimension ${breakdown.dimensionCode}`);
    let valueNames = breakdown.valueNames.length
      ? [...new Set(breakdown.valueNames)]
      : [...dimension.values];
    for (const valueName of valueNames) {
      if (!dimension.values.has(valueName)) {
        throw new InputValidationError(`Unknown or inactive dimension value ${breakdown.dimensionCode}=${valueName}`);
      }
    }
    const matchingFilter = validFilters.find((filter) => filter.dimensionCode === breakdown.dimensionCode);
    if (matchingFilter) {
      valueNames = valueNames.filter((valueName) => matchingFilter.valueNames.includes(valueName));
    }
    validBreakdown = {
      dimensionCode: breakdown.dimensionCode,
      dimensionName: dimension.name,
      valueNames,
    };
  }

  return { filters: validFilters, breakdown: validBreakdown };
}

function applyDimensionFilters(
  lines: ProfitLossDimensionSourceLine[],
  filters: ProfitLossDimensionSelectionDto[],
): ProfitLossDimensionSourceLine[] {
  if (!filters.length) return lines;
  return lines.filter((line) =>
    filters.every((filter) => filter.valueNames.includes(line.dimensions[filter.dimensionCode])),
  );
}

function aggregateDimensionLines(
  sourceLines: ProfitLossDimensionSourceLine[],
  breakdown: ProfitLossBreakdownDto | null,
): { lines: ProfitLossAnalysisLineDto[]; columns: string[] } {
  const hasBreakdown = Boolean(breakdown);
  const configuredColumns = breakdown?.valueNames ?? [];
  const hasUnspecified = hasBreakdown && sourceLines.some((line) => !line.dimensions[breakdown!.dimensionCode]);
  const columns = hasBreakdown
    ? [...configuredColumns, ...(hasUnspecified ? ["Unspecified"] : []), "Total"]
    : ["Amount"];
  const lineMap = new Map<string, ProfitLossAnalysisLineDto>();

  for (const sourceLine of sourceLines) {
    if (hasBreakdown) {
      const rawColumn = sourceLine.dimensions[breakdown!.dimensionCode] ?? "Unspecified";
      if (!columns.includes(rawColumn)) continue;
      addAmount(sourceLine, rawColumn);
    } else {
      addAmount(sourceLine, "Amount");
    }
  }

  function addAmount(sourceLine: ProfitLossDimensionSourceLine, column: string) {
    const key = [
      sourceLine.section,
      sourceLine.glAccountId,
      sourceLine.categoryCode ?? "",
    ].join("\u0000");
    const existing = lineMap.get(key) ?? {
      glAccountId: sourceLine.glAccountId,
      glAccountCode: sourceLine.glAccountCode,
      glAccountName: sourceLine.glAccountName,
      section: sourceLine.section,
      amount: 0,
      amountsByColumn: {},
      categoryCode: sourceLine.categoryCode,
      categoryName: sourceLine.categoryName,
      categorySequence: sourceLine.categorySequence,
    };
    existing.amountsByColumn[column] = (existing.amountsByColumn[column] ?? 0) + sourceLine.amount;
    existing.amount += sourceLine.amount;
    lineMap.set(key, existing);
  }

  const lines = [...lineMap.values()]
    .map((line) => {
      if (hasBreakdown) {
        line.amountsByColumn.Total = columns
          .filter((column) => column !== "Total")
          .reduce((sum, column) => sum + (line.amountsByColumn[column] ?? 0), 0);
        line.amount = line.amountsByColumn.Total;
      }
      return line;
    })
    .filter((line) => line.amount !== 0)
    .sort((a, b) =>
      (a.section === b.section ? 0 : a.section === "INCOME" ? -1 : 1) ||
      (a.categorySequence ?? 9999) - (b.categorySequence ?? 9999) ||
      (a.categoryCode ?? "").localeCompare(b.categoryCode ?? "") ||
      a.glAccountCode.localeCompare(b.glAccountCode),
    );

  const visibleColumns = hasBreakdown
    ? columns.filter((column) => column === "Total" || lines.some((line) => (line.amountsByColumn[column] ?? 0) !== 0))
    : columns;

  return { lines, columns: visibleColumns };
}

