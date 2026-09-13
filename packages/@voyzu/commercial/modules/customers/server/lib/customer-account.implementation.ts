import type { CustomerAccount, CustomerAccountMethods } from "@voyzu/types/business-objects/customer-account";
import { customerData } from "./customer-data.implementation";

/** Commercial supplies account data only, never the platform-owned Party. */
export async function get({ id }: { id: number }): Promise<CustomerAccount | null> {
  const account = customerData.accounts.find(account => account.customerId === id);
  if (!account) return null;
  return {
    creditLimit: account.creditLimit,
    purchaseOrderRequired: account.purchaseOrderRequired,
  } satisfies CustomerAccount;
}

export async function adjustCreditLimit({
  id,
  amount,
}: {
  id: number;
  amount: number;
}): Promise<void> {
  const account = customerData.accounts.find(account => account.customerId === id);
  if (!account) throw new Error("Customer account not found");
  if (!Number.isFinite(amount)) throw new Error("Credit limit adjustment must be finite");
  account.creditLimit += amount;
  console.log("[voyzu] Customer credit limit adjustment", { id, amount });
}

export async function update({ id, changes }: Parameters<CustomerAccountMethods["update"]>[0]): Promise<void> {
  const account = customerData.accounts.find(account => account.customerId === id);
  if (!account) throw new Error("Customer account not found");
  if (changes.purchaseOrderRequired !== undefined) account.purchaseOrderRequired = changes.purchaseOrderRequired;
}

export const customerAccountMethods = {
  get,
  update,
  adjustCreditLimit,
} satisfies CustomerAccountMethods;
