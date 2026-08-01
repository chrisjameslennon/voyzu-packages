import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/core/types/modules/core";

export const AP_BILL_JOURNAL_POSTING_COMPONENTS = {
  description: "Supplier bills debit purchase, expense, asset, and recoverable tax accounts and credit AP trade payables.",
  formula: "Dr Purchase / expense + Dr Tax on purchases = Cr AP payable",
  components: {
    dr_purchase: {
      title: "Purchase / expense",
      side: "DR",
      type: ComponentType.POSTING_CODE,
      code: "PURCHASE_ACCOUNT",
      allowedAccountTypes: ["EXPENSE", "ASSET"] satisfies readonly AccountType[],
    },
    dr_tax_on_purchases: {
      title: "Tax on purchases",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: "TAX_ON_PURCHASES",
    },
    cr_ap_payable: {
      title: "Accounts payable",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
    },
  },
} as const;

export const AP_BILL_PURCHASE_COMPONENT = AP_BILL_JOURNAL_POSTING_COMPONENTS.components.dr_purchase;
export const AP_BILL_TAX_ON_PURCHASES_COMPONENT = AP_BILL_JOURNAL_POSTING_COMPONENTS.components.dr_tax_on_purchases;
export const AP_BILL_AP_PAYABLE_COMPONENT = AP_BILL_JOURNAL_POSTING_COMPONENTS.components.cr_ap_payable;

export default AP_BILL_JOURNAL_POSTING_COMPONENTS;
