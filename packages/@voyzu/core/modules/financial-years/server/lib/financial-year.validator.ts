export function validateFinancialYearDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) return ["Start date must be before end date"];

  const inclusiveDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return inclusiveDays === 365 || inclusiveDays === 366
    ? []
    : ["Financial year must span exactly one calendar year (365 or 366 days)"];
}
