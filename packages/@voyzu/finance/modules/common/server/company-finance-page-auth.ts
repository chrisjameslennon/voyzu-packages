export const companyFinancePageAuth = {
  required: true,
  minRole: "STANDARD",
  async authorize({ user }: { user: { role?: string } | null }) {
    const { listSelectableFinanceCompaniesForCurrentUser } = await import(
      "@voyzu/finance/finance-companies/server"
    );

    if ((await listSelectableFinanceCompaniesForCurrentUser()).length > 0) return "allow" as const;
    if (user?.role === "ADMIN") {
      const { redirect } = await import("next/navigation");
      redirect("/finance");
    }
    return "denied" as const;
  },
} as const;
