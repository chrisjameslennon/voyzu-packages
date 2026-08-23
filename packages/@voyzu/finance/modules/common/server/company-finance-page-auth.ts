export const companyFinancePageAuth = {
  required: true,
  minRole: "STANDARD",
  async authorize() {
    const { listSelectableFinanceCompaniesForCurrentUser } = await import(
      "@voyzu/finance/finance-companies/server"
    );

    return (await listSelectableFinanceCompaniesForCurrentUser()).length > 0
      ? "allow" as const
      : "denied" as const;
  },
} as const;
