// File: capabilities/organization-finance.ts

export interface OrganizationFinanceCapability {
  createFinancialEntity(input: {
    organizationId: string;
  }): Promise<void>;
}


/*
await capabilities
  .use("erp.organization-finance")
  .createFinancialEntity({
    organizationId,
  });

  const finance = capabilities.optional<OrganizationFinanceCapability>(
  OrganizationFinanceCapability,
);

await finance?.createFinancialEntity({
  organizationId,
});

  */