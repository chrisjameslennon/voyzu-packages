export interface OperationBlocker {
  code: string;
  message: string;
}

export function Delete(
  records: Array<{ name: string; inUse: boolean }>,
): OperationBlocker[] {
  const used = records.filter((record) => record.inUse);
  return used.length
    ? [
        {
          code: "IN_USE",
          message: `In-use records cannot be deleted: ${used.map((record) => record.name).join(", ")}`,
        },
      ]
    : [];
}
